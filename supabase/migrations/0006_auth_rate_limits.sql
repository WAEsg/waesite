-- DB-backed sliding-window rate limiting for signup/login. No Redis/queue
-- infra in this stack, and Vercel serverless has no durable in-memory
-- state across invocations, so this leans on Postgres for the atomic
-- upsert-and-check instead.

create table auth_rate_limits (
  key text primary key,
  count integer not null default 1,
  window_start timestamptz not null default now()
);

alter table auth_rate_limits enable row level security;
-- Deliberately zero policies: no direct anon/authenticated access at all.
-- The only way in is the security-definer function below, so a client
-- can't read or reset its own abuse-detection counter.

create function check_rate_limit(p_key text, p_max_attempts int, p_window_seconds int)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  v_count integer;
  v_window_start timestamptz;
begin
  insert into auth_rate_limits (key, count, window_start)
  values (p_key, 1, now())
  on conflict (key) do update
    set count = case
          when auth_rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
            then 1
          else auth_rate_limits.count + 1
        end,
        window_start = case
          when auth_rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
            then now()
          else auth_rate_limits.window_start
        end
  returning count, window_start into v_count, v_window_start;

  return v_count <= p_max_attempts;
end;
$$;

comment on function check_rate_limit is
  'Atomic sliding-window check: increments (or resets, if the window has elapsed) the counter for p_key and returns whether it is still within p_max_attempts. Call via supabase.rpc from the anon-key client — security definer lets it write to auth_rate_limits despite that table having no client-facing RLS policies.';
