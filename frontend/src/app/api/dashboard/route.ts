import { NextResponse } from "next/server";
import { invokeMCPDirect } from "@/lib/mcp-data";

export async function GET() {
  const [menuRes, eventsRes, deadlinesRes, booksRes] = await Promise.allSettled([
    invokeMCPDirect("cafeteria", "get_menu", { meal: "all" }),
    invokeMCPDirect("events", "list_events", { upcoming_only: true }),
    invokeMCPDirect("academics", "get_deadlines", { days_ahead: 7 }),
    invokeMCPDirect("library", "search_books", { query: "computer science", available_only: true }),
  ]);

  return NextResponse.json(
    {
      cafeteria: menuRes.status === "fulfilled" ? menuRes.value.result : null,
      events: eventsRes.status === "fulfilled" ? eventsRes.value.result : null,
      deadlines: deadlinesRes.status === "fulfilled" ? deadlinesRes.value.result : null,
      library: booksRes.status === "fulfilled" ? booksRes.value.result : null,
      fetchedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
