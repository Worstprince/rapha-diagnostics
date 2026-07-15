"use client";

import { useCallback, useSyncExternalStore } from "react";

// <html data-theme> is the source of truth — the bootstrap script in the root
// layout sets it before paint, and CSS reads it directly. This subscribes to it
// rather than mirroring it into state, so every mounted toggle stays in sync and
// nothing re-renders on mount just to catch up.

const listeners = new Set();

function subscribe(onChange) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function getSnapshot() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

// Must match what the server rendered onto <html>, or hydration mismatches.
function getServerSnapshot() {
  return "dark";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next = getSnapshot() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("rd-theme", next);
    } catch {
      // Storage unavailable — the theme still applies for this session.
    }
    for (const onChange of listeners) onChange();
  }, []);

  return { theme, toggle };
}
