import type { RelationshipDimension } from "$lib/shared/scores";
import { ValidationError } from "../errors";
import type { Score } from "./score";

/**
 * One symmetric edge between two people, holding every scored dimension.
 *
 * `aId` is always the lower of the two node ids (see `canonicalPair`), so an
 * unordered pair has exactly one row and cannot hold conflicting values.
 */
export type Relationship = {
	userId: string;
	aId: string;
	bId: string;
	scores: Record<RelationshipDimension, Score>;
};

export function emptyScores(): Record<RelationshipDimension, Score> {
	return { closeness: null, friction: null, support: null };
}

export function assertDistinct(aId: string, bId: string): void {
	if (aId === bId) {
		throw new ValidationError("A person cannot have a relationship with themselves.");
	}
}
