-- Schema for the admin dashboard (B), messaging (D), reviews (F), the
-- AI Staffing subscription record the admin overview needs to query
-- against (O's DB piece, pulled forward so the admin page has something
-- real rather than a broken query), and account deletion requests (I).

-- ============================================================
-- admin_audit_log — every admin resolution action, immutable
-- ============================================================

create table admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references users (id),
  action text not null,
  target_type text not null,
  target_id uuid not null,
  reason text,
  created_at timestamptz not null default now()
);

create index admin_audit_log_target_idx on admin_audit_log (target_type, target_id);

alter table admin_audit_log enable row level security;

create policy "admin_audit_log_select_admin"
  on admin_audit_log for select
  using (is_admin());

-- Inserted through the acting admin's own session (not the service-role
-- client) so admin_id is genuinely who performed the action, not
-- spoofable — same reasoning as terms_acceptances_insert_own.
create policy "admin_audit_log_insert_admin"
  on admin_audit_log for insert
  with check (is_admin() and admin_id = auth.uid());

-- No update/delete: audit trail, corrections are new rows.

-- ============================================================
-- ai_staffing_subscriptions — hirer-only, admin sees all
-- ============================================================

create table ai_staffing_subscriptions (
  id uuid primary key default gen_random_uuid(),
  hirer_id uuid not null references users (id) on delete cascade,
  tier text not null check (tier in ('starter', 'growth', 'custom')),
  status text not null default 'pending' check (status in ('pending', 'active', 'cancelled', 'past_due')),
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index ai_staffing_subscriptions_hirer_id_idx on ai_staffing_subscriptions (hirer_id);

create trigger ai_staffing_subscriptions_set_updated_at
  before update on ai_staffing_subscriptions
  for each row execute function set_updated_at();

alter table ai_staffing_subscriptions enable row level security;

create policy "ai_staffing_subscriptions_select_own_or_admin"
  on ai_staffing_subscriptions for select
  using (hirer_id = auth.uid() or is_admin());

-- No client insert/update at all — a hirer inserting their own "active"
-- row via RLS would let them claim a subscription without ever paying.
-- Rows are created/transitioned server-side via the admin client, once
-- real Stripe Billing checkout/webhooks confirm payment.

-- ============================================================
-- Messaging — one conversation per application, contact-info masked
-- before storage (see src/lib/messaging/mask.ts)
-- ============================================================

create table conversations (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications (id) on delete cascade unique,
  gig_id uuid not null references gigs (id) on delete cascade,
  hirer_id uuid not null references users (id) on delete cascade,
  talent_id uuid not null references users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index conversations_hirer_id_idx on conversations (hirer_id);
create index conversations_talent_id_idx on conversations (talent_id);

alter table conversations enable row level security;

create policy "conversations_select_involved"
  on conversations for select
  using (hirer_id = auth.uid() or talent_id = auth.uid() or is_admin());

create policy "conversations_insert_involved"
  on conversations for insert
  with check (hirer_id = auth.uid() or talent_id = auth.uid());

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations (id) on delete cascade,
  sender_id uuid not null references users (id),
  body text not null,
  created_at timestamptz not null default now()
);

create index messages_conversation_id_idx on messages (conversation_id);

alter table messages enable row level security;

create policy "messages_select_involved"
  on messages for select
  using (
    is_admin()
    or exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
        and (conversations.hirer_id = auth.uid() or conversations.talent_id = auth.uid())
    )
  );

create policy "messages_insert_involved"
  on messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
        and (conversations.hirer_id = auth.uid() or conversations.talent_id = auth.uid())
    )
  );

-- ============================================================
-- Reviews — mutual, immutable, gated the same way talent_profiles is
-- ============================================================

create table reviews (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts (id) on delete cascade,
  rater_id uuid not null references users (id),
  ratee_id uuid not null references users (id),
  score integer not null check (score between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create index reviews_ratee_id_idx on reviews (ratee_id);
create index reviews_contract_id_idx on reviews (contract_id);

alter table reviews enable row level security;

-- Visible to the two parties directly, and to anyone else who has an
-- actual application relationship with the ratee — same "no public
-- directory" gating already used for talent_profiles, since reviews feed
-- the same reputation-trust mechanic.
create policy "reviews_select_involved_or_related"
  on reviews for select
  using (
    rater_id = auth.uid()
    or ratee_id = auth.uid()
    or is_admin()
    or exists (
      select 1 from applications
      join gigs on gigs.id = applications.gig_id
      where (applications.talent_id = reviews.ratee_id and gigs.hirer_id = auth.uid())
         or (gigs.hirer_id = reviews.ratee_id and applications.talent_id = auth.uid())
    )
  );

create policy "reviews_insert_own_as_contract_party"
  on reviews for insert
  with check (
    rater_id = auth.uid()
    and exists (
      select 1 from contracts
      where contracts.id = reviews.contract_id
        and (
          (contracts.hirer_id = auth.uid() and contracts.talent_id = reviews.ratee_id)
          or (contracts.talent_id = auth.uid() and contracts.hirer_id = reviews.ratee_id)
        )
    )
  );

-- No update/delete: ratings aren't self-editable — disputes about an
-- unfair rating route to the admin dispute queue instead.

-- ============================================================
-- Account deletion requests — PDPA-style confirmation + audit trail
-- ============================================================

create table account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  status text not null default 'requested' check (status in ('requested', 'completed', 'cancelled')),
  requested_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table account_deletion_requests enable row level security;

create policy "account_deletion_requests_select_own_or_admin"
  on account_deletion_requests for select
  using (user_id = auth.uid() or is_admin());

create policy "account_deletion_requests_insert_own"
  on account_deletion_requests for insert
  with check (user_id = auth.uid());

-- No client update: processing (actually deleting the account) happens
-- server-side via the admin client, which bypasses RLS.
