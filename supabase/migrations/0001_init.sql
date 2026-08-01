-- RelationRadar initial schema.
--
-- Three tables, all owned by exactly one user. Row level security is the real
-- access boundary: the app connects with the caller's JWT and the anon key, so
-- a query can only ever see its own rows.

create extension if not exists "pgcrypto";

-- People -------------------------------------------------------------------
-- The user themselves is a row with is_self = true, so "me to X" and "X to Y"
-- are the same kind of edge and there is only one relationship table.
create table public.people (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references auth.users (id) on delete cascade,
	name text not null check (char_length(trim(name)) between 1 and 80),
	is_self boolean not null default false,
	created_at timestamptz not null default now()
);

create index people_user_id_idx on public.people (user_id);

-- At most one self node per user.
create unique index people_one_self_per_user_idx
	on public.people (user_id)
	where is_self;

-- Relationships ------------------------------------------------------------
-- Scores are symmetric, so a pair is stored once. The check constraint forces
-- the canonical ordering (node_a_id < node_b_id) that the application applies
-- before writing, which makes duplicate or conflicting rows impossible.
create table public.relationships (
	user_id uuid not null references auth.users (id) on delete cascade,
	node_a_id uuid not null references public.people (id) on delete cascade,
	node_b_id uuid not null references public.people (id) on delete cascade,
	closeness smallint check (closeness between 0 and 10),
	friction smallint check (friction between 0 and 10),
	support smallint check (support between 0 and 10),
	updated_at timestamptz not null default now(),

	primary key (user_id, node_a_id, node_b_id),
	constraint relationships_canonical_order check (node_a_id < node_b_id)
);

create index relationships_user_id_idx on public.relationships (user_id);

-- Self / personality profile ------------------------------------------------
-- One row per user. Adding a scale later is a nullable column plus an entry in
-- PROFILE_SCALES; no other layer changes.
create table public.profiles (
	user_id uuid primary key references auth.users (id) on delete cascade,
	introversion smallint check (introversion between 0 and 10),
	network_maintenance smallint check (network_maintenance between 0 and 10),
	network_satisfaction smallint check (network_satisfaction between 0 and 10),
	updated_at timestamptz not null default now()
);

-- Row level security --------------------------------------------------------
alter table public.people enable row level security;
alter table public.relationships enable row level security;
alter table public.profiles enable row level security;

create policy "people are private to their owner"
	on public.people for all
	using (auth.uid() = user_id)
	with check (auth.uid() = user_id);

create policy "relationships are private to their owner"
	on public.relationships for all
	using (auth.uid() = user_id)
	with check (auth.uid() = user_id);

create policy "profiles are private to their owner"
	on public.profiles for all
	using (auth.uid() = user_id)
	with check (auth.uid() = user_id);
