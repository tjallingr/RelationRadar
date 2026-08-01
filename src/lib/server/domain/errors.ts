/**
 * Domain-level failures. Routes translate these into HTTP responses so that
 * use-cases never import SvelteKit.
 */

export class DomainError extends Error {
	constructor(message: string) {
		super(message);
		this.name = new.target.name;
	}
}

/** Input violated a business rule (bad score, empty name, ...). */
export class ValidationError extends DomainError {}

/** The requested entity does not exist, or does not belong to this user. */
export class NotFoundError extends DomainError {}
