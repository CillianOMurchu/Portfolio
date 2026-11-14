import { useState } from "react";
import DemoShell from "../components/DemoShell";
import { COLUMNS, INITIAL_TICKETS, TYPE_ICON, type ColumnId, type Ticket } from "./constants";
import { COLUMN_HEADER, COLUMN_TONE, MOVE_BUTTON, PRIORITY_DOT, PRIORITY_TONE, TICKET, TICKET_TITLE } from "./styles";

type Direction = -1 | 1;

const LAST_COLUMN = COLUMNS.length - 1;
const columnIndex = (column: ColumnId) => COLUMNS.findIndex(c => c.id === column);

function TicketCard({ ticket, move }: { ticket: Ticket; move: (direction: Direction) => void }) {
  const position = columnIndex(ticket.column);
  return (
    <div className={TICKET}>
      <div className="flex items-center gap-1">
        <span className="text-sm">{TYPE_ICON[ticket.type]}</span>
        <span className="text-sm text-muted">{ticket.id}</span>
        <span className={`${PRIORITY_DOT} ${PRIORITY_TONE[ticket.priority]}`} aria-label={`${ticket.priority} priority`} />
      </div>
      <p className={TICKET_TITLE}>{ticket.title}</p>
      <div className="mt-0.5 flex gap-1">
        {position > 0 && <button type="button" onClick={() => move(-1)} className={MOVE_BUTTON} aria-label="Move left">←</button>}
        {position < LAST_COLUMN && <button type="button" onClick={() => move(1)} className={`ml-auto ${MOVE_BUTTON}`} aria-label="Move right">→</button>}
      </div>
    </div>
  );
}

export default function JiraDemo() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);

  const moveTicket = (id: string, direction: Direction) => setTickets(current => current.map(ticket => {
    if (ticket.id !== id) return ticket;
    const target = Math.max(0, Math.min(LAST_COLUMN, columnIndex(ticket.column) + direction));
    return { ...ticket, column: COLUMNS[target].id };
  }));

  return (
    <DemoShell className="gap-3">
      <p className="text-center text-sm text-muted">Click arrows to move tickets across the board</p>
      <div className="grid grid-cols-3 gap-2">
        {COLUMNS.map(column => {
          const columnTickets = tickets.filter(ticket => ticket.column === column.id);
          const tone = COLUMN_TONE[column.id];
          return (
            <div key={column.id} className="flex flex-col gap-2">
              <div className={`${COLUMN_HEADER} ${tone.header}`}>
                <span className={`text-sm font-semibold ${tone.label}`}>{column.label}</span>
                <span className="ml-auto text-sm text-muted">{columnTickets.length}</span>
              </div>
              {columnTickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} move={(direction) => moveTicket(ticket.id, direction)} />
              ))}
            </div>
          );
        })}
      </div>
    </DemoShell>
  );
}
