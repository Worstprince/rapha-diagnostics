"use client";

import { useMemo, useSyncExternalStore } from "react";

/* The signed-in user is cached by the login page (auth/login/page.jsx). This is a
   convenience cache for display only — it is not an auth boundary. Anything that
   must actually be enforced has to be checked on the server. */
const KEY = "rd-user";

/* `storage` only fires in *other* tabs, so same-tab writes announce themselves. */
const SAME_TAB = "rd-session";

function subscribe(onChange) {
  window.addEventListener("storage", onChange);
  window.addEventListener(SAME_TAB, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SAME_TAB, onChange);
  };
}

/* Returns the raw string, not a parsed object: useSyncExternalStore compares
   snapshots by identity, and a fresh JSON.parse every call would loop forever. */
function getSnapshot() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot() {
  return null;
}

export function useCurrentUser() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, [raw]);
}

export function signOut() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable — the redirect still gets the user out of the UI */
  }
  window.dispatchEvent(new Event(SAME_TAB));
}
