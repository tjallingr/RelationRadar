import { NotFoundError } from "../../domain/errors";
import type { Person } from "../../domain/model/person";
import type { PersonRepository } from "../../domain/ports/person-repository";
import { memoryStore, type MemoryStore } from "./store";

export class InMemoryPersonRepository implements PersonRepository {
	constructor(private readonly store: MemoryStore = memoryStore) {}

	async listByUser(userId: string): Promise<Person[]> {
		return [...this.store.people.values()]
			.filter((person) => person.userId === userId)
			.sort((a, b) => Number(b.isSelf) - Number(a.isSelf));
	}

	async findById(userId: string, personId: string): Promise<Person | null> {
		const person = this.store.people.get(personId);

		return person && person.userId === userId ? person : null;
	}

	async findSelf(userId: string): Promise<Person | null> {
		const people = await this.listByUser(userId);

		return people.find((person) => person.isSelf) ?? null;
	}

	async create(userId: string, name: string, isSelf = false): Promise<Person> {
		const person: Person = { id: crypto.randomUUID(), userId, name, isSelf };
		this.store.people.set(person.id, person);

		return person;
	}

	async rename(userId: string, personId: string, name: string): Promise<Person> {
		const person = await this.findById(userId, personId);
		if (!person) throw new NotFoundError("That person is not in your network.");

		const renamed = { ...person, name };
		this.store.people.set(personId, renamed);

		return renamed;
	}

	async remove(userId: string, personId: string): Promise<void> {
		this.store.people.delete(personId);

		// The database does this with ON DELETE CASCADE; here it is manual.
		for (const [key, edge] of this.store.relationships) {
			if (edge.userId === userId && (edge.aId === personId || edge.bId === personId)) {
				this.store.relationships.delete(key);
			}
		}
	}
}
