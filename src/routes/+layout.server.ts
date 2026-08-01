import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		user: locals.user,
		// Surfaced in the UI so it is obvious when data is only in memory.
		persistent: locals.container.persistent
	};
};
