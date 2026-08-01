<script lang="ts">
	import { enhance } from "$app/forms";
	import type { ActionData, PageData } from "./$types";

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<section class="card auth">
	<h1>Sign in</h1>

	{#if data.demoMode}
		<p class="muted">
			No Supabase project is configured, so any email and password will sign you in locally.
		</p>
	{/if}

	<form method="POST" action="?/signIn" use:enhance>
		<label>
			Email
			<input name="email" type="email" autocomplete="email" required />
		</label>

		<label>
			Password
			<input name="password" type="password" autocomplete="current-password" required />
		</label>

		{#if form?.message}
			<p class="error">{form.message}</p>
		{/if}

		<div class="row">
			<button class="primary" type="submit">Sign in</button>
			<button type="submit" formaction="?/signUp">Create account</button>
		</div>
	</form>
</section>

<style>
	.auth {
		max-width: 380px;
	}

	form {
		display: grid;
		gap: 0.75rem;
	}

	label {
		display: grid;
		gap: 0.25rem;
		font-size: 0.9rem;
	}
</style>
