import { DomainError } from "../../domain/errors";
import type { AuthenticatedUser } from "../../domain/model/user";
import type { AuthService, Credentials, SignUpCredentials, SignUpResult } from "../../domain/ports/auth-service";
import type { AppSupabaseClient } from "../supabase/client";

/** Adapts Supabase Auth to the `AuthService` port. */
export class SupabaseAuthService implements AuthService {
	constructor(private readonly client: AppSupabaseClient) {}

	async getCurrentUser(): Promise<AuthenticatedUser | null> {
		// getUser() revalidates the token with Supabase, unlike getSession(),
		// which only decodes a cookie the client could have tampered with.
		const { data, error } = await this.client.auth.getUser();
		if (error || !data.user) return null;

		return { id: data.user.id, email: data.user.email ?? null };
	}

	async signIn({ email, password }: Credentials): Promise<AuthenticatedUser> {
		const { data, error } = await this.client.auth.signInWithPassword({ email, password });
		if (error || !data.user) {
			throw new DomainError(error?.message ?? "Could not sign in.");
		}

		return { id: data.user.id, email: data.user.email ?? null };
	}

	async signUp({ email, password, emailRedirectTo }: SignUpCredentials): Promise<SignUpResult> {
		const { data, error } = await this.client.auth.signUp({
			email,
			password,
			options: emailRedirectTo ? { emailRedirectTo } : undefined
		});
		if (error) throw new DomainError(error.message);

		return {
			user: data.user ? { id: data.user.id, email: data.user.email ?? null } : null,
			needsEmailConfirmation: data.session === null
		};
	}

	async exchangeCodeForSession(code: string): Promise<void> {
		const { error } = await this.client.auth.exchangeCodeForSession(code);
		if (error) throw new DomainError(error.message);
	}

	async signOut(): Promise<void> {
		await this.client.auth.signOut();
	}
}
