<script lang="ts">
	import { tick } from "svelte";
	import { enhance } from "$app/forms";
	import { pairKey } from "$lib/shared/pair";
	import {
		RELATIONSHIP_DIMENSIONS,
		RELATIONSHIP_DIMENSION_LABELS,
		type RelationshipDimension
	} from "$lib/shared/scores";
	import type { NetworkView, PersonView } from "$lib/shared/types";
	import ScoreSlider from "./ScoreSlider.svelte";

	type Props = { network: NetworkView; first: PersonView; second: PersonView };

	let { network, first, second }: Props = $props();

	let form: HTMLFormElement;
	let dimension = $state<RelationshipDimension>("closeness");
	let value = $state(0);

	const scores = $derived.by(() => {
		const key = pairKey(first.id, second.id);
		const edge = network.relationships.find((item) => pairKey(item.aId, item.bId) === key);

		return edge?.scores ?? { closeness: null, friction: null, support: null };
	});

	/** One form is reused for all three sliders; fill it, then submit it. */
	async function commit(nextDimension: RelationshipDimension, nextValue: number) {
		dimension = nextDimension;
		value = nextValue;
		await tick();
		form.requestSubmit();
	}
</script>

<div class="editor">
	<h2>{first.name} — {second.name}</h2>
	<p class="muted">Scores describe the pair, not a direction.</p>

	<form method="POST" action="?/setScore" use:enhance bind:this={form}>
		<input type="hidden" name="firstPersonId" value={first.id} />
		<input type="hidden" name="secondPersonId" value={second.id} />
		<input type="hidden" name="dimension" value={dimension} />
		<input type="hidden" name="value" value={value} />
	</form>

	{#each RELATIONSHIP_DIMENSIONS as item (item)}
		<ScoreSlider
			label={RELATIONSHIP_DIMENSION_LABELS[item]}
			value={scores[item]}
			oncommit={(next) => commit(item, next)}
		/>
	{/each}
</div>

<style>
	.editor {
		display: grid;
		gap: 0.75rem;
	}

	h2 {
		margin: 0;
		font-size: 1rem;
	}
</style>
