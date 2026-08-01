import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/** Exchanges the ?code= from Supabase email confirmation for a session cookie. */
export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get("code");
	const next = url.searchParams.get("next") ?? "/network";

	if (!code || !locals.container.persistent) {
		redirect(303, "/login");
	}

	try {
		await locals.container.auth.exchangeCodeForSession(code);
	} catch {
		redirect(303, "/login?error=confirmation_failed");
	}

	redirect(303, next);
};
