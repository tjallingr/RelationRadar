import { canonicalPair } from "$lib/shared/pair";
import type { PersonRepository } from "../../domain/ports/person-repository";
import type { RelationshipRepository } from "../../domain/ports/relationship-repository";

/**
 * Every non-self person is linked to the self node. These edges exist even
 * before any score is set, so the graph always shows a star centred on "me".
 */
export async function ensureSelfEdges(
	people: PersonRepository,
	relationships: RelationshipRepository,
	userId: string
): Promise<void> {
	const self = await people.findSelf(userId);
	if (!self) return;

	const all = await people.listByUser(userId);

	await Promise.all(
		all
			.filter((person) => !person.isSelf)
			.map((person) => {
				const { aId, bId } = canonicalPair(self.id, person.id);
				return relationships.ensureEdge(userId, aId, bId);
			})
	);
}
