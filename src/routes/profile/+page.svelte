<script lang="ts">
	import { enhance } from "$app/forms";
	import { PROFILE_SCALES, PROFILE_SCALE_LABELS, SCORE_MAX, SCORE_MIN } from "$lib/shared/scores";
	import type { ActionData, PageData } from "./$types";

	import type { ProfileScale } from "$lib/shared/scores";

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Only the slider labels need client state; the inputs themselves post their
	// values. Edits are overlaid on the loaded profile so a reload wins.
	let edits = $state<Partial<Record<ProfileScale, number>>>({});
	const values = $derived({ ...data.profile, ...edits });
</script>

<section class="card profile">
	<h1>About you</h1>
	<p class="muted">
		How you experience and maintain your network, on a scale from {SCORE_MIN} to {SCORE_MAX}.
	</p>

	<form method="POST" action="?/save" use:enhance>
		{#each PROFILE_SCALES as scale (scale)}
			<label>
				<span class="row">
					{PROFILE_SCALE_LABELS[scale]}
					<strong>{values[scale] ?? "—"}</strong>
				</span>
				<input
					type="range"
					name={scale}
					min={SCORE_MIN}
					max={SCORE_MAX}
					step="1"
					value={values[scale] ?? SCORE_MIN}
					oninput={(event) => (edits[scale] = Number(event.currentTarget.value))}
				/>
			</label>
		{/each}

		<div class="row">
			<button class="primary" type="submit">Save</button>
			{#if form?.saved}<span class="muted">Saved.</span>{/if}
			{#if form?.message}<span class="error">{form.message}</span>{/if}
		</div>
	</form>
</section>

<style>
	.profile {
		max-width: 520px;
	}

	form {
		display: grid;
		gap: 1rem;
		margin-top: 1rem;
	}

	label {
		display: grid;
		gap: 0.25rem;
		font-size: 0.9rem;
	}

	.row {
		justify-content: space-between;
	}

	input[type="range"] {
		padding: 0;
		border: none;
		background: none;
	}
</style>
