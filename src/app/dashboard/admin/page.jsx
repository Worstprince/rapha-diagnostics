"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { ActivityIcon, UserPlusIcon } from "@/components/icons";
import { useCurrentUser } from "@/lib/session";

import {
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  FlaskIcon,
  HeaderGlow,
  InboxIcon,
  InfoIcon,
  UsersIcon,
  WalletIcon,
  WarningIcon,
  XCircleIcon,
} from "./_ui";

function getGreeting(hour) {
  if (hour < 5) return "Working late";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Working late";
}

function formatRelativeTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const diffMin = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

function formatCurrency(value) {
  return `₱${Number(value || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/* Animates from the previously displayed value toward the next one; skips
   straight to the target under prefers-reduced-motion. */
function useCountUp(value, duration = 700) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const target = Number(value) || 0;
    const from = fromRef.current;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || from === target) {
      fromRef.current = target;
      setDisplay(target);
      return;
    }

    let raf;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      // Round to cents, not whole numbers — currency values must land on the
      // exact target instead of losing precision to an integer snap.
      setDisplay(Math.round((from + (target - from) * eased) * 100) / 100);

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return display;
}

const quickActions = [
  {
    href: "/dashboard/admin/addUsers",
    label: "Add a user",
    hint: "Create a new staff account",
    Icon: UserPlusIcon,
  },
  {
    href: "/dashboard/admin/viewUsers",
    label: "Manage users",
    hint: "Edit roles and access",
    Icon: UsersIcon,
  },
  {
    href: "/dashboard/admin/activityLog",
    label: "Activity log",
    hint: "Review recent system activity",
    Icon: ActivityIcon,
  },
];

export default function AdminDashboardPage() {
  const user = useCurrentUser();
  const [now, setNow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    patients: 0,
    pendingTests: 0,
    revenue: 0,
  });
  const [alerts, setAlerts] = useState([]);

  /* Clock text is time-of-day dependent, so it starts null and fills in on the
     client only — matching the sidebar's user footer, this avoids a
     server/client render mismatch. */
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboardData() {
      setLoading(true);
      try {
        const [patientsRes, testsRes, billingRes, activityRes] = await Promise.all([
          fetch("/api/patients"),
          fetch("/api/doctor/patients?search="),
          fetch("/api/billing"),
          fetch("/api/activityLog?limit=5&sortDate=newest"),
        ]);

        if (cancelled) return;

        // Safely parse JSON, handle empty/failed responses
        const parseSafe = async (res) => {
          if (!res.ok) return null;
          const text = await res.text();
          if (!text) return null;
          try { return JSON.parse(text); } catch { return null; }
        };

        const [patientsData, testsData, billingData, activityData] = await Promise.all([
          parseSafe(patientsRes),
          parseSafe(testsRes),
          parseSafe(billingRes),
          parseSafe(activityRes),
        ]);

        if (!cancelled) {
          setStats({
            patients: Array.isArray(patientsData) ? patientsData.length : (patientsData?.total ?? 0),
            pendingTests: Array.isArray(testsData?.rows) ? testsData.rows.filter((v) => v.status === "pending").length : 0,
            revenue: billingData?.totalRevenue ?? billingData?.revenue ?? 0,
          });
          setAlerts(activityData?.rows ?? []);
        }
      } catch (error) {
        console.error("Failed to load admin dashboard:", error);
        if (!cancelled) {
          setStats({ patients: 0, pendingTests: 0, revenue: 0 });
          setAlerts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, []);

  const dateLabel = now?.toLocaleDateString("en-PH", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const timeLabel = now?.toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" });
  const greeting = now ? getGreeting(now.getHours()) : null;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">
      <header className="rd-panel rd-rise-in relative flex-none overflow-hidden p-6">
        <HeaderGlow />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">
              Admin
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">
              {user && greeting ? `${greeting}, ${user.username}.` : "Operations overview"}
            </h1>
            <p className="mt-2 text-sm text-rd-muted">
              Monitor system health, staffing, and financial performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {now && (
              <div className="flex items-center gap-2 rounded-xl border border-rd-hair bg-rd-sunken px-3.5 py-2.5 text-sm text-rd-label">
                <ClockIcon size={16} className="text-rd-cyan" />
                <span className="tabular-nums">{timeLabel}</span>
                <span className="text-rd-hair-strong" aria-hidden="true">·</span>
                <span>{dateLabel}</span>
              </div>
            )}
            <Link href="/dashboard/admin/addUsers" className="rd-btn rd-press rd-focus">
              Add User
              <ChevronRightIcon />
            </Link>
          </div>
        </div>
      </header>

      {/* STATS GRID */}
      <section className="grid flex-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Patients"
          value={stats.patients}
          hint="Registered in system"
          Icon={UsersIcon}
          chip="bg-cyan-500/12 text-cyan-600"
          loading={loading}
          delay={40}
        />
        <StatCard
          title="Tests Awaiting Review"
          value={stats.pendingTests}
          hint="Across all departments"
          Icon={FlaskIcon}
          chip="bg-amber-500/12 text-amber-600"
          loading={loading}
          delay={80}
        />
        <StatCard
          title="Monthly Revenue"
          value={stats.revenue}
          format={formatCurrency}
          hint="Billing collected"
          Icon={WalletIcon}
          chip="bg-emerald-500/12 text-emerald-600"
          loading={loading}
          delay={120}
        />
      </section>

      {/* ALERTS + QUICK ACTIONS */}
      <section className="grid min-h-0 flex-1 gap-5 lg:grid-cols-3">
        <div className="rd-panel rd-rise-in flex min-h-0 flex-col overflow-hidden max-lg:max-h-[70vh] lg:col-span-2" style={{ animationDelay: "160ms" }}>
          <div className="flex flex-none flex-wrap items-center justify-between gap-3 border-b border-rd-hair p-4">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-semibold text-rd-title">Recent system alerts</h2>
              {!loading && alerts.length > 0 && (
                <span className="grid min-w-6 place-items-center rounded-full border border-rd-cyan/50 bg-rd-cyan/14 px-1.5 py-0.5 text-xs font-bold tabular-nums text-rd-title">
                  {alerts.length}
                </span>
              )}
            </div>
            <Link href="/dashboard/admin/activityLog" className="rd-focus rounded-lg text-sm font-medium text-rd-cyan hover:underline">
              View all
            </Link>
          </div>

          <div className="rd-scroll-thin min-h-0 flex-1 overflow-y-auto">
            {loading ? (
              <TableSkeleton rows={3} />
            ) : alerts.length === 0 ? (
              <EmptyState
                title="No recent alerts"
                hint="System alerts appear here as staff use the system."
                Icon={InboxIcon}
              />
            ) : (
              <ul className="space-y-3 p-4">
                {alerts.map((alert) => (
                  <AlertItem key={alert.id} alert={alert} />
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rd-panel rd-rise-in flex min-h-0 flex-col overflow-hidden" style={{ animationDelay: "200ms" }}>
          <div className="flex-none border-b border-rd-hair p-4">
            <h2 className="text-lg font-semibold text-rd-title">Quick actions</h2>
          </div>

          <nav aria-label="Quick actions" className="rd-scroll-thin min-h-0 flex-1 overflow-y-auto p-3">
            <ul className="space-y-2">
              {quickActions.map(({ href, label, hint, Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="rd-press rd-focus flex items-center gap-3 rounded-xl border border-transparent p-3 hover:border-rd-hair-strong hover:bg-rd-raised"
                  >
                    <span className="grid size-10 flex-none place-items-center rounded-xl bg-rd-cyan/12 text-rd-cyan">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-rd-title">{label}</span>
                      <span className="block truncate text-xs text-rd-muted">{hint}</span>
                    </span>
                    <ChevronRightIcon size={16} className="flex-none text-rd-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </div>
  );
}

/* ===== INLINE COMPONENTS (will move to _ui.jsx in next chunk) ===== */

function StatCard({ title, value, hint, Icon, chip, loading, format, delay = 0 }) {
  const display = useCountUp(value);
  const formatted = format ? format(display) : display.toLocaleString();

  return (
    <article className="rd-panel rd-rise-in p-5" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-rd-label">{title}</p>
        <span className={`grid size-10 flex-none place-items-center rounded-xl ${chip}`}>
          <Icon size={20} />
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold tabular-nums tracking-tight text-rd-title">
        {loading ? "—" : formatted}
      </p>
      <p className="mt-1 text-sm text-rd-muted">{hint}</p>
    </article>
  );
}

const ALERT_TONES = {
  warn: { ring: "border-amber-500/40", bg: "bg-amber-500/10", ink: "text-amber-500", Icon: WarningIcon },
  info: { ring: "border-rd-hair-strong", bg: "bg-rd-sunken", ink: "text-cyan-500", Icon: InfoIcon },
  error: { ring: "border-red-500/40", bg: "bg-red-500/10", ink: "text-red-500", Icon: XCircleIcon },
  success: { ring: "border-emerald-500/40", bg: "bg-emerald-500/10", ink: "text-emerald-500", Icon: CheckCircleIcon },
};

function AlertItem({ alert }) {
  const tone = ALERT_TONES[alert.tone] ?? ALERT_TONES.info;
  const Glyph = tone.Icon;

  return (
    <li className={`flex items-start gap-3 rounded-xl border p-3.5 text-sm transition-colors hover:border-rd-hair-strong hover:bg-rd-raised ${tone.ring} ${tone.bg}`}>
      <span aria-hidden="true" className={`mt-0.5 grid size-8 flex-none place-items-center rounded-lg bg-rd-card ${tone.ink}`}>
        <Glyph size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-rd-label">{alert.text ?? alert.description ?? alert.message}</p>
        <p className="mt-1.5 text-xs text-rd-muted">
          {formatRelativeTime(alert.datetime ?? alert.createdAt)}
        </p>
      </div>
    </li>
  );
}

/* Temporary inline - will move to _ui.jsx */
function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-12 animate-pulse rounded-xl bg-rd-raised motion-reduce:animate-none" />
      ))}
    </div>
  );
}

function EmptyState({ title, hint, Icon: Glyph = FlaskIcon }) {
  return (
    <div className="px-4 py-14 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-rd-hair bg-rd-sunken text-rd-muted">
        <Glyph size={22} />
      </span>
      <p className="mt-4 text-sm font-semibold text-rd-title">{title}</p>
      {hint && <p className="mt-1 text-sm text-rd-muted">{hint}</p>}
    </div>
  );
}
