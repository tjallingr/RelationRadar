import type { NetworkView } from "$lib/shared/types";
import type { PersonRepository } from "../../domain/ports/person-repository";
import type { RelationshipRepository } from "../../domain/ports/relationship-repository";
import { ensureSelfEdges } from "./ensure-self-edges";
import { ensureSelfPerson } from "./ensure-self-person";

export type GetNetworkDeps = {
	people: PersonRepository;
	relationships: RelationshipRepository;
};

/**
 * Reads the whole network for one user. The dataset is small by design (a
 * personal network, tens of people), so it is loaded in one go and the client
 * renders both the graph and the score editors from it.
 */
export function makeGetNetwork({ people, relationships }: GetNetworkDeps) {
	return async function getNetwork(userId: string): Promise<NetworkView> {
		await ensureSelfPerson(people, userId);
		await ensureSelfEdges(people, relationships, userId);

		const [all, edges] = await Promise.all([
			people.listByUser(userId),
			relationships.listByUser(userId)
		]);

		return {
			people: all.map((person) => ({
				id: person.id,
				name: person.name,
				isSelf: person.isSelf
			})),
			relationships: edges.map((edge) => ({
				aId: edge.aId,
				bId: edge.bId,
				scores: edge.scores
			}))
		};
	};
}
