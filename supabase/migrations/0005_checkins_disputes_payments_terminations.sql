-- Day-15 check-ins, disputes, the immutable payment_events audit log, and
-- early-termination settlement records.

-- ============================================================
-- checkins (no-payment day-15 progress note)
-- ============================================================

create table checkins (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts (id) on delete cascade,
  day integer not null default 15,
  submitted_by uuid not null references users (id),
  talent_note text not null,
  client_acknowledged boolean not null default false,
  acknowledged_by uuid references users (id),
  acknowledged_at timestamptz,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index checkins_contract_id_idx on checkins (contract_id);

alter table checkins enable row level security;

create policy "checkins_select_involved"
  on checkins for select
  using (
    is_admin()
    or exists (
      select 1 from contracts
      where contracts.id = checkins.contract_id
        and (contracts.hirer_id = auth.uid() or contracts.talent_id = auth.uid())
    )
  );

create policy "checkins_insert_talent"
  on checkins for insert
  with check (
    submitted_by = auth.uid()
    and exists (
      select 1 from contracts
      where contracts.id = checkins.contract_id and contracts.talent_id = auth.uid()
    )
  );

create policy "checkins_update_hirer_ack_or_admin"
  on checkins for update
  using (
    is_admin()
    or exists (
      select 1 from contracts
      where contracts.id = checkins.contract_id and contracts.hirer_id = auth.uid()
    )
  )
  with check (
    is_admin()
    or exists (
      select 1 from contracts
      where contracts.id = checkins.contract_id and contracts.hirer_id = auth.uid()
    )
  );

-- ============================================================
-- disputes (milestone-level or contract-level)
-- ============================================================

create table disputes (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts (id) on delete cascade,
  milestone_id uuid references milestones (id) on delete cascade,
  raised_by uuid not null references users (id),
  reason text not null,
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index disputes_contract_id_idx on disputes (contract_id);
create index disputes_milestone_id_idx on disputes (milestone_id);

alter table disputes enable row level security;

create policy "disputes_select_involved"
  on disputes for select
  using (
    is_admin()
    or exists (
      select 1 from contracts
      where contracts.id = disputes.contract_id
        and (contracts.hirer_id = auth.uid() or contracts.talent_id = auth.uid())
    )
  );

create policy "disputes_insert_involved"
  on disputes for insert
  with check (
    raised_by = auth.uid()
    and exists (
      select 1 from contracts
      where contracts.id = disputes.contract_id
        and (contracts.hirer_id = auth.uid() or contracts.talent_id = auth.uid())
    )
  );

-- Only admin/CS resolves a dispute — matches "Admin role bypasses these
-- for support/dispute handling" from the RLS requirements.
create policy "disputes_update_admin"
  on disputes for update
  using (is_admin())
  with check (is_admin());

-- ============================================================
-- terminations (defined before payment_events, which FKs into it)
-- ============================================================

create table terminations (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts (id) on delete cascade,
  initiated_by_user_id uuid not null references users (id),
  cause text not null check (
    cause in ('talent_mia', 'talent_quit', 'client_no_cause', 'performance', 'mutual', 'other')
  ),
  settlement_type text check (settlement_type in ('cash_refund', 'credit')),
  released_amount numeric(12, 2) check (released_amount >= 0),
  unearned_amount numeric(12, 2) check (unearned_amount >= 0),
  placement_fee_refund_amount numeric(12, 2) check (placement_fee_refund_amount >= 0),
  bench_activation_requested_at timestamptz,
  status text not null default 'pending_settlement' check (
    status in ('pending_settlement', 'settled')
  ),
  created_at timestamptz not null default now(),
  settled_at timestamptz
);

create index terminations_contract_id_idx on terminations (contract_id);

alter table terminations enable row level security;

create policy "terminations_select_involved"
  on terminations for select
  using (
    is_admin()
    or exists (
      select 1 from contracts
      where contracts.id = terminations.contract_id
        and (contracts.hirer_id = auth.uid() or contracts.talent_id = auth.uid())
    )
  );

create policy "terminations_insert_involved"
  on terminations for insert
  with check (
    initiated_by_user_id = auth.uid()
    and exists (
      select 1 from contracts
      where contracts.id = terminations.contract_id
        and (contracts.hirer_id = auth.uid() or contracts.talent_id = auth.uid())
    )
  );

-- Settlement math is executed server-side via the service-role client,
-- which bypasses RLS entirely. This admin policy only covers a human
-- admin acting through their own dashboard session for support cases.
create policy "terminations_update_admin"
  on terminations for update
  using (is_admin())
  with check (is_admin());

-- ============================================================
-- payment_events (immutable financial audit log)
-- ============================================================

create table payment_events (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts (id) on delete cascade,
  milestone_id uuid references milestones (id) on delete set null,
  termination_id uuid references terminations (id) on delete set null,
  event_type text not null check (
    event_type in ('escrow_hold', 'release', 'refund', 'credit_issued')
  ),
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'sgd',
  stripe_reference_id text,
  is_simulated boolean not null default false,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index payment_events_contract_id_idx on payment_events (contract_id);

alter table payment_events enable row level security;

create policy "payment_events_select_involved"
  on payment_events for select
  using (
    is_admin()
    or exists (
      select 1 from contracts
      where contracts.id = payment_events.contract_id
        and (contracts.hirer_id = auth.uid() or contracts.talent_id = auth.uid())
    )
  );

-- No insert/update/delete policy for anon/authenticated, including admin:
-- payment_events is a strictly financial audit log, written only by
-- trusted server code (webhook handlers, settlement actions) via the
-- service-role client, which bypasses RLS. Corrections are new rows, not
-- edits.
