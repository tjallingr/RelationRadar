/**
 * The authenticated account. The domain only needs an id; everything else is
 * an auth-provider detail.
 */
export type AuthenticatedUser = {
	id: string;
	email: string | null;
};
