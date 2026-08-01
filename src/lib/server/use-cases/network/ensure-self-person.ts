import type { Person } from "../../domain/model/person";
import type { PersonRepository } from "../../domain/ports/person-repository";

const DEFAULT_SELF_NAME = "Me";

/**
 * Guarantees the network has its `isSelf` node.
 *
 * Every other network use-case needs it, so it is a shared step rather than
 * something callers remember to do. Signup does not create it, which keeps
 * account creation independent of the network schema.
 */
export async function ensureSelfPerson(
	people: PersonRepository,
	userId: string
): Promise<Person> {
	const existing = await people.findSelf(userId);
	if (existing) return existing;

	return people.create(userId, DEFAULT_SELF_NAME, true);
}
