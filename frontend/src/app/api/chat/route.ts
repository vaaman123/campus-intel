import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { MCP_SERVERS, invokeMCPTool, resolveUrl } from "@/lib/mcp-client";

// Lazy-init DeepSeek client to avoid build-time env var checks
let _client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com",
    });
  }
  return _client;
}

// Build DeepSeek tools from all MCP server manifests (OpenAI function-calling format)
async function buildTools(): Promise<OpenAI.Chat.Completions.ChatCompletionTool[]> {
  const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [];

  const manifests = await Promise.allSettled(
    MCP_SERVERS.map(async (server) => {
      try {
        const res = await fetch(resolveUrl(`${server.url}/manifest`));
        if (!res.ok) return null;
        const manifest = await res.json();
        return { serverId: server.id, manifest };
      } catch {
        return null;
      }
    })
  );

  for (const result of manifests) {
    if (result.status !== "fulfilled" || !result.value) continue;
    const { serverId, manifest } = result.value;

    for (const tool of manifest.tools) {
      tools.push({
        type: "function",
        function: {
          name: `${serverId}__${tool.name}`,
          description: `[${manifest.displayName}] ${tool.description}`,
          parameters: tool.inputSchema,
        },
      });
    }
  }

  return tools;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const tools = await buildTools();

    const systemPrompt = `You are Campus Intel, a helpful AI assistant for students at this university campus.
You have access to real-time data from four campus systems via tools:
- Campus Library: book search, availability, due dates
- Cafeteria: menus, specials, hours
- Campus Events: upcoming events, workshops, club activities
- Academics: course info, deadlines, handbook policies

Guidelines:
- Always use the available tools to fetch live data instead of making up answers.
- When answering, cite which system the data came from.
- If a question spans multiple systems (e.g. "what's on today?"), query all relevant ones.
- Be concise but friendly. Use bullet points for lists.
- Today's date: ${new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.
- If a server appears to be offline, mention it gracefully and answer from other available sources.
- Format responses in Markdown for readability.`;

    // If no tools available (all servers offline), return a friendly message
    if (tools.length === 0) {
      return NextResponse.json({
        text: "⚠️ All campus MCP servers appear to be offline. Please make sure the library, cafeteria, events, and academics servers are running, then try again.",
        toolCalls: [],
      });
    }

    // Agentic loop — DeepSeek can call tools multiple times
    const msgHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];
    let finalText = "";
    const toolCallLog: { tool: string; server: string; result: unknown }[] = [];

    let iteration = 0;
    const MAX_ITERATIONS = 6;

    while (iteration < MAX_ITERATIONS) {
      iteration++;

      const response = await getClient().chat.completions.create({
        model: "deepseek-chat",
        max_tokens: 2048,
        messages: msgHistory,
        tools,
        tool_choice: tools.length > 0 ? "auto" : undefined,
      });

      const choice = response.choices[0];
      const assistantMessage = choice.message;

      // Collect text content
      if (assistantMessage.content) {
        finalText = assistantMessage.content;
      }

      // If done (no tool calls), break
      if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
        break;
      }

      // Add assistant message to history
      msgHistory.push({
        role: "assistant",
        content: assistantMessage.content,
        tool_calls: assistantMessage.tool_calls,
      });

      // Execute all tool calls in parallel
      const toolResults = await Promise.all(
        assistantMessage.tool_calls.map(async (toolCall) => {
          const [serverId, toolName] = toolCall.function.name.split("__");
          const input = JSON.parse(toolCall.function.arguments || "{}");
          const mcpResult = await invokeMCPTool(serverId, toolName, input as Record<string, unknown>);

          toolCallLog.push({
            tool: toolCall.function.name,
            server: serverId,
            result: mcpResult.result,
          });

          return {
            role: "tool" as const,
            tool_call_id: toolCall.id,
            content: JSON.stringify(mcpResult.success ? mcpResult.result : { error: mcpResult.error }),
          };
        })
      );

      msgHistory.push(...toolResults);
    }

    return NextResponse.json({
      text: finalText,
      toolCalls: toolCallLog,
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Failed to process your request. Please try again." },
      { status: 500 }
    );
  }
}
