import type { RelationshipDimension } from "$lib/shared/scores";
import { emptyScores, type Relationship } from "../../domain/model/relationship";
import type { Score } from "../../domain/model/score";
import type { RelationshipRepository } from "../../domain/ports/relationship-repository";
import { memoryStore, relationshipKey, type MemoryStore } from "./store";

export class InMemoryRelationshipRepository implements RelationshipRepository {
	constructor(private readonly store: MemoryStore = memoryStore) {}

	async listByUser(userId: string): Promise<Relationship[]> {
		return [...this.store.relationships.values()].filter((edge) => edge.userId === userId);
	}

	async find(userId: string, aId: string, bId: string): Promise<Relationship | null> {
		return this.store.relationships.get(relationshipKey(userId, aId, bId)) ?? null;
	}

	async ensureEdge(userId: string, aId: string, bId: string): Promise<Relationship> {
		const key = relationshipKey(userId, aId, bId);
		const existing = this.store.relationships.get(key);
		if (existing) return existing;

		const edge: Relationship = { userId, aId, bId, scores: emptyScores() };
		this.store.relationships.set(key, edge);

		return edge;
	}

	async setScore(
		userId: string,
		aId: string,
		bId: string,
		dimension: RelationshipDimension,
		value: Score
	): Promise<Relationship> {
		const key = relationshipKey(userId, aId, bId);
		const existing = this.store.relationships.get(key);

		const edge: Relationship = {
			userId,
			aId,
			bId,
			scores: { ...(existing?.scores ?? emptyScores()), [dimension]: value }
		};
		this.store.relationships.set(key, edge);

		return edge;
	}
}
