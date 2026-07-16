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

export function signOut() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    
  }
  window.dispatchEvent(new Event(SAME_TAB));
}
