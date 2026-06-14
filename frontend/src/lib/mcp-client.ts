export interface MCPServer {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface MCPManifest {
  server: string;
  displayName: string;
  description: string;
  version: string;
  tools: MCPTool[];
}

export interface MCPInvokeResult {
  success: boolean;
  tool: string;
  result: unknown;
  error?: string;
}

// Resolve relative URLs to absolute for server-side fetch
export function resolveUrl(path: string): string {
  if (path.startsWith("http")) return path;
  // On Vercel, use VERCEL_URL or construct from env
  const base = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_VERCEL_URL 
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000";
  return `${base}${path}`;
}

export const MCP_SERVERS: MCPServer[] = [
  {
    id: "library",
    name: "Campus Library",
    url: process.env.LIBRARY_MCP_URL || "/api/mcp/library",
    icon: "📚",
    color: "#7c6af5",
  },
  {
    id: "cafeteria",
    name: "Cafeteria",
    url: process.env.CAFETERIA_MCP_URL || "/api/mcp/cafeteria",
    icon: "🍽️",
    color: "#2dd4a0",
  },
  {
    id: "events",
    name: "Campus Events",
    url: process.env.EVENTS_MCP_URL || "/api/mcp/events",
    icon: "📅",
    color: "#f5a623",
  },
  {
    id: "academics",
    name: "Academics",
    url: process.env.ACADEMICS_MCP_URL || "/api/mcp/academics",
    icon: "📖",
    color: "#f56b8a",
  },
];

export async function getMCPManifest(serverId: string): Promise<MCPManifest | null> {
  const server = MCP_SERVERS.find((s) => s.id === serverId);
  if (!server) return null;
  try {
    const res = await fetch(resolveUrl(`${server.url}/manifest`), { 
      signal: AbortSignal.timeout(15000),
      next: { revalidate: 60 } 
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function invokeMCPTool(
  serverId: string,
  tool: string,
  input: Record<string, unknown>
): Promise<MCPInvokeResult> {
  const server = MCP_SERVERS.find((s) => s.id === serverId);
  if (!server) {
    return { success: false, tool, result: null, error: `Server ${serverId} not found` };
  }
  try {
    const res = await fetch(resolveUrl(`${server.url}/invoke`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tool, input }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Unknown error" }));
      return { success: false, tool, result: null, error: err.error };
    }
    return res.json();
  } catch (err) {
    return { success: false, tool, result: null, error: String(err) };
  }
}

export async function checkServerHealth(serverId: string): Promise<boolean> {
  const server = MCP_SERVERS.find((s) => s.id === serverId);
  if (!server) return false;
  try {
    const res = await fetch(`${server.url}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}
