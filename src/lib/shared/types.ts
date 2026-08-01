/**
 * Transport shapes crossing the server/browser boundary. Load functions return
 * these; Svelte components consume them. Deliberately plain data - no domain
 * classes leak into the client bundle.
 */

import type { ProfileScale, RelationshipDimension } from "./scores";

export type PersonView = {
	id: string;
	name: string;
	/** Exactly one node per network is the user themselves. */
	isSelf: boolean;
};

export type RelationshipView = {
	/** Node id, canonically the lower of the two ids. */
	aId: string;
	/** Node id, canonically the higher of the two ids. */
	bId: string;
	/** Null means "not scored yet" rather than zero. */
	scores: Record<RelationshipDimension, number | null>;
};

export type NetworkView = {
	people: PersonView[];
	relationships: RelationshipView[];
};

export type ProfileView = Record<ProfileScale, number | null>;
