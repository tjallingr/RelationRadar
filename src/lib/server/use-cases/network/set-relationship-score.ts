import { canonicalPair } from "$lib/shared/pair";
import { RELATIONSHIP_DIMENSIONS, type RelationshipDimension } from "$lib/shared/scores";
import { NotFoundError, ValidationError } from "../../domain/errors";
import { assertDistinct } from "../../domain/model/relationship";
import { parseScore } from "../../domain/model/score";
import type { PersonRepository } from "../../domain/ports/person-repository";
import type { RelationshipRepository } from "../../domain/ports/relationship-repository";
import type { RelationshipView } from "$lib/shared/types";

export type SetRelationshipScoreDeps = {
	people: PersonRepository;
	relationships: RelationshipRepository;
};

export type SetRelationshipScoreInput = {
	firstPersonId: string;
	secondPersonId: string;
	dimension: string;
	value: unknown;
};

/**
 * Writes one score for one pair. Callers may pass the two people in either
 * order; the pair is canonicalised here so the same edge is always addressed,
 * which is what makes the symmetric model safe.
 */
export function makeSetRelationshipScore({ people, relationships }: SetRelationshipScoreDeps) {
	return async function setRelationshipScore(
		userId: string,
		input: SetRelationshipScoreInput
	): Promise<RelationshipView> {
		if (!isDimension(input.dimension)) {
			throw new ValidationError(`Unknown relationship dimension "${input.dimension}".`);
		}

		assertDistinct(input.firstPersonId, input.secondPersonId);
		const { aId, bId } = canonicalPair(input.firstPersonId, input.secondPersonId);

		const [first, second] = await Promise.all([
			people.findById(userId, aId),
			people.findById(userId, bId)
		]);
		if (!first || !second) throw new NotFoundError("Both people must be in your network.");

		const edge = await relationships.setScore(
			userId,
			aId,
			bId,
			input.dimension,
			parseScore(input.value)
		);

		return { aId: edge.aId, bId: edge.bId, scores: edge.scores };
	};
}

function isDimension(value: string): value is RelationshipDimension {
	return (RELATIONSHIP_DIMENSIONS as readonly string[]).includes(value);
}
