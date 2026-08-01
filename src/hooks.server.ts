import { redirect, type Handle } from "@sveltejs/kit";
import { createContainer } from "$lib/server/container";

/** Routes reachable without a session. Everything else requires sign-in. */
const PUBLIC_ROUTES = ["/", "/login", "/auth/callback"];

/**
 * Per-request wiring plus the single auth gate. Load functions and actions can
 * therefore assume `locals.user` is set on protected routes.
 */
export const handle: Handle = async ({ event, resolve }) => {
	event.locals.container = createContainer(event);
	event.locals.user = await event.locals.container.auth.getCurrentUser();

	const isPublic = PUBLIC_ROUTES.includes(event.url.pathname);
	if (!isPublic && !event.locals.user) {
		redirect(303, `/login?redirectTo=${encodeURIComponent(event.url.pathname)}`);
	}

	return resolve(event);
};
