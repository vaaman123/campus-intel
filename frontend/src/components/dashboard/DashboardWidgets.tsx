"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Calendar, UtensilsCrossed, Clock, AlertCircle } from "lucide-react";

interface DashboardData {
  cafeteria: {
    day: string;
    menu: { breakfast: string[]; lunch: string[]; dinner: string[]; specials: string[] };
  } | null;
  events: { count: number; events: CampusEvent[] } | null;
  deadlines: { count: number; deadlines: Deadline[] } | null;
  library: { count: number; books: Book[] } | null;
}

interface CampusEvent {
  id: string;
  title: string;
  club: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  capacity: number;
  registered: number;
}

interface Deadline {
  id: string;
  type: string;
  course: string;
  title: string;
  dueDate: string;
  dueTime: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  available: number;
  location: string;
}

function CardShell({ title, icon, color, children, delay = 0 }: {
  title: string; icon: React.ReactNode; color: string; children: React.ReactNode; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-2xl overflow-hidden flex flex-col"
    >
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}22`, color }}
        >
          {icon}
        </div>
        <h3 className="font-semibold text-fog text-sm tracking-wide uppercase">{title}</h3>
      </div>
      <div className="flex-1 overflow-auto p-5">{children}</div>
    </motion.div>
  );
}

function Skeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className="space-y-2.5">
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="skeleton h-4 rounded" style={{ width: `${70 + (i % 3) * 10}%` }} />
      ))}
    </div>
  );
}

function CafeteriaCard({ data }: { data: DashboardData["cafeteria"] }) {
  const [meal, setMeal] = useState<"breakfast" | "lunch" | "dinner">("lunch");
  if (!data) return <Skeleton />;
  const tabs = ["breakfast", "lunch", "dinner"] as const;
  return (
    <div>
      <div className="flex gap-1 mb-4 p-1 bg-ink-muted rounded-lg">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setMeal(t)}
            className={`flex-1 py-1.5 text-xs rounded-md capitalize transition-all font-medium ${
              meal === t ? "bg-jade/20 text-jade" : "text-fog-dim hover:text-fog"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <ul className="space-y-1.5">
        {(data.menu[meal] || []).map((item, i) => (
          <li key={i} className="text-sm text-fog-dim flex items-start gap-2">
            <span className="text-jade mt-0.5 flex-shrink-0">·</span>
            {item}
          </li>
        ))}
      </ul>
      {data.menu.specials?.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-amber/10 border border-amber/20">
          <p className="text-xs text-amber flex items-center gap-1.5">
            <span>✨</span>
            {data.menu.specials[0]}
          </p>
        </div>
      )}
    </div>
  );
}

function EventsCard({ data }: { data: DashboardData["events"] }) {
  if (!data) return <Skeleton />;
  const upcoming = data.events.slice(0, 4) as CampusEvent[];
  return (
    <div className="space-y-3">
      {upcoming.length === 0 && (
        <p className="text-fog-dim text-sm">No upcoming events found.</p>
      )}
      {upcoming.map((event: CampusEvent) => {
        const spotsLeft = event.capacity - event.registered;
        const full = spotsLeft <= 5;
        return (
          <div key={event.id} className="group p-3 rounded-xl bg-ink-muted/60 hover:bg-ink-muted transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-fog truncate">{event.title}</p>
                <p className="text-xs text-fog-dim mt-0.5">{event.club}</p>
              </div>
              {full && (
                <span className="text-[10px] text-rose bg-rose/10 border border-rose/20 px-1.5 py-0.5 rounded-full flex-shrink-0">
                  Almost Full
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-fog-faint">
              <span className="flex items-center gap-1">
                <Calendar size={10} />
                {new Date(event.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
              </span>
              <span>{event.time}</span>
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DeadlinesCard({ data }: { data: DashboardData["deadlines"] }) {
  if (!data) return <Skeleton />;
  const items = data.deadlines.slice(0, 5);
  const typeColors: Record<string, string> = {
    Assignment: "#7c6af5",
    Exam: "#f56b8a",
    Project: "#f5a623",
    Quiz: "#2dd4a0",
    Registration: "#9d9ab0",
  };
  return (
    <div className="space-y-2.5">
      {items.length === 0 && (
        <p className="text-fog-dim text-sm">No deadlines in the next 7 days. 🎉</p>
      )}
      {items.map((d) => {
        const color = typeColors[d.type] || "#9d9ab0";
        const daysLeft = Math.ceil(
          (new Date(d.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        const urgent = daysLeft <= 2;
        return (
          <div
            key={d.id}
            className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${urgent ? "border" : "bg-ink-muted/60"}`}
            style={urgent ? { background: "rgba(245,107,138,0.08)", borderColor: "rgba(245,107,138,0.15)" } : {}}
          >
            <span
              className="text-[10px] font-mono mt-0.5 px-1.5 py-0.5 rounded flex-shrink-0 font-semibold"
              style={{ background: `${color}20`, color }}
            >
              {d.type}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-fog truncate">{d.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-fog-dim font-mono">{d.course || "—"}</span>
                <span className={`text-xs flex items-center gap-1 ${urgent ? "text-rose" : "text-fog-dim"}`}>
                  {urgent && <AlertCircle size={10} />}
                  {daysLeft === 0 ? "Today!" : daysLeft === 1 ? "Tomorrow" : `${daysLeft}d`}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LibraryCard({ data }: { data: DashboardData["library"] }) {
  if (!data) return <Skeleton />;
  const books = data.books.slice(0, 5);
  return (
    <div className="space-y-2.5">
      {books.length === 0 && (
        <p className="text-fog-dim text-sm">No available books found.</p>
      )}
      {books.map((book) => (
        <div key={book.id} className="flex items-center gap-3 p-3 rounded-xl bg-ink-muted/60">
          <div
            className="w-8 h-10 rounded flex-shrink-0 flex items-center justify-center text-sm"
            style={{ background: "rgba(124,106,245,0.15)", color: "#7c6af5" }}
          >
            📗
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-fog truncate font-medium">{book.title}</p>
            <p className="text-xs text-fog-dim truncate">{book.author}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <span className="text-xs font-mono text-jade">{book.available} avail</span>
            <p className="text-[10px] text-fog-faint mt-0.5">{book.location}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardWidgets() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <CardShell title="Cafeteria" icon={<UtensilsCrossed size={16} />} color="#2dd4a0" delay={0}>
        {loading ? <Skeleton /> : <CafeteriaCard data={data?.cafeteria ?? null} />}
      </CardShell>

      <CardShell title="Events" icon={<Calendar size={16} />} color="#f5a623" delay={0.08}>
        {loading ? <Skeleton /> : <EventsCard data={data?.events ?? null} />}
      </CardShell>

      <CardShell title="Deadlines" icon={<Clock size={16} />} color="#f56b8a" delay={0.16}>
        {loading ? <Skeleton /> : <DeadlinesCard data={data?.deadlines ?? null} />}
      </CardShell>

      <CardShell title="Library" icon={<BookOpen size={16} />} color="#7c6af5" delay={0.24}>
        {loading ? <Skeleton /> : <LibraryCard data={data?.library ?? null} />}
      </CardShell>
    </div>
  );
}
