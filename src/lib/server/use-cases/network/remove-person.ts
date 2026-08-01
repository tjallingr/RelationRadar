import { NotFoundError, ValidationError } from "../../domain/errors";
import type { PersonRepository } from "../../domain/ports/person-repository";

export type RemovePersonDeps = { people: PersonRepository };

/**
 * Removes a person and, through the repository, every score attached to them.
 * The self node is not removable: the network is defined relative to it.
 */
export function makeRemovePerson({ people }: RemovePersonDeps) {
	return async function removePerson(userId: string, personId: string): Promise<void> {
		const existing = await people.findById(userId, personId);
		if (!existing) throw new NotFoundError("That person is not in your network.");
		if (existing.isSelf) throw new ValidationError("You cannot remove yourself from your network.");

		await people.remove(userId, personId);
	};
}
