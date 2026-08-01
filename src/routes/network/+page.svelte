<script lang="ts">
	import { enhance } from "$app/forms";
	import NetworkGraph from "$lib/components/NetworkGraph.svelte";
	import PersonList from "$lib/components/PersonList.svelte";
	import RelationshipEditor from "$lib/components/RelationshipEditor.svelte";
	import type { ActionData, PageData } from "./$types";

	let { data, form }: { data: PageData; form: ActionData } = $props();

	/** Clicking two people (in the graph or the list) opens their score editor. */
	let selectedIds = $state<string[]>([]);

	const selectedPeople = $derived(
		selectedIds
			.map((id) => data.network.people.find((person) => person.id === id))
			.filter((person) => person !== undefined)
	);

	function select(personId: string) {
		if (selectedIds.includes(personId)) {
			selectedIds = selectedIds.filter((id) => id !== personId);
		} else {
			selectedIds = [...selectedIds, personId].slice(-2);
		}
	}
</script>

<div class="layout">
	<section>
		<h1>Your network</h1>
		<p class="muted">
			Pick two people to score their relationship. Click the background to clear the selection.
		</p>

		<NetworkGraph
			network={data.network}
			{selectedIds}
			onselect={select}
			onclearselection={() => (selectedIds = [])}
		/>
	</section>

	<aside>
		<div class="card">
			<h2>Add someone</h2>
			<form method="POST" action="?/addPerson" class="row" use:enhance>
				<input name="name" placeholder="Name" required />
				<button class="primary" type="submit">Add</button>
			</form>

			{#if form?.message}
				<p class="error">{form.message}</p>
			{/if}
		</div>

		<div class="card">
			<h2>People</h2>
			<PersonList people={data.network.people} {selectedIds} onselect={select} />
		</div>

		<div class="card">
			{#if selectedPeople.length === 2}
				<RelationshipEditor
					network={data.network}
					first={selectedPeople[0]}
					second={selectedPeople[1]}
				/>
			{:else}
				<h2>Relationship</h2>
				<p class="muted">Select two people to score closeness, friction and support.</p>
			{/if}
		</div>
	</aside>
</div>

<style>
	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 320px;
		gap: 1rem;
		align-items: start;
	}

	aside {
		display: grid;
		gap: 1rem;
	}

	@media (max-width: 860px) {
		.layout {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
