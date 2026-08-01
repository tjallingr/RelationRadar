import type { Person } from "../model/person";

/**
 * Persistence port for people. Every method is scoped by `userId` so an
 * adapter cannot accidentally serve another user's network, independently of
 * database-level row security.
 */
export interface PersonRepository {
	listByUser(userId: string): Promise<Person[]>;
	findById(userId: string, personId: string): Promise<Person | null>;

	/** The `isSelf` node, or null when the network has not been initialised. */
	findSelf(userId: string): Promise<Person | null>;

	create(userId: string, name: string, isSelf?: boolean): Promise<Person>;
	rename(userId: string, personId: string, name: string): Promise<Person>;

	/** Must also drop the relationships attached to this person. */
	remove(userId: string, personId: string): Promise<void>;
}
