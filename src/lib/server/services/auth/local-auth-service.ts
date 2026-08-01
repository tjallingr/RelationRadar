import type { RequestEvent } from "@sveltejs/kit";
import type { AuthenticatedUser } from "../../domain/model/user";
import type { AuthService, Credentials, SignUpCredentials, SignUpResult } from "../../domain/ports/auth-service";

const COOKIE_NAME = "rr_local_user";

/**
 * Development stand-in for Supabase Auth, used only when no Supabase
 * credentials are present. It accepts any email, verifies no password, and
 * keeps the "session" in a plain cookie - never enable it in production.
 *
 * Its purpose is that `npm run dev` works on a fresh clone with zero setup.
 */
export class LocalAuthService implements AuthService {
	constructor(private readonly event: RequestEvent) {}

	async getCurrentUser(): Promise<AuthenticatedUser | null> {
		const email = this.event.cookies.get(COOKIE_NAME);

		return email ? this.toUser(email) : null;
	}

	async signIn({ email }: Credentials): Promise<AuthenticatedUser> {
		this.event.cookies.set(COOKIE_NAME, email, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 7
		});

		return this.toUser(email);
	}

	async signUp(credentials: SignUpCredentials): Promise<SignUpResult> {
		return { user: await this.signIn(credentials), needsEmailConfirmation: false };
	}

	async exchangeCodeForSession(_code: string): Promise<void> {
		// Not used without Supabase credentials.
	}

	async signOut(): Promise<void> {
		this.event.cookies.delete(COOKIE_NAME, { path: "/" });
	}

	/** Derives a stable id from the email so data survives a sign-out. */
	private toUser(email: string): AuthenticatedUser {
		return { id: `local:${email.toLowerCase()}`, email };
	}
}
