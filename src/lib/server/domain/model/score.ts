import { SCORE_MAX, SCORE_MIN, isValidScore } from "$lib/shared/scores";
import { ValidationError } from "../errors";

/**
 * A validated 0-10 rating. `null` is a meaningful value: it means the user has
 * not scored this dimension yet, which is distinct from scoring it zero.
 */
export type Score = number | null;

export function parseScore(value: unknown): Score {
	if (value === null || value === undefined || value === "") return null;

	const numeric = typeof value === "string" ? Number(value) : value;
	if (typeof numeric !== "number" || !isValidScore(numeric)) {
		throw new ValidationError(`Score must be a whole number between ${SCORE_MIN} and ${SCORE_MAX}.`);
	}

	return numeric;
}
