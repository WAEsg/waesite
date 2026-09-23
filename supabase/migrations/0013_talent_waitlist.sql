-- Pre-launch "Founding Talent" waitlist for talent sign-ups. Public,
-- unauthenticated insert (anyone can join from the marketing page);
-- admin-only read/update. Includes the invite-token/conversion columns
-- up front so the launch-day activation flow (token generation, a
-- pre-filled ?invite= signup, and the admin funnel view) can be built
-- against this table without a second migration — those features aren't
-- built yet, only the schema they'll need.

create table waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  skill_category text,
  portfolio_link text,
  availability text,
  expected_rate text,
  intro_text text,
  status text not null default 'waitlisted'
    check (status in ('waitlisted', 'invited', 'signed_up', 'verified')),
  invite_token uuid unique,
  invite_sent_at timestamptz,
  converted_at timestamptz,
  converted_user_id uuid references users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (email)
);

create index waitlist_signups_status_idx on waitlist_signups (status);
create index waitlist_signups_invite_token_idx on waitlist_signups (invite_token);

create trigger waitlist_signups_set_updated_at
  before update on waitlist_signups
  for each row execute function set_updated_at();

alter table waitlist_signups enable row level security;

-- Anyone can join the waitlist — this runs before the visitor has an
-- account, let alone a session, so the insert can't be scoped to auth.uid().
-- Turnstile + the app-level Zod validation are the actual abuse guards;
-- rate limiting the same way signup/login are (see check_rate_limit) is a
-- reasonable follow-up once this sees real traffic.
create policy "waitlist_signups_insert_public"
  on waitlist_signups for insert
  with check (true);

create policy "waitlist_signups_select_admin"
  on waitlist_signups for select
  using (is_admin());

create policy "waitlist_signups_update_admin"
  on waitlist_signups for update
  using (is_admin());
