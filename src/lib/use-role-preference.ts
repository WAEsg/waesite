"use client";

import { useSyncExternalStore } from "react";

// Mirrors the prototype's WW.setRole()/WW.role(): a genuinely tri-state
// role — 'hirer' | 'talent' | null (never chosen) — remembered in
// localStorage once the visitor picks a side (a nav CTA, a "hiring or
// looking for work?" pick, a role-scoped signup link, etc.). Each
// consumer decides what "null" means for its own copy, exactly like the
// prototype's `data-role-show="hirer none"` (hirer-facing by default,
// only an explicit talent choice flips it) vs `data-role-show="talent
// none"` (the mirror, e.g. the talent role-finder's apply CTA).
//
// Backed by a module-level store (not a plain useState) so that every
// component on the page — the hero's role picker, the pricing
// calculator's receipt, the "Where to next?" cards — reacts to the same
// choice immediately, the way the prototype's single global `role`
// variable does. A plain per-component useState synced only through
// localStorage wouldn't re-render sibling components in the same tab,
// since the storage event only fires in *other* tabs.
export type SiteRole = "hirer" | "talent" | null;
const STORAGE_KEY = "ww-role";

let role: SiteRole = null;
let hydrated = false;
const listeners = new Set<() => void>();

function readStorage(): SiteRole {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "hirer" || stored === "talent" ? stored : null;
  } catch {
    return null;
  }
}

function subscribe(listener: () => void) {
  if (!hydrated) {
    hydrated = true;
    role = readStorage();
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): SiteRole {
  return role;
}

function getServerSnapshot(): SiteRole {
  return null;
}

function setRole(next: SiteRole) {
  role = next;
  try {
    if (next) window.localStorage.setItem(STORAGE_KEY, next);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  for (const listener of listeners) listener();
}

export function useRolePreference(): [SiteRole, (role: SiteRole) => void] {
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return [value, setRole];
}
