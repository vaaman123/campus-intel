import { NextResponse } from "next/server";
import { invokeMCPTool } from "@/lib/mcp-client";

export async function GET() {
  const [menuRes, eventsRes, deadlinesRes, booksRes] = await Promise.allSettled([
    invokeMCPTool("cafeteria", "get_menu", { meal: "all" }),
    invokeMCPTool("events", "list_events", { upcoming_only: true }),
    invokeMCPTool("academics", "get_deadlines", { days_ahead: 7 }),
    invokeMCPTool("library", "search_books", { query: "computer science", available_only: true }),
  ]);

  return NextResponse.json({
    cafeteria: menuRes.status === "fulfilled" ? menuRes.value.result : null,
    events: eventsRes.status === "fulfilled" ? eventsRes.value.result : null,
    deadlines: deadlinesRes.status === "fulfilled" ? deadlinesRes.value.result : null,
    library: booksRes.status === "fulfilled" ? booksRes.value.result : null,
    fetchedAt: new Date().toISOString(),
  });
}
