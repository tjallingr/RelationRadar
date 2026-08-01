import { error } from "@sveltejs/kit";
import type { AuthenticatedUser } from "../domain/model/user";

/**
 * Narrows `locals.user` for protected routes. The hook already redirected
 * anonymous visitors, so reaching this without a user means a routing bug.
 */
export function requireUser(locals: App.Locals): AuthenticatedUser {
	if (!locals.user) error(401, "You need to be signed in.");

	return locals.user;
}
