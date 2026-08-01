import type { RelationshipDimension } from "$lib/shared/scores";
import type { Relationship } from "../model/relationship";
import type { Score } from "../model/score";

/**
 * Persistence port for the symmetric score edges. Implementations receive
 * pairs already in canonical order (`aId < bId`).
 */
export interface RelationshipRepository {
	listByUser(userId: string): Promise<Relationship[]>;
	find(userId: string, aId: string, bId: string): Promise<Relationship | null>;

	/** Inserts an unscored edge when missing; leaves an existing row untouched. */
	ensureEdge(userId: string, aId: string, bId: string): Promise<Relationship>;

	/** Creates the edge if it does not exist, then writes one dimension. */
	setScore(
		userId: string,
		aId: string,
		bId: string,
		dimension: RelationshipDimension,
		value: Score
	): Promise<Relationship>;
}
