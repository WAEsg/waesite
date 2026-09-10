-- WaeWork Phase 1 schema: users, gigs, contracts, milestones, applications
-- Run via `supabase db push` or paste into the Supabase SQL editor.

-- ============================================================
-- Enums
-- ============================================================

create type user_role as enum ('hirer', 'talent', 'admin');

create type gig_budget_type as enum ('fixed', 'hourly');
create type gig_status as enum ('draft', 'open', 'in_progress', 'completed', 'cancelled');

create type application_status as enum ('pending', 'accepted', 'rejected', 'withdrawn');

create type contract_type as enum ('one_off', 'retainer');
create type contract_rate_type as enum ('fixed', 'hourly', 'monthly');
create type contract_status as enum ('active', 'paused', 'completed', 'cancelled');

create type milestone_status as enum ('pending', 'submitted', 'approved', 'rejected', 'paid');

-- ============================================================
-- updated_at helper
-- ============================================================

create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- users
-- One row per auth.users row, created by the handle_new_user trigger
-- below. `role` starts null until the onboarding flow sets it.
-- ============================================================

create table users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role user_role,
  full_name text,
  business_name text,
  country text,
  verified boolean not null default false,
  stripe_account_id text,
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table users is 'Profile row for every authenticated hirer, talent, or admin.';
comment on column users.business_name is 'Hirer-only: company or brand name shown to talent.';
comment on column users.country is 'Free text, not an enum — talent can be based anywhere globally.';
comment on column users.stripe_account_id is 'Talent-only: Stripe Connect account for payouts.';
comment on column users.stripe_customer_id is 'Hirer-only: Stripe customer for charges/billing.';

create trigger users_set_updated_at
  before update on users
  for each row execute function set_updated_at();

-- Auto-create a users row whenever someone signs up via Supabase Auth.
create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- gigs (one-off projects posted by hirers)
-- ============================================================

create table gigs (
  id uuid primary key default gen_random_uuid(),
  hirer_id uuid not null references users (id) on delete cascade,
  title text not null,
  description text not null,
  category text,
  budget_type gig_budget_type not null,
  budget_amount numeric(12, 2) not null check (budget_amount >= 0),
  status gig_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index gigs_hirer_id_idx on gigs (hirer_id);
create index gigs_status_idx on gigs (status);

create trigger gigs_set_updated_at
  before update on gigs
  for each row execute function set_updated_at();

-- ============================================================
-- applications (talent applying to a gig)
-- ============================================================

create table applications (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid not null references gigs (id) on delete cascade,
  talent_id uuid not null references users (id) on delete cascade,
  cover_letter text,
  proposed_rate numeric(12, 2) check (proposed_rate >= 0),
  status application_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (gig_id, talent_id)
);

create index applications_gig_id_idx on applications (gig_id);
create index applications_talent_id_idx on applications (talent_id);

create trigger applications_set_updated_at
  before update on applications
  for each row execute function set_updated_at();

-- ============================================================
-- contracts (one-off gigs converted to work, or standalone retainers)
-- ============================================================

create table contracts (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid references gigs (id) on delete set null,
  hirer_id uuid not null references users (id) on delete cascade,
  talent_id uuid not null references users (id) on delete cascade,
  type contract_type not null,
  rate_amount numeric(12, 2) not null check (rate_amount >= 0),
  rate_type contract_rate_type not null,
  status contract_status not null default 'active',
  stripe_subscription_id text,
  start_date date not null default current_date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index contracts_hirer_id_idx on contracts (hirer_id);
create index contracts_talent_id_idx on contracts (talent_id);
create index contracts_status_idx on contracts (status);

create trigger contracts_set_updated_at
  before update on contracts
  for each row execute function set_updated_at();

-- ============================================================
-- milestones (deliverables/payments within a contract)
-- ============================================================

create table milestones (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts (id) on delete cascade,
  title text not null,
  description text,
  amount numeric(12, 2) not null check (amount >= 0),
  status milestone_status not null default 'pending',
  due_date date,
  submitted_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index milestones_contract_id_idx on milestones (contract_id);
create index milestones_status_idx on milestones (status);

create trigger milestones_set_updated_at
  before update on milestones
  for each row execute function set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================

alter table users enable row level security;
alter table gigs enable row level security;
alter table applications enable row level security;
alter table contracts enable row level security;
alter table milestones enable row level security;

-- Helper: is the current user an admin?
create function is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  );
$$;

-- ---- users -------------------------------------------------

create policy "users_select_own_or_admin"
  on users for select
  using (id = auth.uid() or is_admin());

create policy "users_update_own"
  on users for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Talent profiles (name/verification) are visible to any authenticated
-- hirer browsing talent; keep this narrow rather than exposing every column.
create policy "users_select_public_talent_profile"
  on users for select
  using (role = 'talent' and auth.role() = 'authenticated');

-- ---- gigs ----------------------------------------------------

create policy "gigs_select_open_to_authenticated"
  on gigs for select
  using (status in ('open', 'in_progress', 'completed') or hirer_id = auth.uid() or is_admin());

create policy "gigs_insert_own"
  on gigs for insert
  with check (hirer_id = auth.uid());

create policy "gigs_update_own"
  on gigs for update
  using (hirer_id = auth.uid() or is_admin())
  with check (hirer_id = auth.uid() or is_admin());

create policy "gigs_delete_own"
  on gigs for delete
  using (hirer_id = auth.uid() or is_admin());

-- ---- applications --------------------------------------------

create policy "applications_select_involved"
  on applications for select
  using (
    talent_id = auth.uid()
    or is_admin()
    or exists (select 1 from gigs where gigs.id = applications.gig_id and gigs.hirer_id = auth.uid())
  );

create policy "applications_insert_own"
  on applications for insert
  with check (talent_id = auth.uid());

create policy "applications_update_involved"
  on applications for update
  using (
    talent_id = auth.uid()
    or is_admin()
    or exists (select 1 from gigs where gigs.id = applications.gig_id and gigs.hirer_id = auth.uid())
  )
  with check (
    talent_id = auth.uid()
    or is_admin()
    or exists (select 1 from gigs where gigs.id = applications.gig_id and gigs.hirer_id = auth.uid())
  );

-- ---- contracts -------------------------------------------------

create policy "contracts_select_involved"
  on contracts for select
  using (hirer_id = auth.uid() or talent_id = auth.uid() or is_admin());

create policy "contracts_insert_hirer"
  on contracts for insert
  with check (hirer_id = auth.uid());

create policy "contracts_update_involved"
  on contracts for update
  using (hirer_id = auth.uid() or talent_id = auth.uid() or is_admin())
  with check (hirer_id = auth.uid() or talent_id = auth.uid() or is_admin());

-- ---- milestones --------------------------------------------------

create policy "milestones_select_involved"
  on milestones for select
  using (
    is_admin()
    or exists (
      select 1 from contracts
      where contracts.id = milestones.contract_id
        and (contracts.hirer_id = auth.uid() or contracts.talent_id = auth.uid())
    )
  );

create policy "milestones_insert_hirer"
  on milestones for insert
  with check (
    exists (
      select 1 from contracts
      where contracts.id = milestones.contract_id and contracts.hirer_id = auth.uid()
    )
  );

create policy "milestones_update_involved"
  on milestones for update
  using (
    is_admin()
    or exists (
      select 1 from contracts
      where contracts.id = milestones.contract_id
        and (contracts.hirer_id = auth.uid() or contracts.talent_id = auth.uid())
    )
  )
  with check (
    is_admin()
    or exists (
      select 1 from contracts
      where contracts.id = milestones.contract_id
        and (contracts.hirer_id = auth.uid() or contracts.talent_id = auth.uid())
    )
  );
