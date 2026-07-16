"use client";

import { useEffect, useState } from "react";

export default function ActivityLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch("/api/activityLog");
        const data = await response.json();
        if (cancelled) return;
        setLogs(Array.isArray(data) ? data : (data?.rows ?? []));
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <header className="rd-panel p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">Admin</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">Activity Log</h1>
        <p className="mt-2 text-sm text-rd-muted">
          Monitor and review all user activities within the system.
        </p>
      </header>

      <section className="rd-panel p-6 overflow-y-auto max-h-[70vh] rd-scroll-thin">
        {loading && <p className="py-10 text-center text-sm text-rd-muted">Loading activity…</p>}

        {!loading && logs.length === 0 && (
          <p className="py-10 text-center text-sm text-rd-muted">No activity recorded yet.</p>
        )}

        {/* An ordered list: the sequence is the meaning here. The rail on the
            left ties the entries together as one timeline. */}
        <ol className="space-y-2.5">
          {logs.map((log) => (
            <li
              key={log.id}
              className="relative overflow-hidden rounded-xl border border-rd-hair bg-rd-sunken p-4 pl-5"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-rd-cyan/40"
              />
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h2 className="text-sm font-semibold text-rd-title">{log.action}</h2>
                <time className="text-xs tabular-nums text-rd-muted">{log.datetime}</time>
              </div>
              <p className="mt-1.5 text-sm text-rd-label">{log.description}</p>
              <p className="mt-2 text-xs text-rd-muted">
                Performed by <span className="font-medium text-rd-label">{log.username}</span>
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
