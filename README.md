# RelationRadar

A teaching tool for social network analysis. Students map the people around
them, score each relationship on closeness, friction and support, and reflect on
how they maintain their network.

This repository is a structural first pass: the layering, routing and data model
are in place and runnable, but it is not hardened for production.

## Running locally

```bash
npm install
npm run dev
```

The app starts with no configuration. Without Supabase credentials it falls back
to in-memory storage and an auth stand-in that accepts any email and password, so
a fresh clone is immediately usable. A banner in the UI makes that mode obvious,
and all data is lost when the dev server restarts.

To run against a real Supabase project, copy `.env.example` to `.env`, fill in
the two values from the project's API settings, and apply
`supabase/migrations/0001_init.sql` in the SQL editor. Nothing else changes: the
composition root switches adapters based on whether the credentials are present.

Other scripts: `npm run check` (types), `npm run build`, `npm run preview`.

## Architecture

A hexagonal (ports and adapters) layout. The dependency rule is that arrows
point inward: the domain knows nothing about SvelteKit or Supabase, and swapping
the database or the auth provider means writing a new adapter, not editing use
cases.

```
src/
  lib/
    shared/                  Pure code safe on both sides (score bounds, DTOs,
                             canonical pair ordering)
    server/
      domain/                Entities, value objects and the port interfaces.
        model/               Person, Relationship, SelfProfile, Score
        ports/               PersonRepository, RelationshipRepository,
                             ProfileRepository, AuthService
      use-cases/             One file per operation, built from ports only
        network/             get, add, rename, remove, set score
        profile/             get, save
      repositories/          Outbound adapters for persistence
        supabase/            Real implementation (+ row mappers)
        in-memory/           Development fallback
      services/              Outbound adapters for third parties
        supabase/            Client, config, database row types
        auth/                Supabase Auth adapter + local dev stand-in
      http/                  Inbound adapter helpers (domain errors -> HTTP)
      container.ts           Composition root: the one place adapters are chosen
    components/              Graph, person list, relationship editor, slider
  routes/                    SvelteKit pages and form actions
supabase/migrations/         SQL schema with row level security
```

`hooks.server.ts` builds a container per request, resolves the current user, and
redirects anonymous visitors away from protected routes. Routes read
`locals.container.useCases` and never touch a repository directly.

### Pages

- `/` landing, redirects to the network when signed in
- `/login` sign in and self-serve sign up
- `/network` interactive graph plus the add, rename, remove and score controls
- `/profile` the three self-profile scales

## Data model decisions

**Symmetric scores.** A relationship describes a pair, not a direction, so it is
stored once. Node ids in a pair are sorted (`canonicalPair`) before any read or
write, and a `CHECK (node_a_id < node_b_id)` constraint plus a composite primary
key make a duplicate or conflicting row impossible at the database level.

**The user is a node.** Each network contains one person row with
`is_self = true`. "Me to X" and "X to Y" are then the same kind of edge, which
means one relationships table, one repository, one scoring path, and a graph
where the user appears naturally.

**Lazy edges.** Adding a person creates no relationship rows; an edge appears the
first time a score is set. An unscored score is `null`, which is deliberately
different from a score of zero.

**Extensible profile.** Only the three finalised scales ship. Adding one later
means an entry in `PROFILE_SCALES` and a nullable column, with no change to the
use-cases or the UI loop.

## Graph library

Cytoscape.js. It has a plain imperative API (`add`, `remove`, `on("tap")`) that
suits Svelte's lifecycle without a wrapper, ships the force-directed layout the
view needs, and stays out of the SSR path since it is imported lazily on mount.
Sigma.js targets much larger graphs than a personal network, and vis-network is
heavier for what is needed here.

## Deliberately not built yet

The LLM self-authoring module is out of scope. Nothing is designed around it,
but adding it later is a new port plus an adapter under `services/`, which does
not disturb the existing layers.

## Known gaps in this pass

- Renaming a person has a use-case and an action, but no UI control yet.
- The graph supports adding via the side panel and selecting on the canvas;
  adding a person by clicking empty canvas is not wired up.
- No automated tests. The use-cases are pure functions over ports, so the
  in-memory adapters are the intended test doubles.
- The local auth stand-in checks no password and must never be enabled in a
  deployed environment. It activates only when Supabase credentials are absent.
