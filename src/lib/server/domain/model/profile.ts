import type { ProfileScale } from "$lib/shared/scores";
import type { Score } from "./score";

/**
 * The self/personality profile. Only the three finalised scales ship now;
 * adding a scale later means extending `PROFILE_SCALES` plus one nullable
 * column, with no change to the surrounding layers.
 */
export type SelfProfile = {
	userId: string;
	scales: Record<ProfileScale, Score>;
};

export function emptyScales(): Record<ProfileScale, Score> {
	return { introversion: null, networkMaintenance: null, networkSatisfaction: null };
}
