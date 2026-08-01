<script lang="ts">
	import "../app.css";
	import { page } from "$app/state";
	import type { LayoutData } from "./$types";

	let { data, children }: { data: LayoutData; children: import("svelte").Snippet } = $props();

	const links = [
		{ href: "/network", label: "Network" },
		{ href: "/profile", label: "Profile" }
	];
</script>

<div class="shell">
	<header>
		<a class="brand" href="/">RelationRadar</a>

		{#if data.user}
			<nav>
				{#each links as link (link.href)}
					<a href={link.href} class:active={page.url.pathname === link.href}>{link.label}</a>
				{/each}
			</nav>

			<form method="POST" action="/logout" class="session">
				<span class="muted">{data.user.email}</span>
				<button class="link" type="submit">Sign out</button>
			</form>
		{/if}
	</header>

	{#if !data.persistent}
		<p class="banner muted">
			No database configured. Data is kept in memory and lost when the dev server restarts.
		</p>
	{/if}

	<main>
		{@render children()}
	</main>
</div>

<style>
	.shell {
		max-width: 960px;
		margin: 0 auto;
		padding: 1.5rem 1rem 2rem;
	}

	header {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0.75rem 1.5rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--border);
	}

	.brand {
		font-size: 1rem;
		text-decoration: none;
		color: var(--text);
	}

	nav {
		display: flex;
		gap: 1rem;
		margin-right: auto;
	}

	nav a {
		text-decoration: none;
		color: var(--muted);
	}

	nav a.active {
		color: var(--text);
		text-decoration: underline;
	}

	.session {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		margin: 0;
	}

	.banner {
		margin: 0.75rem 0 0;
		padding: 0;
		font-style: italic;
	}

	main {
		padding-top: 1.25rem;
	}
</style>
