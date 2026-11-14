import {
  COFFEE_TICK_EVERY, MAX_NEW_VISITORS, PRESENCE_CYCLE, VISITOR_TICK_EVERY, type FieldKey, type UserDocument,
} from "./constants";

interface Snapshot {
  document: UserDocument;
  changedFields: FieldKey[];
}

/** The next server snapshot for a given tick, plus which fields it changed. */
export function nextSnapshot(current: UserDocument, tick: number): Snapshot {
  const presence = PRESENCE_CYCLE[tick % PRESENCE_CYCLE.length];
  const document = { ...current, ...presence };
  const changedFields: FieldKey[] = [];

  if (tick % VISITOR_TICK_EVERY === 0) {
    document.visitors += Math.floor(Math.random() * MAX_NEW_VISITORS) + 1;
    changedFields.push("visitors");
  }
  if (tick % COFFEE_TICK_EVERY === 0) {
    document.coffeeConsumed += 1;
    changedFields.push("coffeeConsumed");
  }
  if (presence.status !== current.status) changedFields.push("status", "lastSeen");

  return { document, changedFields };
}
