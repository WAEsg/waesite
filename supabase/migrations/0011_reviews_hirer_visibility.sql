-- reviews_select_involved_or_related (0010) gates a hirer seeing a
-- talent's reviews behind an existing application — correct, since
-- talent shouldn't be scraped pre-match. But it also (unintentionally)
-- gated a TALENT seeing a HIRER's reviews the same way, which breaks the
-- actual intended use case: a talent deciding whether to apply to a job
-- post, before any application exists yet. Hirers want their reputation
-- visible to attract applicants — same reasoning already applied to
-- hirer_profiles_select_via_open_gig (0003). Mirror that policy here.

create policy "reviews_select_hirer_via_open_gig"
  on reviews for select
  using (
    exists (
      select 1 from gigs
      where gigs.hirer_id = reviews.ratee_id
        and gigs.status in ('open', 'in_progress', 'completed')
    )
  );
