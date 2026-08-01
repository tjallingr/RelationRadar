import { redirect } from "@sveltejs/kit";
import { requireField, toActionFailure } from "$lib/server/http/action-result";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) redirect(303, url.searchParams.get("redirectTo") ?? "/network");

	return { demoMode: !locals.container.persistent };
};

export const actions: Actions = {
	signIn: async ({ request, locals, url }) => {
		const data = await request.formData();

		try {
			await locals.container.auth.signIn({
				email: requireField(data, "email"),
				password: requireField(data, "password")
			});
		} catch (error) {
			return toActionFailure(error);
		}

		redirect(303, url.searchParams.get("redirectTo") ?? "/network");
	},

	signUp: async ({ request, locals }) => {
		const data = await request.formData();

		try {
			const result = await locals.container.auth.signUp({
				email: requireField(data, "email"),
				password: requireField(data, "password")
			});

			// Supabase can require email confirmation, in which case there is no
			// session yet and the user must come back after confirming.
			if (result.needsEmailConfirmation) {
				return { message: "Check your inbox to confirm your address, then sign in." };
			}
		} catch (error) {
			return toActionFailure(error);
		}

		redirect(303, "/network");
	}
};
