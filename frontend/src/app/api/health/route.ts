import { NextResponse } from "next/server";
import { mcpServers } from "@/lib/mcp-data";

export async function GET() {
  const servers = Object.entries(mcpServers).map(([id, srv]) => ({
    id,
    name: srv.displayName,
    online: true,
    status: "ok",
  }));

  return NextResponse.json({ servers, timestamp: new Date().toISOString() });
}
