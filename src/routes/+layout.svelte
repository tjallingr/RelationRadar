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

			<form method="POST" action="/logout" class="row">
				<span class="muted">{data.user.email}</span>
				<button class="link" type="submit">Sign out</button>
			</form>
		{/if}
	</header>

	{#if !data.persistent}
		<p class="banner">
			Running without Supabase credentials: data is kept in memory and disappears when the dev
			server restarts.
		</p>
	{/if}

	<main>
		{@render children()}
	</main>
</div>

<style>
	.shell {
		max-width: 1100px;
		margin: 0 auto;
		padding: 1rem;
	}

	header {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--border);
	}

	.brand {
		font-weight: 600;
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
		color: var(--accent);
		font-weight: 600;
	}

	.banner {
		margin: 0.75rem 0 0;
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius);
		background: #fff6e0;
		border: 1px solid #f0d9a0;
		font-size: 0.85rem;
	}

	main {
		padding-top: 1rem;
	}
</style>
