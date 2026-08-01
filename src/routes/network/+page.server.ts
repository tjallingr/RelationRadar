import { requireField, toActionFailure } from "$lib/server/http/action-result";
import { requireUser } from "$lib/server/http/session";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	const user = requireUser(locals);

	return { network: await locals.container.useCases.getNetwork(user.id) };
};

export const actions: Actions = {
	addPerson: async ({ request, locals }) => {
		const user = requireUser(locals);
		const data = await request.formData();

		try {
			return { person: await locals.container.useCases.addPerson(user.id, requireField(data, "name")) };
		} catch (error) {
			return toActionFailure(error);
		}
	},

	renamePerson: async ({ request, locals }) => {
		const user = requireUser(locals);
		const data = await request.formData();

		try {
			return {
				person: await locals.container.useCases.renamePerson(
					user.id,
					requireField(data, "personId"),
					requireField(data, "name")
				)
			};
		} catch (error) {
			return toActionFailure(error);
		}
	},

	removePerson: async ({ request, locals }) => {
		const user = requireUser(locals);
		const data = await request.formData();

		try {
			await locals.container.useCases.removePerson(user.id, requireField(data, "personId"));

			return { removed: true };
		} catch (error) {
			return toActionFailure(error);
		}
	},

	setScore: async ({ request, locals }) => {
		const user = requireUser(locals);
		const data = await request.formData();

		try {
			return {
				relationship: await locals.container.useCases.setRelationshipScore(user.id, {
					firstPersonId: requireField(data, "firstPersonId"),
					secondPersonId: requireField(data, "secondPersonId"),
					dimension: requireField(data, "dimension"),
					value: data.get("value")
				})
			};
		} catch (error) {
			return toActionFailure(error);
		}
	}
};
