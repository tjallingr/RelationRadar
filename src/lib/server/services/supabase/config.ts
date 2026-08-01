import { env } from "$env/dynamic/public";

/**
 * Supabase connection settings, read at runtime rather than build time so the
 * app boots (and `npm run dev` works) before any credentials exist.
 */
export type SupabaseConfig = { url: string; anonKey: string };

export function readSupabaseConfig(): SupabaseConfig | null {
	const url = env.PUBLIC_SUPABASE_URL;
	// Supabase dashboard labels this "anon" or "publishable" depending on version.
	const anonKey = env.PUBLIC_SUPABASE_ANON_KEY ?? env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

	if (!url || !anonKey) return null;

	return { url, anonKey };
}
