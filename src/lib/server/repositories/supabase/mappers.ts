import type { Person } from "../../domain/model/person";
import type { SelfProfile } from "../../domain/model/profile";
import type { Relationship } from "../../domain/model/relationship";
import type { PersonRow, ProfileRow, RelationshipRow } from "../../services/supabase/database.types";

/**
 * Translation between snake_case database rows and the domain's camelCase
 * types. Isolated here so a schema rename never reaches the use-cases.
 */

export function toPerson(row: PersonRow): Person {
	return { id: row.id, userId: row.user_id, name: row.name, isSelf: row.is_self };
}

export function toRelationship(row: RelationshipRow): Relationship {
	return {
		userId: row.user_id,
		aId: row.node_a_id,
		bId: row.node_b_id,
		scores: {
			closeness: row.closeness,
			friction: row.friction,
			support: row.support
		}
	};
}

export function toProfile(row: ProfileRow): SelfProfile {
	return {
		userId: row.user_id,
		scales: {
			introversion: row.introversion,
			networkMaintenance: row.network_maintenance,
			networkSatisfaction: row.network_satisfaction
		}
	};
}
