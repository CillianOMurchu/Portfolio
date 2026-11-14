export type Priority = "high" | "medium" | "low";
export type TicketType = "story" | "bug" | "task";

export const COLUMNS = [
  { id: "todo", label: "To Do" },
  { id: "inprogress", label: "In Progress" },
  { id: "done", label: "Done" },
] as const;
export type ColumnId = (typeof COLUMNS)[number]["id"];

export interface Ticket {
  id: string;
  title: string;
  priority: Priority;
  type: TicketType;
  column: ColumnId;
}

export const TYPE_ICON: Record<TicketType, string> = { story: "📖", bug: "🐛", task: "✔" };

export const INITIAL_TICKETS: Ticket[] = [
  { id: "COM-412", title: "Add Playwright coverage for Awesome Hero Title component", priority: "high", type: "story", column: "inprogress" },
  { id: "COM-411", title: "SSR flicker on initial load", priority: "medium", type: "bug", column: "todo" },
  { id: "COM-410", title: "Increase page speed", priority: "high", type: "task", column: "done" },
  { id: "COM-409", title: "Play with DeBuggerALot and set up monitoring", priority: "low", type: "task", column: "todo" },
  {
    id: "COM-408",
    title: "Something of medium importance that needs to be done but not urgently and it fell on you for the craic",
    priority: "medium",
    type: "bug",
    column: "todo",
  },
  { id: "COM-407", title: "Migrate something old into something new and better", priority: "high", type: "story", column: "done" },
];
