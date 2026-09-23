-- On-platform interview scheduling (between "shortlisted" and "match &
-- create contract") and the standalone non-circumvention acknowledgment
-- that gates it, per hirer-talent-job triple.

-- ============================================================
-- interviews (simple ping-pong slot scheduling, one row per application)
-- ============================================================

create table interviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications (id) on delete cascade,
  hirer_id uuid not null references users (id),
  talent_id uuid not null references users (id),
  gig_id uuid not null references gigs (id),
  status text not null default 'awaiting_talent'
    check (status in ('awaiting_talent', 'awaiting_hirer', 'confirmed', 'completed', 'cancelled')),
  proposed_by text not null default 'hirer' check (proposed_by in ('hirer', 'talent')),
  proposed_slots jsonb not null default '[]'::jsonb,
  confirmed_slot timestamptz,
  video_room_url text,
  hirer_joined_at timestamptz,
  talent_joined_at timestamptz,
  completed_at timestamptz,
  hirer_decision text check (hirer_decision in ('confirm', 'decline')),
  decision_reason text check (decision_reason in ('fit', 'availability', 'communication', 'changed_requirements', 'other')),
  decision_notes text,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (application_id)
);

create index interviews_hirer_id_idx on interviews (hirer_id);
create index interviews_talent_id_idx on interviews (talent_id);

create trigger interviews_set_updated_at
  before update on interviews
  for each row execute function set_updated_at();

alter table interviews enable row level security;

create policy "interviews_select_involved_or_admin"
  on interviews for select
  using (hirer_id = auth.uid() or talent_id = auth.uid() or is_admin());

create policy "interviews_insert_hirer"
  on interviews for insert
  with check (hirer_id = auth.uid());

create policy "interviews_update_involved_or_admin"
  on interviews for update
  using (hirer_id = auth.uid() or talent_id = auth.uid() or is_admin());

-- ============================================================
-- non_circumvention_acknowledgments (hard gate, scoped per hirer-talent-job)
-- ============================================================

create table non_circumvention_acknowledgments (
  id uuid primary key default gen_random_uuid(),
  hirer_id uuid not null references users (id),
  talent_id uuid not null references users (id),
  gig_id uuid not null references gigs (id),
  acknowledged_at timestamptz not null default now(),
  unique (hirer_id, talent_id, gig_id)
);

create index non_circumvention_ack_hirer_id_idx on non_circumvention_acknowledgments (hirer_id);

alter table non_circumvention_acknowledgments enable row level security;

create policy "non_circumvention_ack_select_own_or_admin"
  on non_circumvention_acknowledgments for select
  using (hirer_id = auth.uid() or is_admin());

create policy "non_circumvention_ack_insert_own"
  on non_circumvention_acknowledgments for insert
  with check (hirer_id = auth.uid());

-- ============================================================
-- Repeated-no-show tracking, surfaced to admins (not auto-enforced)
-- ============================================================

alter table users add column no_show_count integer not null default 0;
