import type { RelationshipDimension } from "$lib/shared/scores";
import { DomainError } from "../../domain/errors";
import type { Relationship } from "../../domain/model/relationship";
import type { Score } from "../../domain/model/score";
import type { RelationshipRepository } from "../../domain/ports/relationship-repository";
import type { AppSupabaseClient } from "../../services/supabase/client";
import { toRelationship } from "./mappers";

/** Domain dimension -> column name. */
const COLUMNS: Record<RelationshipDimension, "closeness" | "friction" | "support"> = {
	closeness: "closeness",
	friction: "friction",
	support: "support"
};

export class SupabaseRelationshipRepository implements RelationshipRepository {
	constructor(private readonly client: AppSupabaseClient) {}

	async listByUser(userId: string): Promise<Relationship[]> {
		const { data, error } = await this.client
			.from("relationships")
			.select("*")
			.eq("user_id", userId);

		if (error) throw new DomainError(error.message);

		return data.map(toRelationship);
	}

	async find(userId: string, aId: string, bId: string): Promise<Relationship | null> {
		const { data, error } = await this.client
			.from("relationships")
			.select("*")
			.eq("user_id", userId)
			.eq("node_a_id", aId)
			.eq("node_b_id", bId)
			.maybeSingle();

		if (error) throw new DomainError(error.message);

		return data ? toRelationship(data) : null;
	}

	async ensureEdge(userId: string, aId: string, bId: string): Promise<Relationship> {
		const existing = await this.find(userId, aId, bId);
		if (existing) return existing;

		const { data, error } = await this.client
			.from("relationships")
			.insert({ user_id: userId, node_a_id: aId, node_b_id: bId })
			.select("*")
			.single();

		if (error) {
			const retry = await this.find(userId, aId, bId);
			if (retry) return retry;
			throw new DomainError(error.message);
		}

		return toRelationship(data);
	}

	async setScore(
		userId: string,
		aId: string,
		bId: string,
		dimension: RelationshipDimension,
		value: Score
	): Promise<Relationship> {
		// Only the touched column is sent, so the other dimensions on an existing
		// row are left untouched by the update.
		const patch: Partial<Record<(typeof COLUMNS)[RelationshipDimension], Score>> = {};
		patch[COLUMNS[dimension]] = value;

		// Upsert on the (user, pair) primary key: the edge is created on the
		// first score and updated afterwards, in a single round trip.
		const { data, error } = await this.client
			.from("relationships")
			.upsert(
				{
					user_id: userId,
					node_a_id: aId,
					node_b_id: bId,
					...patch,
					updated_at: new Date().toISOString()
				},
				{ onConflict: "user_id,node_a_id,node_b_id" }
			)
			.select("*")
			.single();

		if (error) throw new DomainError(error.message);

		return toRelationship(data);
	}
}
