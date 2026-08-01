/**
 * Score vocabulary shared by the browser and the server.
 *
 * Lives in `shared` (not `server/domain`) because the UI needs the same bounds
 * and labels to render sliders; the domain re-uses these constants when it
 * validates input so there is a single source of truth.
 */

export const SCORE_MIN = 0;
export const SCORE_MAX = 10;

/** The three dimensions scored for every pair of people. */
export const RELATIONSHIP_DIMENSIONS = ["closeness", "friction", "support"] as const;

export type RelationshipDimension = (typeof RELATIONSHIP_DIMENSIONS)[number];

export const RELATIONSHIP_DIMENSION_LABELS: Record<RelationshipDimension, string> = {
	closeness: "Closeness",
	friction: "Friction",
	support: "Support (emotional / financial)"
};

/** The finalised self-profile scales for this build. */
export const PROFILE_SCALES = ["introversion", "networkMaintenance", "networkSatisfaction"] as const;

export type ProfileScale = (typeof PROFILE_SCALES)[number];

export const PROFILE_SCALE_LABELS: Record<ProfileScale, string> = {
	introversion: "Introversion",
	networkMaintenance: "Time & effort maintaining my network",
	networkSatisfaction: "Satisfaction with my network"
};

export function isValidScore(value: number): boolean {
	return Number.isInteger(value) && value >= SCORE_MIN && value <= SCORE_MAX;
}
