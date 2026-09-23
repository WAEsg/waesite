-- Splits the platform fee from the pass-through amount at the point of
-- payment (Stripe application_fee_amount), rather than reconstructing it
-- after the fact from a single total. Nullable since existing rows from
-- before this split existed only recorded a single `amount`.

alter table payment_events add column fee_amount numeric(12, 2) check (fee_amount >= 0);
alter table payment_events add column pass_through_amount numeric(12, 2) check (pass_through_amount >= 0);

comment on column payment_events.amount is
  'Gross amount for the event: the total charged to the client for a release/escrow_hold, or the amount returned for a refund/credit. Equals fee_amount + pass_through_amount for release/escrow_hold events.';
comment on column payment_events.fee_amount is
  'Platform''s cut (Stripe application_fee_amount) — for placement fees this equals the full amount; for milestone/period releases it''s the combined client+talent fee share.';
comment on column payment_events.pass_through_amount is
  'What actually routes to the talent''s connected account (releases), or back to the client (refunds/credits).';
