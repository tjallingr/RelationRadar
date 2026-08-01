import { ValidationError } from "../errors";

const MAX_NAME_LENGTH = 80;

/**
 * A person in the user's network.
 *
 * The user themselves is stored as a person with `isSelf: true`. That keeps a
 * single relationship model: "me to X" and "X to Y" are the same kind of edge,
 * so there is one table, one repository and one graph rendering path.
 */
export type Person = {
	id: string;
	userId: string;
	name: string;
	isSelf: boolean;
};

export function normaliseName(raw: string): string {
	const name = raw.trim();

	if (name.length === 0) {
		throw new ValidationError("A person needs a name.");
	}
	if (name.length > MAX_NAME_LENGTH) {
		throw new ValidationError(`Names are limited to ${MAX_NAME_LENGTH} characters.`);
	}

	return name;
}
