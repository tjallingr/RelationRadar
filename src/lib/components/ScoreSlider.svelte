<script lang="ts">
	import { SCORE_MAX, SCORE_MIN } from "$lib/shared/scores";

	type Props = {
		label: string;
		value: number | null;
		oncommit: (value: number) => void;
	};

	let { label, value, oncommit }: Props = $props();
</script>

<label>
	<span class="label-row">
		{label}
		<span>{value ?? "—"}</span>
	</span>
	<input
		type="range"
		min={SCORE_MIN}
		max={SCORE_MAX}
		step="1"
		value={value ?? SCORE_MIN}
		onchange={(event) => oncommit(Number(event.currentTarget.value))}
	/>
</label>

<style>
	label {
		display: grid;
		gap: 0.25rem;
		font-size: 0.9rem;
	}

	.label-row {
		display: flex;
		justify-content: space-between;
	}
</style>
