/**
 * Row shapes for the tables in `supabase/migrations`.
 *
 * Hand-written for now; once a Supabase project exists these can be replaced
 * with `supabase gen types typescript` output without touching any other file,
 * because only the repository adapters import them.
 */

export type PersonRow = {
	id: string;
	user_id: string;
	name: string;
	is_self: boolean;
	created_at: string;
};

export type RelationshipRow = {
	user_id: string;
	/** Always the lower of the two ids - enforced by a CHECK constraint. */
	node_a_id: string;
	node_b_id: string;
	closeness: number | null;
	friction: number | null;
	support: number | null;
	updated_at: string;
};

export type ProfileRow = {
	user_id: string;
	introversion: number | null;
	network_maintenance: number | null;
	network_satisfaction: number | null;
	updated_at: string;
};

export type Database = {
	public: {
		Tables: {
			people: {
				Row: PersonRow;
				// Columns with database defaults are optional on insert.
				Insert: Pick<PersonRow, "user_id" | "name"> & Partial<PersonRow>;
				Update: Partial<PersonRow>;
				Relationships: [];
			};
			relationships: {
				Row: RelationshipRow;
				Insert: Pick<RelationshipRow, "user_id" | "node_a_id" | "node_b_id"> &
					Partial<RelationshipRow>;
				Update: Partial<RelationshipRow>;
				Relationships: [];
			};
			profiles: {
				Row: ProfileRow;
				Insert: Pick<ProfileRow, "user_id"> & Partial<ProfileRow>;
				Update: Partial<ProfileRow>;
				Relationships: [];
			};
		};
		Views: { [key in never]: never };
		Functions: { [key in never]: never };
		Enums: { [key in never]: never };
		CompositeTypes: { [key in never]: never };
	};
};
