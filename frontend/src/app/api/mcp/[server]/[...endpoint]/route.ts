import { NextRequest, NextResponse } from "next/server";

// ────────────────────────────────────────────────────────────────────────────
// All 4 MCP servers embedded as Vercel API routes
// ────────────────────────────────────────────────────────────────────────────

// ── Library ─────────────────────────────────────────────────────────────────
const books = [
  { id: "B001", title: "Introduction to Algorithms", author: "Cormen et al.", isbn: "978-0262033848", category: "Computer Science", available: 2, total: 5, location: "Shelf CS-3A" },
  { id: "B002", title: "The Pragmatic Programmer", author: "Hunt & Thomas", isbn: "978-0135957059", category: "Computer Science", available: 0, total: 3, location: "Shelf CS-1B", dueBack: "2026-06-15" },
  { id: "B003", title: "Clean Code", author: "Robert C. Martin", isbn: "978-0132350884", category: "Computer Science", available: 1, total: 4, location: "Shelf CS-2A" },
  { id: "B004", title: "Design Patterns", author: "Gang of Four", isbn: "978-0201633610", category: "Computer Science", available: 3, total: 3, location: "Shelf CS-4C" },
  { id: "B005", title: "Deep Learning", author: "Goodfellow et al.", isbn: "978-0262035613", category: "AI/ML", available: 1, total: 2, location: "Shelf ML-1A" },
  { id: "B006", title: "Pattern Recognition & ML", author: "Bishop", isbn: "978-0387310732", category: "AI/ML", available: 0, total: 2, location: "Shelf ML-1B", dueBack: "2026-06-20" },
  { id: "B007", title: "Operating System Concepts", author: "Silberschatz et al.", isbn: "978-1119800361", category: "Systems", available: 4, total: 6, location: "Shelf SYS-2A" },
  { id: "B008", title: "Computer Networks", author: "Tanenbaum", isbn: "978-0132126953", category: "Networks", available: 2, total: 4, location: "Shelf NET-1A" },
  { id: "B009", title: "The Mythical Man-Month", author: "Frederick Brooks", isbn: "978-0201835953", category: "Software Engineering", available: 1, total: 2, location: "Shelf SE-1A" },
  { id: "B010", title: "Discrete Mathematics", author: "Kenneth Rosen", isbn: "978-0072899054", category: "Mathematics", available: 5, total: 8, location: "Shelf MATH-3B" },
];
const dueDates = [
  { studentId: "S001", bookId: "B002", dueDate: "2026-06-15", title: "The Pragmatic Programmer" },
  { studentId: "S002", bookId: "B006", dueDate: "2026-06-20", title: "Pattern Recognition & ML" },
];

// ── Cafeteria ───────────────────────────────────────────────────────────────
const weeklyMenu: Record<string, { breakfast: string[]; lunch: string[]; dinner: string[]; specials: string[] }> = {
  Monday: { breakfast: ["Idli Sambar", "Masala Dosa", "Tea/Coffee", "Fresh Fruit"], lunch: ["Rice", "Dal Tadka", "Paneer Butter Masala", "Roti", "Mixed Vegetable Curry", "Curd"], dinner: ["Chapati", "Rajma", "Jeera Rice", "Salad Bar", "Sweet: Gulab Jamun"], specials: ["Monday Special: Extra Dessert for students with ID"] },
  Tuesday: { breakfast: ["Poha", "Upma", "Boiled Eggs", "Tea/Coffee"], lunch: ["Biryani (Veg/Chicken)", "Raita", "Papad", "Lassi"], dinner: ["Noodles", "Manchurian", "Spring Rolls", "Sweet Corn Soup"], specials: ["Biryani Tuesday — Special price ₹80"] },
  Wednesday: { breakfast: ["Paratha with Pickle", "Chole Bhature", "Tea/Coffee"], lunch: ["Rice", "Sambar", "Rasam", "Potato Fry", "Appalam"], dinner: ["Pasta Arrabiata", "Garlic Bread", "Caesar Salad", "Fruit Custard"], specials: ["South Indian Special Day"] },
  Thursday: { breakfast: ["Idli Sambar", "Puri Bhaji", "Tea/Coffee"], lunch: ["Chole Rice", "Kadhi Pakora", "Roti", "Green Salad"], dinner: ["Dal Makhani", "Naan", "Paneer Tikka", "Kheer"], specials: ["Paneer Thursday — Extra paneer portions"] },
  Friday: { breakfast: ["Rava Dosa", "Medu Vada", "Coconut Chutney", "Tea/Coffee"], lunch: ["Pulao", "Mixed Dal", "Aloo Gobi", "Buttermilk"], dinner: ["Pizza (Veg/Non-Veg)", "Pasta", "Cold Coffee"], specials: ["Friday Treat: Free dessert with full meal combo"] },
  Saturday: { breakfast: ["Pav Bhaji", "Bread Omelette", "Tea/Coffee"], lunch: ["Fried Rice", "Manchurian", "Spring Rolls", "Soup"], dinner: ["BBQ Night — Grilled items, Kebabs, Salads"], specials: ["Weekend Special: BBQ available from 7PM"] },
  Sunday: { breakfast: ["Full English / South Indian Combo", "Fresh Juice"], lunch: ["Chole Bhature", "Dal Fry", "Rice", "Papad", "Sweet"], dinner: ["Mughlai Special: Biryani, Kebabs, Shahi Paneer, Seviyan"], specials: ["Sunday Brunch 10AM–1PM: Extended breakfast menu"] },
};
const cafeteriaHours = { breakfast: "7:30 AM – 9:30 AM", lunch: "12:00 PM – 2:30 PM", snacks: "4:30 PM – 6:00 PM", dinner: "7:30 PM – 9:30 PM", note: "Cafeteria closed on national holidays. Sunday brunch: 10AM–1PM." };

// ── Events ──────────────────────────────────────────────────────────────────
const events = [
  { id: "E001", title: "TechFest 2026 — Hackathon", club: "IEEE Student Chapter", category: "Technical", date: "2026-06-14", time: "9:00 AM", endTime: "9:00 PM", venue: "Main Auditorium + Lab Block", description: "24-hour hackathon with cash prizes up to ₹50,000. Theme: AI for Social Good.", registrationLink: "https://techfest.example.edu/register", capacity: 200, registered: 147, tags: ["hackathon", "AI", "coding", "prizes"] },
  { id: "E002", title: "Workshop: Introduction to WebRTC", club: "Web Dev Club", category: "Workshop", date: "2026-06-10", time: "3:00 PM", endTime: "5:00 PM", venue: "CS Seminar Hall (Room 204)", description: "Hands-on workshop covering WebRTC fundamentals.", registrationLink: "https://webdevclub.example.edu/webrtc", capacity: 60, registered: 58, tags: ["webrtc", "web", "workshop"] },
  { id: "E003", title: "Cultural Night: Ranga Utsav", club: "Cultural Committee", category: "Cultural", date: "2026-06-13", time: "6:00 PM", endTime: "10:00 PM", venue: "Open Air Theatre", description: "Annual cultural night featuring dance, music, drama, and stand-up comedy.", registrationLink: null, capacity: 1000, registered: 650, tags: ["cultural", "dance", "music", "drama"] },
  { id: "E004", title: "ML Study Group: Transformer Architecture", club: "AI/ML Club", category: "Study Group", date: "2026-06-09", time: "5:00 PM", endTime: "7:00 PM", venue: "Library Reading Room B", description: "Deep dive into self-attention and the 'Attention Is All You Need' paper.", registrationLink: "https://aiml.example.edu/study", capacity: 30, registered: 22, tags: ["ML", "transformers", "study", "AI"] },
  { id: "E005", title: "Campus Placement Drive — Google", club: "Placement Cell", category: "Placement", date: "2026-06-16", time: "8:00 AM", endTime: "6:00 PM", venue: "Admin Block Hall A", description: "Google campus recruitment for SWE and SRE roles.", registrationLink: "https://placement.example.edu/google2026", capacity: 120, registered: 98, tags: ["placement", "google", "interview", "jobs"] },
  { id: "E006", title: "Photography Walk: Campus at Dawn", club: "Photography Club", category: "Club Activity", date: "2026-06-08", time: "6:00 AM", endTime: "8:00 AM", venue: "Meet at Main Gate", description: "Early morning campus photography walk.", registrationLink: null, capacity: 40, registered: 28, tags: ["photography", "art", "outdoor"] },
  { id: "E007", title: "Guest Lecture: Generative AI in Industry", club: "CSE Department", category: "Academic", date: "2026-06-11", time: "2:00 PM", endTime: "4:00 PM", venue: "Central Lecture Hall", description: "Industry talk on real-world LLM deployment challenges.", registrationLink: "https://cse.example.edu/genai-lecture", capacity: 300, registered: 289, tags: ["AI", "lecture", "generative AI", "industry"] },
];

// ── Academics ───────────────────────────────────────────────────────────────
const courses = [
  { code: "CS301", name: "Data Structures & Algorithms", credits: 4, instructor: "Dr. Priya Sharma", semester: 3, schedule: "Mon/Wed/Fri 10:00–11:00 AM", room: "LH-101" },
  { code: "CS401", name: "Machine Learning", credits: 4, instructor: "Dr. Amit Patel", semester: 5, schedule: "Tue/Thu 2:00–3:30 PM", room: "LH-204" },
  { code: "CS402", name: "Computer Networks", credits: 3, instructor: "Prof. R. Narayanan", semester: 5, schedule: "Mon/Wed 11:00 AM–12:00 PM", room: "LH-105" },
  { code: "CS501", name: "Distributed Systems", credits: 4, instructor: "Dr. K. Subramaniam", semester: 7, schedule: "Tue/Thu 10:00–11:30 AM", room: "LH-302" },
  { code: "CS502", name: "Deep Learning", credits: 3, instructor: "Dr. Amit Patel", semester: 7, schedule: "Mon/Wed/Fri 3:00–4:00 PM", room: "ML-Lab" },
  { code: "MA201", name: "Probability & Statistics", credits: 3, instructor: "Prof. S. Mehta", semester: 3, schedule: "Mon/Wed/Fri 9:00–10:00 AM", room: "LH-102" },
  { code: "EC301", name: "Digital Signal Processing", credits: 3, instructor: "Dr. L. Krishnan", semester: 5, schedule: "Tue/Thu 11:00 AM–12:00 PM", room: "EC-201" },
];
const deadlines = [
  { id: "D001", type: "Assignment", course: "CS401", title: "ML Assignment 2 — Linear Regression", dueDate: "2026-06-12", dueTime: "11:59 PM", submissionLink: "https://lms.example.edu/ml-a2" },
  { id: "D002", type: "Project", course: "CS301", title: "DSA Project: Graph Algorithms Implementation", dueDate: "2026-06-20", dueTime: "5:00 PM", submissionLink: "https://lms.example.edu/dsa-proj" },
  { id: "D003", type: "Exam", course: "CS402", title: "Mid-Semester Exam — Computer Networks", dueDate: "2026-06-15", dueTime: "2:00 PM", venue: "Exam Hall B" },
  { id: "D004", type: "Quiz", course: "MA201", title: "Probability Quiz 3", dueDate: "2026-06-09", dueTime: "10:00 AM", submissionLink: "https://lms.example.edu/prob-q3" },
  { id: "D005", type: "Assignment", course: "CS502", title: "CNN Architecture Report", dueDate: "2026-06-18", dueTime: "11:59 PM", submissionLink: "https://lms.example.edu/dl-cnn" },
  { id: "D006", type: "Registration", course: null, title: "Course Registration for Semester 7", dueDate: "2026-06-25", dueTime: "5:00 PM", submissionLink: "https://erp.example.edu/register" },
];
const handbookSections = [
  { section: "1.1", title: "Academic Calendar", content: "Odd semester: July–November. Even semester: December–April. Summer term: May–June." },
  { section: "1.2", title: "Attendance Policy", content: "Minimum 75% attendance required per course. Medical leave needs documents within 3 days." },
  { section: "2.1", title: "Grading System", content: "10-point scale: O=10, A+=9, A=8, B+=7, B=6, C=5, P=4, F=0." },
  { section: "2.2", title: "CGPA Calculation", content: "CGPA = Sum(Grade Points × Credits) / Sum(Credits). Minimum 5.0 for graduation." },
  { section: "3.1", title: "Anti-Plagiarism Policy", content: "Plagiarism results in zero marks. Repeat offenses lead to academic probation." },
  { section: "4.1", title: "Hostel Rules", content: "Curfew at 11 PM for UG students. Visitors allowed 10 AM–8 PM in common areas only." },
  { section: "5.1", title: "Examination Rules", content: "Report 15 min before exam. No electronic devices. Blue/black pen only." },
];

// ── Helper ──────────────────────────────────────────────────────────────────
function getTodayName() {
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
}

// ── Server Configs ──────────────────────────────────────────────────────────
interface ToolDef {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

interface ServerConfig {
  id: string;
  displayName: string;
  description: string;
  tools: ToolDef[];
  invoke: (tool: string, input: Record<string, unknown>) => unknown;
}

const servers: Record<string, ServerConfig> = {
  library: {
    id: "library",
    displayName: "Campus Library",
    description: "Search books, check availability, and view due dates",
    tools: [
      { name: "search_books", description: "Search the library catalog by title, author, or category", inputSchema: { type: "object", properties: { query: { type: "string", description: "Search query" }, category: { type: "string", description: "Filter by category" }, available_only: { type: "boolean", description: "Show only available books" } }, required: ["query"] } },
      { name: "check_availability", description: "Check availability of a specific book by title or ID", inputSchema: { type: "object", properties: { book_id: { type: "string", description: "Book ID" }, title: { type: "string", description: "Book title" } } } },
      { name: "get_due_dates", description: "Get upcoming due dates for borrowed books", inputSchema: { type: "object", properties: { student_id: { type: "string", description: "Student ID" } } } },
    ],
    invoke: (tool, input) => {
      if (tool === "search_books") {
        const q = (input.query as string || "").toLowerCase();
        let results = books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.category.toLowerCase().includes(q));
        if (input.category) results = results.filter(b => b.category.toLowerCase() === (input.category as string).toLowerCase());
        if (input.available_only) results = results.filter(b => b.available > 0);
        return { count: results.length, books: results };
      }
      if (tool === "check_availability") {
        const book = input.book_id ? books.find(b => b.id === input.book_id) : input.title ? books.find(b => b.title.toLowerCase().includes((input.title as string).toLowerCase())) : null;
        if (!book) return { found: false, message: "Book not found" };
        return { found: true, book, status: book.available > 0 ? "Available" : "All copies checked out", availableCopies: book.available, totalCopies: book.total, dueBack: book.dueBack || null };
      }
      if (tool === "get_due_dates") {
        const results = input.student_id ? dueDates.filter(d => d.studentId === input.student_id) : dueDates;
        return { count: results.length, dueDates: results };
      }
      throw new Error(`Unknown tool: ${tool}`);
    },
  },
  cafeteria: {
    id: "cafeteria",
    displayName: "Campus Cafeteria",
    description: "Get daily menus, specials, and cafeteria hours",
    tools: [
      { name: "get_menu", description: "Get the cafeteria menu for today or a specific day", inputSchema: { type: "object", properties: { day: { type: "string", description: "Day of week" }, meal: { type: "string", enum: ["breakfast", "lunch", "dinner", "all"], description: "Which meal" } } } },
      { name: "get_specials", description: "Get today's or this week's special offers", inputSchema: { type: "object", properties: { day: { type: "string", description: "Day of week" } } } },
      { name: "get_hours", description: "Get cafeteria opening hours", inputSchema: { type: "object", properties: {} } },
    ],
    invoke: (tool, input) => {
      const day = (input.day as string) || getTodayName();
      const menu = weeklyMenu[day];
      if (!menu) return { error: `No data for ${day}` };
      if (tool === "get_menu") {
        const meal = input.meal as string;
        if (meal && meal !== "all") return { day, meal, items: (menu as Record<string, string[]>)[meal] || [] };
        return { day, menu };
      }
      if (tool === "get_specials") return { day, specials: menu.specials };
      if (tool === "get_hours") return { hours: cafeteriaHours };
      throw new Error(`Unknown tool: ${tool}`);
    },
  },
  events: {
    id: "events",
    displayName: "Campus Events",
    description: "Browse and search campus events, workshops, and club activities",
    tools: [
      { name: "list_events", description: "List all campus events, optionally filtered", inputSchema: { type: "object", properties: { category: { type: "string" }, date: { type: "string" }, upcoming_only: { type: "boolean" } } } },
      { name: "search_events", description: "Search events by keyword", inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] } },
      { name: "get_event_details", description: "Get full details for a specific event", inputSchema: { type: "object", properties: { event_id: { type: "string" } }, required: ["event_id"] } },
    ],
    invoke: (tool, input) => {
      if (tool === "list_events") {
        let results = [...events];
        if (input.upcoming_only !== false) { const today = new Date().toISOString().split("T")[0]; results = results.filter(e => e.date >= today); }
        if (input.category) results = results.filter(e => e.category.toLowerCase() === (input.category as string).toLowerCase());
        if (input.date) results = results.filter(e => e.date === input.date);
        results.sort((a, b) => a.date.localeCompare(b.date));
        return { count: results.length, events: results };
      }
      if (tool === "search_events") {
        const q = (input.query as string).toLowerCase();
        const results = events.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.club.toLowerCase().includes(q) || e.tags.some(t => t.toLowerCase().includes(q)));
        return { count: results.length, events: results };
      }
      if (tool === "get_event_details") {
        const event = events.find(e => e.id === input.event_id);
        if (!event) return { found: false, message: `Event ${input.event_id} not found` };
        return { found: true, event, spotsLeft: event.capacity - event.registered };
      }
      throw new Error(`Unknown tool: ${tool}`);
    },
  },
  academics: {
    id: "academics",
    displayName: "Academic Resources",
    description: "Course schedules, deadlines, and handbook policies",
    tools: [
      { name: "get_deadlines", description: "Get upcoming assignment, exam, and project deadlines", inputSchema: { type: "object", properties: { course_code: { type: "string" }, type: { type: "string", enum: ["Assignment", "Project", "Exam", "Quiz", "Registration"] }, days_ahead: { type: "number" } } } },
      { name: "search_courses", description: "Search for courses by name, code, or instructor", inputSchema: { type: "object", properties: { query: { type: "string" }, semester: { type: "number" } }, required: ["query"] } },
      { name: "get_handbook", description: "Search the academic handbook for policies", inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] } },
    ],
    invoke: (tool, input) => {
      if (tool === "get_deadlines") {
        const daysAhead = (input.days_ahead as number) || 14;
        const today = new Date(); const cutoff = new Date(today); cutoff.setDate(cutoff.getDate() + daysAhead);
        let results = deadlines.filter(d => { const due = new Date(d.dueDate); return due >= today && due <= cutoff; });
        if (input.course_code) results = results.filter(d => d.course === (input.course_code as string).toUpperCase());
        if (input.type) results = results.filter(d => d.type === input.type);
        results.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
        return { count: results.length, deadlines: results };
      }
      if (tool === "search_courses") {
        const q = (input.query as string).toLowerCase();
        let results = courses.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q));
        if (input.semester) results = results.filter(c => c.semester === input.semester);
        return { count: results.length, courses: results };
      }
      if (tool === "get_handbook") {
        const q = (input.query as string).toLowerCase();
        const results = handbookSections.filter(s => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q));
        return { count: results.length, sections: results };
      }
      throw new Error(`Unknown tool: ${tool}`);
    },
  },
};

// ── Route Handler ───────────────────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ server: string; endpoint: string[] }> }
) {
  const { server, endpoint } = await params;
  const ep = endpoint?.[0] || "";

  const srv = servers[server];
  if (!srv) {
    return NextResponse.json({ error: `Unknown server: ${server}` }, { status: 404 });
  }

  if (ep === "manifest") {
    return NextResponse.json({
      server: srv.id,
      displayName: srv.displayName,
      description: srv.description,
      version: "1.0.0",
      tools: srv.tools,
    }, { headers: { "Cache-Control": "no-store" } });
  }

  if (ep === "health") {
    return NextResponse.json({ status: "ok", server: srv.id }, { headers: { "Cache-Control": "no-store" } });
  }

  return NextResponse.json({ error: `Unknown endpoint: ${ep}` }, { status: 404 });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ server: string; endpoint: string[] }> }
) {
  const { server, endpoint } = await params;
  const ep = endpoint?.[0] || "";

  const srv = servers[server];
  if (!srv) {
    return NextResponse.json({ error: `Unknown server: ${server}` }, { status: 404 });
  }

  if (ep === "invoke") {
    try {
      const { tool, input } = await req.json();
      const result = srv.invoke(tool, input || {});
      return NextResponse.json({ success: true, tool, result }, { headers: { "Cache-Control": "no-store" } });
    } catch (err) {
      return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
  }

  return NextResponse.json({ error: `Unknown endpoint: ${ep}` }, { status: 404 });
}
