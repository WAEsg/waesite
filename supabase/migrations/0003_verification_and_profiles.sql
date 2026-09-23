-- Identity verification + role-specific profile detail, both locked
-- behind verification_status = 'passed'.

create type verification_status_type as enum ('unverified', 'pending', 'passed', 'failed');
create type verification_provider as enum ('stripe_identity', 'myinfo');

-- ============================================================
-- users.verification_status
-- ============================================================

alter table users drop column verified;
alter table users add column verification_status verification_status_type not null default 'unverified';

comment on column users.verification_status is
  'Gates access to hirer_profiles/talent_profiles and, via proxy.ts, the whole dashboard. Set by the Stripe Identity / MyInfo webhook handlers, never by the client directly.';

-- ============================================================
-- hirer_profiles
-- ============================================================

create table hirer_profiles (
  user_id uuid primary key references users (id) on delete cascade,
  company_name text,
  uen text,
  company_size text,
  industry text,
  logo_url text,
  description text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger hirer_profiles_set_updated_at
  before update on hirer_profiles
  for each row execute function set_updated_at();

alter table hirer_profiles enable row level security;

create policy "hirer_profiles_select_own_or_admin"
  on hirer_profiles for select
  using (user_id = auth.uid() or is_admin());

-- Unlike talent, hirers want their company shown on their own open job
-- posts to attract applicants — mirrors gigs_select_open_to_authenticated
-- (0001) so "who's hiring" is visible wherever the gig itself already is.
create policy "hirer_profiles_select_via_open_gig"
  on hirer_profiles for select
  using (
    exists (
      select 1 from gigs
      where gigs.hirer_id = hirer_profiles.user_id
        and gigs.status in ('open', 'in_progress', 'completed')
    )
  );

create policy "hirer_profiles_insert_own_verified"
  on hirer_profiles for insert
  with check (
    user_id = auth.uid()
    and exists (select 1 from users where id = auth.uid() and verification_status = 'passed')
  );

create policy "hirer_profiles_update_own_verified"
  on hirer_profiles for update
  using (
    user_id = auth.uid()
    and exists (select 1 from users where id = auth.uid() and verification_status = 'passed')
  )
  with check (
    user_id = auth.uid()
    and exists (select 1 from users where id = auth.uid() and verification_status = 'passed')
  );

-- ============================================================
-- talent_profiles
-- ============================================================

create table talent_profiles (
  user_id uuid primary key references users (id) on delete cascade,
  headline text,
  bio text,
  skills text[] not null default '{}',
  rate_amount numeric(12, 2) check (rate_amount >= 0),
  rate_unit text check (rate_unit in ('hourly', 'monthly')),
  years_experience integer check (years_experience >= 0),
  availability text,
  resume_url text,
  portfolio_links text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger talent_profiles_set_updated_at
  before update on talent_profiles
  for each row execute function set_updated_at();

alter table talent_profiles enable row level security;

create policy "talent_profiles_select_own_or_admin"
  on talent_profiles for select
  using (user_id = auth.uid() or is_admin());

-- A hirer can see a talent's profile detail once that talent has applied
-- to one of the hirer's gigs — any application status, not just accepted,
-- since the hirer needs the profile to decide whether to shortlist/accept
-- in the first place. This replaces the old, overly broad
-- users_select_public_talent_profile policy (see below).
create policy "talent_profiles_select_by_applied_to_hirer"
  on talent_profiles for select
  using (
    exists (
      select 1 from applications
      join gigs on gigs.id = applications.gig_id
      where applications.talent_id = talent_profiles.user_id
        and gigs.hirer_id = auth.uid()
    )
  );

create policy "talent_profiles_insert_own_verified"
  on talent_profiles for insert
  with check (
    user_id = auth.uid()
    and exists (select 1 from users where id = auth.uid() and verification_status = 'passed')
  );

create policy "talent_profiles_update_own_verified"
  on talent_profiles for update
  using (
    user_id = auth.uid()
    and exists (select 1 from users where id = auth.uid() and verification_status = 'passed')
  )
  with check (
    user_id = auth.uid()
    and exists (select 1 from users where id = auth.uid() and verification_status = 'passed')
  );

-- ============================================================
-- verification_records
-- ============================================================

create table verification_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  provider verification_provider not null,
  provider_reference_id text,
  status verification_status_type not null default 'pending',
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index verification_records_user_id_idx on verification_records (user_id);

create trigger verification_records_set_updated_at
  before update on verification_records
  for each row execute function set_updated_at();

alter table verification_records enable row level security;

create policy "verification_records_select_own_or_admin"
  on verification_records for select
  using (user_id = auth.uid() or is_admin());

-- No insert/update policy for anon/authenticated: verification_records is
-- written exclusively by the Stripe Identity / MyInfo webhook handlers via
-- the service-role client, which bypasses RLS by design.

-- ============================================================
-- Fix the overly-broad talent-visibility policy from 0001
-- ============================================================

drop policy "users_select_public_talent_profile" on users;
-- users is now own-row + admin (see users_select_own_or_admin in 0001)
-- plus one narrow addition below: a hirer can see the base users row
-- (full_name, etc.) of a talent who has actually applied to one of their
-- gigs, same gating as talent_profiles_select_by_applied_to_hirer. This
-- is what lets the Applicants tab show a name at all — RLS is row-level,
-- so this does expose the full row, not just full_name, but nothing else
-- on users is sensitive (business_name/country are meant to be visible,
-- stripe_customer_id is hirer-only so always null for a talent row).

create policy "users_select_talent_by_applied_to_hirer"
  on users for select
  using (
    role = 'talent'
    and exists (
      select 1 from applications
      join gigs on gigs.id = applications.gig_id
      where applications.talent_id = users.id
        and gigs.hirer_id = auth.uid()
    )
  );
