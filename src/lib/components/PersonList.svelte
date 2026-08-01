<script lang="ts">
	import { enhance } from "$app/forms";
	import type { PersonView } from "$lib/shared/types";

	type Props = {
		people: PersonView[];
		selectedIds: string[];
		onselect: (personId: string) => void;
	};

	let { people, selectedIds, onselect }: Props = $props();
</script>

<ul>
	{#each people as person (person.id)}
		<li class:selected={selectedIds.includes(person.id)}>
			<button class="name" type="button" onclick={() => onselect(person.id)}>
				{person.name}{#if person.isSelf}<span class="muted"> (you)</span>{/if}
			</button>

			{#if !person.isSelf}
				<form method="POST" action="?/removePerson" use:enhance>
					<input type="hidden" name="personId" value={person.id} />
					<button class="link" type="submit">Remove</button>
				</form>
			{/if}
		</li>
	{/each}
</ul>

<style>
	ul {
		list-style: none;
		margin: 0.5rem 0 0;
		padding: 0;
	}

	li {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding: 0.2rem 0;
		border-bottom: 1px solid var(--border);
	}

	li:last-child {
		border-bottom: none;
	}

	li.selected {
		background: #f5f5f5;
	}

	.name {
		border: none;
		background: none;
		padding: 0;
		text-align: left;
		flex: 1;
		text-decoration: underline;
	}

	.name:hover {
		color: var(--muted);
	}
</style>
