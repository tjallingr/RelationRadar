import { fail, type ActionFailure } from "@sveltejs/kit";
import { DomainError, NotFoundError, ValidationError } from "../domain/errors";

/**
 * Inbound adapter: turns domain errors into SvelteKit action failures.
 *
 * Keeping the translation here is what lets use-cases throw plain domain
 * errors without ever importing SvelteKit.
 */
export function toActionFailure(error: unknown): ActionFailure<{ message: string }> {
	if (error instanceof ValidationError) return fail(400, { message: error.message });
	if (error instanceof NotFoundError) return fail(404, { message: error.message });
	if (error instanceof DomainError) return fail(400, { message: error.message });

	console.error("Unexpected error while handling action:", error);

	return fail(500, { message: "Something went wrong. Please try again." });
}

/** Reads a required text field from a submitted form. */
export function requireField(data: FormData, name: string): string {
	const value = data.get(name);
	if (typeof value !== "string" || value.trim() === "") {
		throw new ValidationError(`Missing "${name}".`);
	}

	return value;
}
