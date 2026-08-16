"use client";

import { useMemo, useSyncExternalStore } from "react";

const KEY = "rd-user";


const SAME_TAB = "rd-session";

function subscribe(onChange) {
  window.addEventListener("storage", onChange);
  window.addEventListener(SAME_TAB, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SAME_TAB, onChange);
  };
}


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

export function setCurrentUser(user) {
  try {
    localStorage.setItem(KEY, JSON.stringify(user));
  } catch {
    // Ignore storage errors; UI can still render the in-memory state.
  }
  window.dispatchEvent(new Event(SAME_TAB));
}

export function signOut() {
  try {
    localStorage.removeItem(KEY);
  } catch {

  }
  // Also clear the server-side session cookie — localStorage alone doesn't
  // touch it, so without this the httpOnly cookie would outlive "logout".
  fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
  window.dispatchEvent(new Event(SAME_TAB));
}
