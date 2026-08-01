/**
 * Relationship scores are symmetric: A-B and B-A are the same edge and must
 * never be stored twice. Every layer (domain, repositories, SQL constraint, UI
 * lookups) orders a pair the same way so one unordered pair maps to one row.
 */

export type NodePair = { aId: string; bId: string };

/** Sorts two node ids so the pair has exactly one representation. */
export function canonicalPair(first: string, second: string): NodePair {
	return first < second ? { aId: first, bId: second } : { aId: second, bId: first };
}

/** Stable string key for map lookups in the UI. */
export function pairKey(first: string, second: string): string {
	const { aId, bId } = canonicalPair(first, second);
	return `${aId}::${bId}`;
}
