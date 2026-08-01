import type { ProfileView } from "$lib/shared/types";
import { emptyScales } from "../../domain/model/profile";
import type { ProfileRepository } from "../../domain/ports/profile-repository";

export type GetProfileDeps = { profiles: ProfileRepository };

/** Returns blank scales rather than null so the form always has a shape. */
export function makeGetProfile({ profiles }: GetProfileDeps) {
	return async function getProfile(userId: string): Promise<ProfileView> {
		const profile = await profiles.get(userId);

		return profile ? profile.scales : emptyScales();
	};
}
