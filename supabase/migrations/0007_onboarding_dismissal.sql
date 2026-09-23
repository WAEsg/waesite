-- Persists the onboarding checklist's dismiss action across sessions/devices.
alter table users add column onboarding_dismissed_at timestamptz;
