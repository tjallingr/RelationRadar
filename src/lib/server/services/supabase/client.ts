import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { RequestEvent } from "@sveltejs/kit";
import type { Database } from "./database.types";
import type { SupabaseConfig } from "./config";

export type AppSupabaseClient = SupabaseClient<Database>;

/**
 * One Supabase client per request, carrying the user's session cookies.
 *
 * Requests therefore run as the signed-in user, so Postgres row level security
 * is the real access boundary and the repositories never need a service key.
 */
export function createSupabaseClient(
	event: RequestEvent,
	config: SupabaseConfig
): AppSupabaseClient {
	return createServerClient<Database>(config.url, config.anonKey, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				for (const { name, value, options } of cookiesToSet) {
					event.cookies.set(name, value, { ...options, path: "/" });
				}
			}
		}
	});
}
