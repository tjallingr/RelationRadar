import type { PersonView } from "$lib/shared/types";
import { NotFoundError } from "../../domain/errors";
import { normaliseName } from "../../domain/model/person";
import type { PersonRepository } from "../../domain/ports/person-repository";

export type RenamePersonDeps = { people: PersonRepository };

/** Renaming the self node is allowed - some users prefer their own name. */
export function makeRenamePerson({ people }: RenamePersonDeps) {
	return async function renamePerson(
		userId: string,
		personId: string,
		rawName: string
	): Promise<PersonView> {
		const existing = await people.findById(userId, personId);
		if (!existing) throw new NotFoundError("That person is not in your network.");

		const person = await people.rename(userId, personId, normaliseName(rawName));

		return { id: person.id, name: person.name, isSelf: person.isSelf };
	};
}
