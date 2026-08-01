import type { ProfileScale } from "$lib/shared/scores";
import { DomainError } from "../../domain/errors";
import type { SelfProfile } from "../../domain/model/profile";
import type { Score } from "../../domain/model/score";
import type { ProfileRepository } from "../../domain/ports/profile-repository";
import type { AppSupabaseClient } from "../../services/supabase/client";
import { toProfile } from "./mappers";

export class SupabaseProfileRepository implements ProfileRepository {
	constructor(private readonly client: AppSupabaseClient) {}

	async get(userId: string): Promise<SelfProfile | null> {
		const { data, error } = await this.client
			.from("profiles")
			.select("*")
			.eq("user_id", userId)
			.maybeSingle();

		if (error) throw new DomainError(error.message);

		return data ? toProfile(data) : null;
	}

	async save(userId: string, scales: Record<ProfileScale, Score>): Promise<SelfProfile> {
		const { data, error } = await this.client
			.from("profiles")
			.upsert(
				{
					user_id: userId,
					introversion: scales.introversion,
					network_maintenance: scales.networkMaintenance,
					network_satisfaction: scales.networkSatisfaction,
					updated_at: new Date().toISOString()
				},
				{ onConflict: "user_id" }
			)
			.select("*")
			.single();

		if (error) throw new DomainError(error.message);

		return toProfile(data);
	}
}
