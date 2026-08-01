import { DomainError, NotFoundError } from "../../domain/errors";
import type { Person } from "../../domain/model/person";
import type { PersonRepository } from "../../domain/ports/person-repository";
import type { AppSupabaseClient } from "../../services/supabase/client";
import { toPerson } from "./mappers";

export class SupabasePersonRepository implements PersonRepository {
	constructor(private readonly client: AppSupabaseClient) {}

	async listByUser(userId: string): Promise<Person[]> {
		const { data, error } = await this.client
			.from("people")
			.select("*")
			.eq("user_id", userId)
			// Self first, then oldest first, so the graph order is stable.
			.order("is_self", { ascending: false })
			.order("created_at", { ascending: true });

		if (error) throw new DomainError(error.message);

		return data.map(toPerson);
	}

	async findById(userId: string, personId: string): Promise<Person | null> {
		const { data, error } = await this.client
			.from("people")
			.select("*")
			.eq("user_id", userId)
			.eq("id", personId)
			.maybeSingle();

		if (error) throw new DomainError(error.message);

		return data ? toPerson(data) : null;
	}

	async findSelf(userId: string): Promise<Person | null> {
		const { data, error } = await this.client
			.from("people")
			.select("*")
			.eq("user_id", userId)
			.eq("is_self", true)
			.maybeSingle();

		if (error) throw new DomainError(error.message);

		return data ? toPerson(data) : null;
	}

	async create(userId: string, name: string, isSelf = false): Promise<Person> {
		const { data, error } = await this.client
			.from("people")
			.insert({ user_id: userId, name, is_self: isSelf })
			.select("*")
			.single();

		if (error) throw new DomainError(error.message);

		return toPerson(data);
	}

	async rename(userId: string, personId: string, name: string): Promise<Person> {
		const { data, error } = await this.client
			.from("people")
			.update({ name })
			.eq("user_id", userId)
			.eq("id", personId)
			.select("*")
			.maybeSingle();

		if (error) throw new DomainError(error.message);
		if (!data) throw new NotFoundError("That person is not in your network.");

		return toPerson(data);
	}

	async remove(userId: string, personId: string): Promise<void> {
		// Relationship rows disappear with the person: both foreign keys are
		// declared ON DELETE CASCADE in the migration.
		const { error } = await this.client
			.from("people")
			.delete()
			.eq("user_id", userId)
			.eq("id", personId);

		if (error) throw new DomainError(error.message);
	}
}
