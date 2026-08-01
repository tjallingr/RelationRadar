import type { ProfileScale } from "$lib/shared/scores";
import type { SelfProfile } from "../model/profile";
import type { Score } from "../model/score";

export interface ProfileRepository {
	/** Null when the user has never saved their profile. */
	get(userId: string): Promise<SelfProfile | null>;

	save(userId: string, scales: Record<ProfileScale, Score>): Promise<SelfProfile>;
}
