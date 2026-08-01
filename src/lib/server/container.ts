import type { RequestEvent } from "@sveltejs/kit";
import type { AuthService } from "./domain/ports/auth-service";
import { InMemoryPersonRepository } from "./repositories/in-memory/person-repository";
import { InMemoryProfileRepository } from "./repositories/in-memory/profile-repository";
import { InMemoryRelationshipRepository } from "./repositories/in-memory/relationship-repository";
import { SupabasePersonRepository } from "./repositories/supabase/person-repository";
import { SupabaseProfileRepository } from "./repositories/supabase/profile-repository";
import { SupabaseRelationshipRepository } from "./repositories/supabase/relationship-repository";
import { LocalAuthService } from "./services/auth/local-auth-service";
import { SupabaseAuthService } from "./services/auth/supabase-auth-service";
import { createSupabaseClient } from "./services/supabase/client";
import { readSupabaseConfig } from "./services/supabase/config";
import { buildUseCases, type UseCases } from "./use-cases";

export type Container = {
	useCases: UseCases;
	auth: AuthService;
	/** False when running on in-memory adapters (no Supabase credentials). */
	persistent: boolean;
};

/**
 * The composition root: the single place that decides which adapters satisfy
 * the ports. Everything else depends on interfaces only.
 *
 * Built per request because the Supabase client is per request (it carries the
 * caller's session cookies).
 */
export function createContainer(event: RequestEvent): Container {
	const config = readSupabaseConfig();

	if (!config) {
		return {
			useCases: buildUseCases({
				people: new InMemoryPersonRepository(),
				relationships: new InMemoryRelationshipRepository(),
				profiles: new InMemoryProfileRepository()
			}),
			auth: new LocalAuthService(event),
			persistent: false
		};
	}

	const client = createSupabaseClient(event, config);

	return {
		useCases: buildUseCases({
			people: new SupabasePersonRepository(client),
			relationships: new SupabaseRelationshipRepository(client),
			profiles: new SupabaseProfileRepository(client)
		}),
		auth: new SupabaseAuthService(client),
		persistent: true
	};
}
