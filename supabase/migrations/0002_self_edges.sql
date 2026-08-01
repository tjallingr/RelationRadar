-- Backfill self-to-other edges for networks created before edges were
-- structural. Scores stay null until the user sets them.

insert into public.relationships (user_id, node_a_id, node_b_id)
select
	p.user_id,
	least(self.id, p.id),
	greatest(self.id, p.id)
from public.people p
join public.people self on self.user_id = p.user_id and self.is_self
where not p.is_self
on conflict do nothing;
