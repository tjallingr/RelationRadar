import type { AuthenticatedUser } from "../model/user";

export type Credentials = { email: string; password: string };

export type SignUpCredentials = Credentials & {
	/** Where Supabase sends the user after email confirmation. */
	emailRedirectTo?: string;
};

export type SignUpResult = {
	user: AuthenticatedUser | null;
	/** True when the provider requires the user to confirm their email first. */
	needsEmailConfirmation: boolean;
};

/**
 * Port for the identity provider. Supabase Auth sits behind this today; the
 * use-cases and routes never reference it directly.
 */
export interface AuthService {
	getCurrentUser(): Promise<AuthenticatedUser | null>;
	signIn(credentials: Credentials): Promise<AuthenticatedUser>;
	signUp(credentials: SignUpCredentials): Promise<SignUpResult>;
	/** Completes the PKCE email-confirmation redirect (?code=...). */
	exchangeCodeForSession(code: string): Promise<void>;
	signOut(): Promise<void>;
}
