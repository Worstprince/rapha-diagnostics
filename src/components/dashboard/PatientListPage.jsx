"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  Avatar,
  ChevronRightIcon,
  ClockIcon,
  EmptyState,
  HeaderGlow,
  InboxIcon,
  SearchIcon,
  TableSkeleton,
  UserIcon,
  rowAction,
  td,
  th,
} from "@/app/dashboard/_ui";

const DAY = 24 * 60 * 60 * 1000;
const PAGE_SIZE = 10;

function visitDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function relativeLabel(date) {
  const days = Math.floor((Date.now() - date.getTime()) / DAY);

  if (days < 0) return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

export default function PatientListPage({ basePath = "/dashboard/doctor", roleLabel = "Doctor" }) {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("recent");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchPatients() {
      try {
        const response = await fetch("/api/doctor/patients");
        const data = await response.json();

        if (!active) return;

        if (!response.ok) throw new Error(data.message || "Failed to load patients.");

        setPatients(Array.isArray(data) ? data : []);
        setHasError(false);
      } catch (error) {
        console.error(error);
        if (!active) return;
        setPatients([]);
        setHasError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchPatients();
    return () => {
      active = false;
    };
  }, []);

  const filteredPatients = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    const rows = Array.isArray(patients) ? patients : [];

    const sorted = [...rows].sort((a, b) => {
      if (sortKey === "name") {
        return String(a.name ?? "").localeCompare(String(b.name ?? ""));
      }
      if (sortKey === "visits") {
        return (b.visitcount ?? 0) - (a.visitcount ?? 0);
      }

      const left = visitDate(b.lastvisited)?.getTime() ?? -Infinity;
      const right = visitDate(a.lastvisited)?.getTime() ?? -Infinity;
      return left - right;
    });

    if (!searchValue) return sorted;

    return sorted.filter(
      (patient) =>
        String(patient.name ?? "").toLowerCase().includes(searchValue) ||
        String(patient.patientid).includes(searchValue),
    );
  }, [patients, search, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedPatients = filteredPatients.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const rangeStart = filteredPatients.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredPatients.length);

  useEffect(() => {
    setPage(1);
  }, [search, sortKey]);

  const seenThisWeek = patients.filter((patient) => {
    const date = visitDate(patient.lastvisited);
    return date ? Date.now() - date.getTime() <= 7 * DAY : false;
  }).length;

  const neverSeen = patients.filter((patient) => !visitDate(patient.lastvisited)).length;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">
      <header className="rd-panel relative flex-none overflow-hidden">
        <HeaderGlow />
        <div className="relative flex flex-wrap items-end justify-between gap-x-8 gap-y-5 px-6 py-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">{roleLabel}</p>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-rd-title">Patients</h1>
            <p className="mt-1.5 text-sm text-rd-muted">
              View patient information, laboratory results, and visit history.
            </p>
          </div>

          <dl className="flex flex-wrap items-center gap-x-7 gap-y-4">
            <div title="On the clinic register" className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl rd-tint-cyan"><UserIcon size={18} /></span>
              <div>
                <dd className="text-xl font-bold tabular-nums leading-none tracking-tight text-rd-title">{loading ? "—" : patients.length}</dd>
                <dt className="mt-1 text-xs text-rd-muted">Total patients</dt>
              </div>
            </div>

            <div title="Visited in the last 7 days" className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl rd-tint-green"><ClockIcon size={18} /></span>
              <div>
                <dd className="text-xl font-bold tabular-nums leading-none tracking-tight text-rd-title">{loading ? "—" : seenThisWeek}</dd>
                <dt className="mt-1 text-xs text-rd-muted">Seen this week</dt>
              </div>
            </div>

            <div title="Registered but no visit yet" className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl rd-tint-amber"><InboxIcon size={18} /></span>
              <div>
                <dd className="text-xl font-bold tabular-nums leading-none tracking-tight text-rd-title">{loading ? "—" : neverSeen}</dd>
                <dt className="mt-1 text-xs text-rd-muted">Never seen</dt>
              </div>
            </div>
          </dl>
        </div>
      </header>

      <section className="rd-panel flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex flex-none flex-wrap items-center justify-between gap-4 border-b border-rd-hair p-4">
          <div>
            <h2 className="text-lg font-semibold text-rd-title">Patient records</h2>
            <p className="mt-0.5 text-sm text-rd-muted">
              {loading ? "Loading records…" : filteredPatients.length === 0 ? "No matching patients" : `Showing ${rangeStart}–${rangeEnd} of ${filteredPatients.length}`}
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <div className="relative w-full sm:w-64">
              <span aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-rd-placeholder">
                <SearchIcon />
              </span>
              <input
                type="search"
                aria-label="Search patients"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or ID…"
                className="rd-input pl-11"
              />
            </div>

            <select
              aria-label="Sort patients"
              className="rd-input"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
            >
              <option value="recent">Recent visit</option>
              <option value="name">Name</option>
              <option value="visits">Most visits</option>
            </select>
          </div>
        </div>

        <div className="rd-scroll-thin min-h-0 flex-1 overflow-auto">
          {loading ? (
            <TableSkeleton rows={5} />
          ) : hasError ? (
            <EmptyState title="Could not load patients" hint="Something went wrong reaching the server. Refresh the page to try again." />
          ) : filteredPatients.length === 0 ? (
            <EmptyState title="No patients found" hint={search ? "No name or ID matches that search." : "Registered patients appear here."} />
          ) : (
            <table className="w-full min-w-[860px] border-collapse">
              <thead>
                <tr className="border-b border-rd-hair-strong bg-rd-sunken">
                  <th className={th}>Patient</th>
                  <th className={th}>ID</th>
                  <th className={th}>Age / Sex</th>
                  <th className={th}>Last visit</th>
                  <th className={th}>Visits</th>
                  <th className={`${th} text-right`}><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {pagedPatients.map((patient) => {
                  const lastVisit = visitDate(patient.lastvisited);
                  const visits = patient.visitcount ?? 0;

                  return (
                    <tr key={patient.patientid} className="border-b border-rd-hair transition-colors last:border-0 hover:bg-rd-raised">
                      <td className={td}>
                        <div className="flex items-center gap-3">
                          <Avatar name={patient.name} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate font-medium text-rd-title">{patient.name}</p>
                              {!lastVisit && <span className="rd-tint-amber flex-none rounded-full px-2 py-0.5 text-[11px] font-bold">New</span>}
                            </div>
                            {patient.address && <p className="truncate text-xs text-rd-muted">{patient.address}</p>}
                          </div>
                        </div>
                      </td>
                      <td className={td}>#{patient.patientid}</td>
                      <td className={td}>{patient.age ? `${patient.age} yrs` : "—"} / {patient.sex || "—"}</td>
                      <td className={td}>{lastVisit ? relativeLabel(lastVisit) : "No visit yet"}</td>
                      <td className={td}>{visits}</td>
                      <td className={`${td} text-right`}>
                        <Link href={`${basePath}/patients/${patient.patientid}`} className={rowAction}>
                          View
                          <ChevronRightIcon size={16} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filteredPatients.length > 0 && (
          <div className="flex items-center justify-between border-t border-rd-hair p-4 text-sm text-rd-muted">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1} className="rd-btn-secondary rd-press rd-focus disabled:opacity-50">
                Prev
              </button>
              <button type="button" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="rd-btn-secondary rd-press rd-focus disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
