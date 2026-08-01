import type { Person } from "../../domain/model/person";
import type { SelfProfile } from "../../domain/model/profile";
import type { Relationship } from "../../domain/model/relationship";

/**
 * Process-local storage backing the in-memory adapters.
 *
 * A module-level singleton so data survives between requests during a dev
 * session; it is wiped on restart and not shared between server instances,
 * which is exactly why this set of adapters is development-only.
 */
export type MemoryStore = {
	people: Map<string, Person>;
	relationships: Map<string, Relationship>;
	profiles: Map<string, SelfProfile>;
};

export const memoryStore: MemoryStore = {
	people: new Map(),
	relationships: new Map(),
	profiles: new Map()
};

export function relationshipKey(userId: string, aId: string, bId: string): string {
	return `${userId}::${aId}::${bId}`;
}
