import type { ProfileScale } from "$lib/shared/scores";
import type { SelfProfile } from "../../domain/model/profile";
import type { Score } from "../../domain/model/score";
import type { ProfileRepository } from "../../domain/ports/profile-repository";
import { memoryStore, type MemoryStore } from "./store";

export class InMemoryProfileRepository implements ProfileRepository {
	constructor(private readonly store: MemoryStore = memoryStore) {}

	async get(userId: string): Promise<SelfProfile | null> {
		return this.store.profiles.get(userId) ?? null;
	}

	async save(userId: string, scales: Record<ProfileScale, Score>): Promise<SelfProfile> {
		const profile: SelfProfile = { userId, scales };
		this.store.profiles.set(userId, profile);

		return profile;
	}
}
