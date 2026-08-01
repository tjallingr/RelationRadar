import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
	const code = url.searchParams.get("code");
	if (code) {
		const next = url.searchParams.get("next") ?? "/network";
		redirect(303, `/auth/callback?code=${encodeURIComponent(code)}&next=${encodeURIComponent(next)}`);
	}

	if (locals.user) redirect(303, "/network");

	return {};
};
