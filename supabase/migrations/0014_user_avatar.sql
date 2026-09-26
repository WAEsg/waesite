-- Profile picture support. A person-level photo (distinct from
-- hirer_profiles.logo_url, which is the company's logo) — lives on
-- users so it's available regardless of role.

alter table users add column avatar_url text;

-- Public bucket: profile pictures are shown to the other side of a
-- match (applicant lists, contract pages), not gated behind auth.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Objects are stored at "<user_id>/<filename>" — policies below key off
-- that first path segment to scope writes to the owning user, same
-- pattern Supabase's own docs use for per-user upload folders.
create policy "avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars_insert_own"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars_update_own"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars_delete_own"
  on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
