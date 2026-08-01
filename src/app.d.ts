import type { Container } from "$lib/server/container";
import type { AuthenticatedUser } from "$lib/server/domain/model/user";

declare global {
	namespace App {
		interface Locals {
			/** Adapters + use-cases for this request, wired in hooks.server.ts. */
			container: Container;
			user: AuthenticatedUser | null;
		}
		interface PageData {
			user: AuthenticatedUser | null;
		}
	}
}

export {};
