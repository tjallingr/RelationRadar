import type { ProfileView } from "$lib/shared/types";
import { PROFILE_SCALES, type ProfileScale } from "$lib/shared/scores";
import { parseScore } from "../../domain/model/score";
import type { Score } from "../../domain/model/score";
import type { ProfileRepository } from "../../domain/ports/profile-repository";

export type SaveProfileDeps = { profiles: ProfileRepository };

/**
 * Saves the self-profile. Iterating `PROFILE_SCALES` means adding a scale later
 * touches the constant and the schema only, not this use-case.
 */
export function makeSaveProfile({ profiles }: SaveProfileDeps) {
	return async function saveProfile(
		userId: string,
		raw: Partial<Record<ProfileScale, unknown>>
	): Promise<ProfileView> {
		const scales = {} as Record<ProfileScale, Score>;
		for (const scale of PROFILE_SCALES) {
			scales[scale] = parseScore(raw[scale]);
		}

		const saved = await profiles.save(userId, scales);

		return saved.scales;
	};
}
