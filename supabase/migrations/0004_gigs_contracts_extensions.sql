-- Job-post engagement type/urgency, and the extra contract fields needed
-- for placement-fee refund windows and retainer billing.

create type gig_engagement_type as enum ('ongoing', 'gig');

alter table gigs add column engagement_type gig_engagement_type not null default 'gig';
alter table gigs add column urgent boolean not null default false;

comment on column gigs.engagement_type is
  'ongoing = retainer-style team extension, gig = one-off project. Drives which contract.type a resulting contract gets.';

-- contracts.type (one_off | retainer, from 0001) already distinguishes
-- milestone-tracker contracts from 30-day-escrow retainers — no separate
-- engagement_type column needed here.
alter table contracts add column placement_fee_amount numeric(12, 2) check (placement_fee_amount >= 0);
alter table contracts add column monthly_pay numeric(12, 2) check (monthly_pay >= 0);
alter table contracts add column current_period_start date;
alter table contracts add column original_placement_date date;

comment on column contracts.original_placement_date is
  'Anchor for the 30-day placement-fee refund window. Distinct from start_date in case a contract is ever restarted.';

alter table milestones add column sequence_order integer;
alter table milestones add column submission_link text;

comment on column milestones.submission_link is
  'Link/file the talent attaches when marking a milestone submitted. Kept separate from description (the client-authored brief set at contract setup) so submitting never overwrites it.';
