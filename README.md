# 🎓 Campus Intelligence Dashboard

A Unified Campus Intelligence Dashboard with AI Assistant built for MARS Open Projects 2026.

## 🔗 Demo

- **Live App:** `<add your Vercel URL here>`
- **Demo Video:** `<add your Google Drive / YouTube link here>`

---

## Architecture

```
campus-intel/
├── frontend/                  # Next.js 14 — dashboard UI + AI chat
│   ├── src/app/               # App Router pages & API routes
│   │   ├── page.tsx           # Main dashboard page
│   │   ├── api/chat/          # AI assistant endpoint (agentic DeepSeek loop)
│   │   ├── api/health/        # MCP server health polling
│   │   └── api/dashboard/     # Aggregated widget data
│   ├── src/components/
│   │   ├── chat/ChatPanel     # AI chat UI with tool call visualization
│   │   └── dashboard/         # Widget cards + server status bar
│   └── src/lib/mcp-client.ts  # MCP server communication layer
└── mcp-servers/
    ├── library/               # :3001 — Book search & availability
    ├── cafeteria/             # :3002 — Daily menus & specials
    ├── events/                # :3003 — Campus events & workshops
    └── academics/             # :3004 — Courses, deadlines, handbook
```

### How it works

1. Each campus data source runs as an independent **MCP (Model Context Protocol) Server**
2. On chat, the Next.js API fetches all MCP manifests to build a live tool list for DeepSeek
3. DeepSeek's agentic loop calls the right server(s), gets live data, and synthesises a response
4. The dashboard widgets independently query each MCP server for summary cards
5. No single giant database — every query is answered fresh from the source

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS, Framer Motion |
| MCP Servers | Node.js + Express (one per data source) |
| AI Integration | DeepSeek API (`deepseek-chat`) with function calling |
| Hosting | Vercel (frontend), Render (MCP servers) |

---

## Quick Start

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment variables

```bash
cp frontend/.env.example frontend/.env.local
```

Edit `frontend/.env.local` and add your key:
```
DEEPSEEK_API_KEY=sk-...
```

### 3. Start MCP servers

```bash
cd mcp-servers/library   && npm start   # :3001
cd mcp-servers/cafeteria && npm start   # :3002
cd mcp-servers/events    && npm start   # :3003
cd mcp-servers/academics && npm start   # :3004
```

### 4. Start the frontend

```bash
cd frontend && npm run dev   # http://localhost:3000
```

Or run everything at once from the root:
```bash
npm run dev
```

---

## MCP Server Tool Reference

| Server | Port | Tools |
|---|---|---|
| Library | 3001 | `search_books`, `check_availability`, `get_due_dates` |
| Cafeteria | 3002 | `get_menu`, `get_specials`, `get_hours` |
| Events | 3003 | `list_events`, `search_events`, `get_event_details` |
| Academics | 3004 | `get_deadlines`, `search_courses`, `get_handbook` |

Each server exposes:
- `GET /mcp/manifest` — tool definitions (name, description, input schema)
- `POST /mcp/invoke` — execute a tool with `{ tool, input }`
- `GET /health` — liveness check

---

## Features

- 🤖 **AI Assistant** — Natural language queries routed to the right MCP server(s) in real time
- 📚 **Library** — Book search, availability, shelf location
- 🍽️ **Cafeteria** — Today's menu by meal, daily specials
- 📅 **Events** — Upcoming workshops, fests, club events with spot availability
- 📖 **Academics** — Assignment deadlines, course schedules, handbook search
- 🔄 **Live Data** — No stale cache; fetched fresh on every request
- 🩺 **Server Health Bar** — Real-time status indicator for all MCP servers
- 🔍 **Tool Call Transparency** — Chat UI shows which servers were queried and the raw data

---

## Deployment

**Frontend → Vercel**
```bash
cd frontend && vercel deploy
```
Set these environment variables in the Vercel dashboard:
- `DEEPSEEK_API_KEY`
- `LIBRARY_MCP_URL`, `CAFETERIA_MCP_URL`, `EVENTS_MCP_URL`, `ACADEMICS_MCP_URL`

**MCP Servers → Render**

Use the included `render.yaml` at the repo root for one-click deployment:
```bash
# In Render dashboard: New → Blueprint → point to this repo
```
Or deploy each `mcp-servers/<name>/` folder as a separate Render Web Service with `npm start`.
