<script lang="ts">
	import { onMount } from "svelte";
	import type { Core, NodeSingular, StylesheetJson } from "cytoscape";
	import { pairKey } from "$lib/shared/pair";
	import type { NetworkView, RelationshipView } from "$lib/shared/types";

	type Props = {
		network: NetworkView;
		/** Up to two ids: the pair currently being scored. */
		selectedIds: string[];
		onselect: (personId: string) => void;
		onclearselection: () => void;
	};

	let { network, selectedIds, onselect, onclearselection }: Props = $props();

	let container: HTMLDivElement;
	let cy = $state<Core | null>(null);

	onMount(() => {
		let core: Core | null = null;

		// Cytoscape touches `document` on construction, so it is imported lazily
		// rather than at module scope where SSR would evaluate it.
		import("cytoscape").then(({ default: cytoscape }) => {
			core = cytoscape({ container, style: graphStyle(), minZoom: 0.3, maxZoom: 2.5 });

			core.on("tap", "node", (event) => onselect(event.target.id()));
			core.on("tap", (event) => {
				if (event.target === core) onclearselection();
			});

			cy = core;
		});

		return () => core?.destroy();
	});

	$effect(() => {
		if (cy) syncElements(cy, network);
	});

	$effect(() => {
		if (!cy) return;

		const ids = new Set(selectedIds);
		cy.nodes().forEach((node) => {
			node.toggleClass("selected", ids.has(node.id()));
		});
	});

	/** Patches only what changed instead of tearing down the whole graph. */
	function syncElements(core: Core, view: NetworkView) {
		const desiredNodes = new Map(view.people.map((person) => [person.id, person]));
		const desiredEdges = new Map(
			view.relationships.map((edge) => [pairKey(edge.aId, edge.bId), edge])
		);

		core.batch(() => {
			core.nodes().forEach((node) => {
				if (!desiredNodes.has(node.id())) node.remove();
			});

			for (const person of view.people) {
				const existing = core.getElementById(person.id);
				if (existing.empty()) {
					core.add({
						data: { id: person.id, label: person.name },
						classes: person.isSelf ? "self" : ""
					});
				} else {
					existing.data("label", person.name);
					existing.toggleClass("self", person.isSelf);
				}
			}

			core.edges().forEach((edge) => {
				if (!desiredEdges.has(edge.id())) edge.remove();
			});

			for (const [key, relationship] of desiredEdges) {
				syncEdge(core, key, relationship);
			}
		});

		layoutNodes(core, view);
	}

	function syncEdge(core: Core, key: string, relationship: RelationshipView) {
		const scored = relationship.scores.closeness !== null;
		const data = {
			id: key,
			source: relationship.aId,
			target: relationship.bId,
			closeness: relationship.scores.closeness ?? 0,
			friction: relationship.scores.friction ?? 0
		};

		const existing = core.getElementById(key);
		if (existing.empty()) {
			core.add({
				group: "edges",
				data,
				classes: scored ? "scored" : "unscored"
			});
		} else {
			existing.data(data);
			existing.toggleClass("scored", scored);
			existing.toggleClass("unscored", !scored);
		}
	}

	/** Self stays at the centre; new nodes are placed on a ring around it. */
	function layoutNodes(core: Core, view: NetworkView) {
		const self = view.people.find((person) => person.isSelf);
		const others = view.people.filter((person) => !person.isSelf);

		let center = { x: core.width() / 2, y: core.height() / 2 };

		if (self) {
			const selfNode = core.getElementById(self.id);
			if (!selfNode.empty()) {
				if (!selfNode.locked()) {
					selfNode.position(center);
					selfNode.lock();
				}
				center = selfNode.position();
			}
		}

		const unpositioned = others.filter((person) => isUnpositioned(core, person.id));
		if (unpositioned.length === 0) return;

		const radius = Math.min(core.width(), core.height()) * 0.32;

		for (const person of unpositioned) {
			const index = others.findIndex((item) => item.id === person.id);
			const angle = (2 * Math.PI * index) / others.length - Math.PI / 2;
			const node = core.getElementById(person.id) as NodeSingular;

			node.position({
				x: center.x + radius * Math.cos(angle),
				y: center.y + radius * Math.sin(angle)
			});
			node.data("positioned", true);
		}
	}

	function isUnpositioned(core: Core, personId: string): boolean {
		const node = core.getElementById(personId);
		return !node.empty() && node.data("positioned") !== true;
	}

	function graphStyle(): StylesheetJson {
		return [
			{
				selector: "node",
				style: {
					"background-color": "#888",
					label: "data(label)",
					"font-family": "Georgia, Times New Roman, serif",
					"font-size": "10px",
					color: "#111",
					"text-valign": "bottom",
					"text-margin-y": 4,
					width: 22,
					height: 22,
					"border-width": 1,
					"border-color": "#111"
				}
			},
			{
				selector: "node.self",
				style: { "background-color": "#111", width: 28, height: 28 }
			},
			{
				selector: "node.selected",
				style: { "border-width": 2, "border-color": "#111", "background-color": "#fff" }
			},
			{
				selector: "node.self.selected",
				style: { "background-color": "#111" }
			},
			{
				selector: "edge.unscored",
				style: {
					width: 1,
					"line-color": "#ccc",
					"line-style": "dashed",
					"curve-style": "straight"
				}
			},
			{
				selector: "edge.scored",
				style: {
					width: "mapData(closeness, 0, 10, 1, 4)",
					"line-color": "mapData(friction, 0, 10, #bbb, #111)",
					"curve-style": "straight"
				}
			}
		];
	}
</script>

<div class="graph" bind:this={container}></div>

<style>
	.graph {
		width: 100%;
		height: 420px;
		margin-top: 0.75rem;
		background: var(--surface);
		border: 1px solid var(--border);
	}
</style>
