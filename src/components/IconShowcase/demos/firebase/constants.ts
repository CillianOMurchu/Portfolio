export type PresenceStatus = "online" | "away" | "offline";

export interface UserDocument {
  status: PresenceStatus;
  lastSeen: string;
  visitors: number;
  coffeeConsumed: number;
  projectsBuilt: number;
}

export type FieldKey = keyof UserDocument;

export const FIELD_ORDER: FieldKey[] = ["status", "lastSeen", "visitors", "coffeeConsumed", "projectsBuilt"];

export const INITIAL_DOCUMENT: UserDocument = {
  status: "online",
  lastSeen: "just now",
  visitors: 1247,
  coffeeConsumed: 1892,
  projectsBuilt: 47,
};

/** One entry per snapshot; the listener cycles through them. */
export const PRESENCE_CYCLE: { status: PresenceStatus; lastSeen: string }[] = [
  { status: "online", lastSeen: "just now" },
  { status: "away", lastSeen: "2 seconds ago" },
  { status: "online", lastSeen: "just now" },
  { status: "online", lastSeen: "just now" },
  { status: "online", lastSeen: "just now" },
  { status: "away", lastSeen: "1 minute ago" },
];

export const SNAPSHOT_INTERVAL_MS = 1800;
export const FLASH_DURATION_MS = 600;
export const MAX_NEW_VISITORS = 3;
export const VISITOR_TICK_EVERY = 2;
export const COFFEE_TICK_EVERY = 3;
