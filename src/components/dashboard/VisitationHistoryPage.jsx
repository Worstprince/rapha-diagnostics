"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  Avatar,
  ChevronRightIcon,
  EmptyState,
  HeaderGlow,
  SearchIcon,
  TableSkeleton,
  Pill,
  PriorityPill,
  rowAction,
  td,
  th,
} from "@/app/dashboard/_ui";

const DAY = 24 * 60 * 60 * 1000;

function relativeLabel(date) {
  const days = Math.floor((Date.now() - date.getTime()) / DAY);
  if (days < 0) return "Scheduled";
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }
  const months = Math.floor(days / 30);
  return `${months} ${months === 1 ? "month" : "months"} ago`;
}

export default function VisitationHistoryPage({ basePath = "/dashboard/doctor", roleLabel = "Doctor" }) {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchHistory() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page), limit: "10" });
        if (search.trim()) params.set("search", search.trim());
        if (priorityFilter) params.set("priority", priorityFilter);
        params.set("sortDate", "newest");

        const response = await fetch(`/api/doctor/visitationHistory?${params.toString()}`);
        const data = await response.json();

        if (!active) return;
        if (!response.ok) throw new Error(data.message || "Failed to load visitation history.");

        setHistory(Array.isArray(data.rows) ? data.rows : []);
        setHasError(false);
      } catch (error) {
        console.error(error);
        if (!active) return;
        setHistory([]);
        setHasError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchHistory();
    return () => {
      active = false;
    };
  }, [page, search, priorityFilter]);

  const filteredHistory = useMemo(() => {
    const query = search.trim().toLowerCase();
    return history.filter((item) => {
      const matchesSearch = !query || [item.name, item.patientid, item.status].join(" ").toLowerCase().includes(query);
      const matchesPriority = !priorityFilter || item.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [history, search, priorityFilter]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">
      <header className="rd-panel relative flex-none overflow-hidden">
        <HeaderGlow />
        <div className="relative flex flex-wrap items-end justify-between gap-x-8 gap-y-5 px-6 py-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">{roleLabel}</p>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-rd-title">Visitation History</h1>
            <p className="mt-1.5 text-sm text-rd-muted">Closed and completed requests from the clinic record.</p>
          </div>
        </div>
      </header>

      <section className="rd-panel flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex flex-none flex-wrap items-center justify-between gap-4 border-b border-rd-hair p-4">
          <div>
            <h2 className="text-lg font-semibold text-rd-title">History</h2>
            <p className="mt-0.5 text-sm text-rd-muted">{loading ? "Loading records…" : `${filteredHistory.length} records`}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <span aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-rd-placeholder"><SearchIcon /></span>
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patient or ID…" className="rd-input pl-11" />
            </div>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="rd-input">
              <option value="">All priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
            </select>
          </div>
        </div>

        <div className="rd-scroll-thin min-h-0 flex-1 overflow-auto">
          {loading ? (
            <TableSkeleton rows={6} />
          ) : hasError ? (
            <EmptyState title="Could not load historical visitations" hint="Something went wrong reaching the server. Refresh the page to try again." />
          ) : filteredHistory.length === 0 ? (
            <EmptyState title="No history found" hint="There are no matching records to show." />
          ) : (
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="border-b border-rd-hair-strong bg-rd-sunken">
                  <th className={th}>Patient</th>
                  <th className={th}>Status</th>
                  <th className={th}>Priority</th>
                  <th className={th}>Visit date</th>
                  <th className={`${th} text-right`}><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.id || item.visitid} className="border-b border-rd-hair transition-colors last:border-0 hover:bg-rd-raised">
                    <td className={td}>
                      <div className="flex items-center gap-3">
                        <Avatar name={item.name} />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-rd-title">{item.name}</p>
                          <p className="truncate text-xs text-rd-muted">ID #{item.patientid || item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className={td}><Pill value={item.status} /></td>
                    <td className={td}><PriorityPill value={item.priority} /></td>
                    <td className={td}>{item.visited_at ? relativeLabel(new Date(item.visited_at)) : "—"}</td>
                    <td className={`${td} text-right`}>
                      <Link href={`${basePath}/visitation/${item.visitid || item.id}`} className={rowAction}>
                        Open
                        <ChevronRightIcon size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-rd-hair p-4 text-sm text-rd-muted">
          <span>Page {page}</span>
          <div className="flex items-center gap-2">
            <button type="button" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rd-btn-secondary rd-press rd-focus disabled:opacity-50">Prev</button>
            <button type="button" onClick={() => setPage((value) => value + 1)} className="rd-btn-secondary rd-press rd-focus">Next</button>
          </div>
        </div>
      </section>
    </div>
  );
}
