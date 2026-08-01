import { toActionFailure } from "$lib/server/http/action-result";
import { requireUser } from "$lib/server/http/session";
import { PROFILE_SCALES } from "$lib/shared/scores";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	const user = requireUser(locals);

	return { profile: await locals.container.useCases.getProfile(user.id) };
};

export const actions: Actions = {
	save: async ({ request, locals }) => {
		const user = requireUser(locals);
		const data = await request.formData();

		try {
			const raw = Object.fromEntries(PROFILE_SCALES.map((scale) => [scale, data.get(scale)]));

			return { profile: await locals.container.useCases.saveProfile(user.id, raw), saved: true };
		} catch (error) {
			return toActionFailure(error);
		}
	}
};
