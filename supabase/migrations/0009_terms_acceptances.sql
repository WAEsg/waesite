-- Compliance record of terms/privacy acceptance — persists independently
-- of any UI checkbox state. One row per (user, document, version) they've
-- accepted; a version bump means a fresh row is needed, not an update to
-- an old one, so the history of what was accepted when is never lost.

create table terms_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  document_type text not null check (document_type in ('tos', 'privacy')),
  version text not null,
  accepted_at timestamptz not null default now(),
  unique (user_id, document_type, version)
);

create index terms_acceptances_user_id_idx on terms_acceptances (user_id);

alter table terms_acceptances enable row level security;

create policy "terms_acceptances_select_own_or_admin"
  on terms_acceptances for select
  using (user_id = auth.uid() or is_admin());

-- No client insert policy: written server-side (via the signup action,
-- using the user's own session — see below) or, for re-acceptance
-- prompts, a future authenticated action. Using a policy scoped to the
-- user's own id rather than the admin client keeps this table's writes
-- attributable to the user's own session like any other user action.
create policy "terms_acceptances_insert_own"
  on terms_acceptances for insert
  with check (user_id = auth.uid());
