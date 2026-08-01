import type { PersonRepository } from "../domain/ports/person-repository";
import type { ProfileRepository } from "../domain/ports/profile-repository";
import type { RelationshipRepository } from "../domain/ports/relationship-repository";
import { makeAddPerson } from "./network/add-person";
import { makeGetNetwork } from "./network/get-network";
import { makeRemovePerson } from "./network/remove-person";
import { makeRenamePerson } from "./network/rename-person";
import { makeSetRelationshipScore } from "./network/set-relationship-score";
import { makeGetProfile } from "./profile/get-profile";
import { makeSaveProfile } from "./profile/save-profile";

export type UseCaseDeps = {
	people: PersonRepository;
	relationships: RelationshipRepository;
	profiles: ProfileRepository;
};

/**
 * Binds every use-case to a set of adapters. Routes call `locals.useCases.x(...)`
 * and stay unaware of which adapters are behind the ports.
 */
export function buildUseCases(deps: UseCaseDeps) {
	return {
		getNetwork: makeGetNetwork(deps),
		addPerson: makeAddPerson(deps),
		renamePerson: makeRenamePerson(deps),
		removePerson: makeRemovePerson(deps),
		setRelationshipScore: makeSetRelationshipScore(deps),
		getProfile: makeGetProfile(deps),
		saveProfile: makeSaveProfile(deps)
	};
}

export type UseCases = ReturnType<typeof buildUseCases>;
