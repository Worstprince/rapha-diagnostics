"use client";

// components/NotesQueueTable.jsx

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";

const PRIORITY_CLASSES = {
  Emergency: "bg-red-500/15 text-red-400",
  Routine: "bg-slate-500/15 text-slate-400",
};

const STATUS_CLASSES = {
  "Awaiting note": "bg-slate-500/15 text-slate-400",
  Draft: "bg-cyan-500/15 text-cyan-400",
  Finalized: "bg-emerald-500/15 text-emerald-400",
};

const ACTION_LABEL = {
  "Awaiting note": "Open",
  Draft: "Continue",
  Finalized: "View",
};

function Dot({ className }) {
  return <span className={"inline-block h-1.5 w-1.5 rounded-full " + className} />;
}

export default function NotesQueueTable({ entries = [] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => e.patientName.toLowerCase().includes(q));
  }, [entries, query]);

  return (
    <div className="min-h-screen w-full bg-[#0a0e1a] px-6 py-6 text-slate-100">
      <div className="mx-auto max-w-6xl">
        {/* Header card */}
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-white">Diagnostic Notes</h1>
            <p className="mt-1 text-sm text-slate-400">
              {filtered.length} in the queue
            </p>
          </div>
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patient..."
              className="h-10 w-64 rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
          <div className="grid grid-cols-[2fr_1.6fr_1.3fr_1.1fr_1.1fr_0.9fr] gap-4 border-b border-white/5 px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
            <span>Patient</span>
            <span>Tests</span>
            <span>Visit date</span>
            <span>Status</span>
            <span>Priority</span>
            <span className="text-right">Action</span>
          </div>

          {filtered.map((entry) => (
            <div
              key={entry.id}
              className="grid grid-cols-[2fr_1.6fr_1.3fr_1.1fr_1.1fr_0.9fr] items-center gap-4 border-b border-white/5 px-6 py-4 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-semibold text-cyan-300">
                  {entry.initials}
                </span>
                <span className="text-sm font-medium text-slate-100">
                  {entry.patientName}
                </span>
              </div>

              <span className="text-sm text-slate-400">
                {entry.tests.join(", ")}
              </span>

              <span className="text-sm text-slate-400">{entry.visitDate}</span>

              <span
                className={
                  "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium " +
                  STATUS_CLASSES[entry.status]
                }
              >
                <Dot
                  className={
                    entry.status === "Finalized"
                      ? "bg-emerald-400"
                      : entry.status === "Draft"
                      ? "bg-cyan-400"
                      : "bg-slate-400"
                  }
                />
                {entry.status}
              </span>

              <span
                className={
                  "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium " +
                  PRIORITY_CLASSES[entry.priority]
                }
              >
                <Dot
                  className={
                    entry.priority === "Emergency"
                      ? "bg-red-400"
                      : "bg-slate-400"
                  }
                />
                {entry.priority}
              </span>

              <Link
                href={`/dashboard/doctor/notes/${entry.id}`}
                className="ml-auto flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-white/5"
              >
                {ACTION_LABEL[entry.status]}
                <ChevronRight size={14} aria-hidden="true" />
              </Link>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-slate-500">
              No visits match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
