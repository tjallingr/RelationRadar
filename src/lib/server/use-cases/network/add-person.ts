import { canonicalPair } from "$lib/shared/pair";
import type { PersonView } from "$lib/shared/types";
import { normaliseName } from "../../domain/model/person";
import type { PersonRepository } from "../../domain/ports/person-repository";
import type { RelationshipRepository } from "../../domain/ports/relationship-repository";
import { ensureSelfPerson } from "./ensure-self-person";

export type AddPersonDeps = {
	people: PersonRepository;
	relationships: RelationshipRepository;
};

/**
 * Adds someone to the network and links them to the self node. The edge exists
 * immediately with null scores; dimensions are filled in when the user scores
 * the pair.
 */
export function makeAddPerson({ people, relationships }: AddPersonDeps) {
	return async function addPerson(userId: string, rawName: string): Promise<PersonView> {
		const self = await ensureSelfPerson(people, userId);

		const person = await people.create(userId, normaliseName(rawName), false);

		const { aId, bId } = canonicalPair(self.id, person.id);
		await relationships.ensureEdge(userId, aId, bId);

		return { id: person.id, name: person.name, isSelf: person.isSelf };
	};
}
