"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {
    Avatar,
    CalendarCheckIcon,
    ChevronRightIcon,
    ClipboardIcon,
    PageHeader,
    toneBar,
} from "./_ui";

const intakeActions = [
    {
        title: "Patient registration",
        description: "Capture demographics and prepare intake documents for a new patient.",
        href: "/dashboard/reception/registration",
        Icon: ClipboardIcon,
        chip: "bg-cyan-500/12 text-cyan-600",
    },
    {
        title: "Patient visitation",
        description: "Register a visit, choose tests, and hand off to the laboratory.",
        href: "/dashboard/reception/visitation",
        Icon: CalendarCheckIcon,
        chip: "bg-emerald-500/12 text-emerald-600",
    },
];

function formatCurrency(value) {
    return `₱${Number(value || 0).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function buildRevenueTrend(rows = [], range = "month") {
    const totals = new Map();

    rows.forEach((row) => {
        if (!row?.visitDate) return;

        const date = new Date(row.visitDate);
        if (Number.isNaN(date.getTime())) return;

        const value = Number(row.totalCost ?? row.amount ?? 0);
        let key;
        let label;

        if (range === "week") {
            const day = date.getDay();
            const diffToMonday = (day + 6) % 7;
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - diffToMonday);
            weekStart.setHours(0, 0, 0, 0);

            key = weekStart.toISOString().slice(0, 10);
            label = new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric" }).format(weekStart);
        } else if (range === "year") {
            key = String(date.getFullYear());
            label = String(date.getFullYear());
        } else {
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            label = new Intl.DateTimeFormat("en-PH", { month: "short", year: "numeric" }).format(date);
        }

        const current = totals.get(key) ?? { key, label, value: 0 };
        current.value += value;
        totals.set(key, current);
    });

    return Array.from(totals.values())
        .sort((a, b) => a.key.localeCompare(b.key))
        .map((entry) => ({
            ...entry,
            value: Number(entry.value || 0),
            displayLabel: entry.label,
        }));
}

function getQueueTone(status) {
    const normalized = String(status ?? "").trim().toLowerCase();

    if (["approved", "complete", "released", "done", "ready"].includes(normalized)) {
        return "ok";
    }

    if (["pending", "in progress", "in-progress", "processing", "waiting"].includes(normalized)) {
        return "warn";
    }

    if (["cancelled", "rejected", "void"].includes(normalized)) {
        return "danger";
    }

    return "info";
}

export default function ReceptionDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        visitsToday: 0,
        pendingVisits: 0,
        patients: 0,
    });
    const [billingRows, setBillingRows] = useState([]);
    const [revenueRange, setRevenueRange] = useState("month");
    const [queueItems, setQueueItems] = useState([]);
    const revenueTrend = useMemo(() => buildRevenueTrend(billingRows, revenueRange), [billingRows, revenueRange]);
    const currentRevenue = useMemo(() => revenueTrend[revenueTrend.length - 1]?.value ?? 0, [revenueTrend]);

    useEffect(() => {
        let cancelled = false;

        async function fetchDashboardData() {
            setLoading(true);

            try {
                const [billingRes, patientsRes] = await Promise.all([
                    fetch("/api/billing?limit=200&sort=newest"),
                    fetch("/api/patients/search"),
                ]);

                if (cancelled) return;

                const parseSafe = async (res) => {
                    if (!res.ok) return null;
                    const text = await res.text();
                    if (!text) return null;

                    try {
                        return JSON.parse(text);
                    } catch {
                        return null;
                    }
                };

                const [billingData, patientsData] = await Promise.all([
                    parseSafe(billingRes),
                    parseSafe(patientsRes),
                ]);

                if (cancelled) return;

                const rows = Array.isArray(billingData?.rows) ? billingData.rows : [];
                const today = new Date();

                const queue = rows
                    .slice(0, 5)
                    .map((item) => ({
                        name: item.patientName || "Unknown patient",
                        note: item.tests || item.status || "Pending review",
                        tone: getQueueTone(item.status),
                    }));

                setStats({
                    visitsToday: rows.filter((row) => {
                        if (!row.visitDate) return false;
                        const rowDate = new Date(row.visitDate);
                        return rowDate.toDateString() === today.toDateString();
                    }).length,
                    pendingVisits: rows.filter((row) => {
                        const status = String(row.status ?? "").trim().toLowerCase();
                        return ["pending", "in progress", "in-progress", "processing", "waiting"].includes(status);
                    }).length,
                    patients: Array.isArray(patientsData?.patients)
                        ? patientsData.patients.length
                        : Array.isArray(patientsData)
                            ? patientsData.length
                            : Number(patientsData?.total || 0),
                });

                setBillingRows(rows);
                setQueueItems(queue);
            } catch (error) {
                console.error("Failed to load reception dashboard:", error);
                if (!cancelled) {
                    setStats({ visitsToday: 0, pendingVisits: 0, patients: 0 });
                    setBillingRows([]);
                    setQueueItems([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchDashboardData();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="mx-auto max-w-5xl space-y-5">
            <PageHeader
                title="Patient intake workspace"
                description="Keep patient registration and visitation workflows organised from one compact view."
            />

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    title={`${revenueRange.charAt(0).toUpperCase()}${revenueRange.slice(1)} revenue`}
                    value={currentRevenue}
                    format={formatCurrency}
                    hint={revenueTrend.length ? `Current: ${revenueTrend[revenueTrend.length - 1]?.displayLabel ?? "latest period"}` : "Collected so far"}
                    accent="bg-emerald-500/12 text-emerald-600"
                    loading={loading}
                />
                <MetricCard
                    title="Visits today"
                    value={stats.visitsToday}
                    hint="Recorded in queue"
                    accent="bg-cyan-500/12 text-cyan-600"
                    loading={loading}
                />
                <MetricCard
                    title="Pending"
                    value={stats.pendingVisits}
                    hint="Awaiting action"
                    accent="bg-amber-500/12 text-amber-600"
                    loading={loading}
                />
                <MetricCard
                    title="Patients"
                    value={stats.patients}
                    hint="Registered in system"
                    accent="bg-violet-500/12 text-violet-600"
                    loading={loading}
                />
            </section>

            <section className="rd-panel overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rd-hair p-4">
                    <div>
                        <h2 className="text-lg font-semibold text-rd-title">Revenue trend</h2>
                        <p className="mt-0.5 text-sm text-rd-muted">
                            {revenueRange === "week" ? "Weekly collections across recent visit activity." : revenueRange === "year" ? "Yearly collections across recent visit activity." : "Monthly collections across recent visit activity."}
                        </p>
                    </div>

                    <div className="inline-flex rounded-xl border border-rd-hair bg-rd-raised p-1 text-xs font-medium text-rd-muted">
                        {[
                            { key: "week", label: "Weekly" },
                            { key: "month", label: "Monthly" },
                            { key: "year", label: "Yearly" },
                        ].map((option) => (
                            <button
                                key={option.key}
                                type="button"
                                onClick={() => setRevenueRange(option.key)}
                                className={`rounded-lg px-2.5 py-1.5 transition-colors ${
                                    revenueRange === option.key
                                        ? "bg-rd-cyan/15 text-rd-cyan"
                                        : "hover:text-rd-title"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-56 p-4">
                    {loading ? (
                        <div className="grid h-full place-items-center text-sm text-rd-muted">
                            Loading revenue trend…
                        </div>
                    ) : revenueTrend.length === 0 ? (
                        <div className="grid h-full place-items-center text-sm text-rd-muted">
                            No billing records available yet.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueTrend} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="revenueTrendFill" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                                        <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.04} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="rgba(148,163,184,0.18)" vertical={false} />
                                <XAxis
                                    dataKey="displayLabel"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: "#88a0be", fontSize: 12 }}
                                    minTickGap={14}
                                />
                                <YAxis
                                    tickFormatter={(value) => `₱${Number(value).toLocaleString("en-PH", { maximumFractionDigits: 0 })}`}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: "#88a0be", fontSize: 12 }}
                                    width={64}
                                />
                                <Tooltip
                                    formatter={(value) => [formatCurrency(value), "Revenue"]}
                                    contentStyle={{
                                        backgroundColor: "var(--rd-card)",
                                        border: "1px solid var(--rd-hair-strong)",
                                        borderRadius: 12,
                                        color: "var(--rd-title)",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#22d3ee"
                                    strokeWidth={2.5}
                                    fill="url(#revenueTrendFill)"
                                    activeDot={{ r: 5, strokeWidth: 0, fill: "#22d3ee" }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
                {intakeActions.map(({ title, description, href, Icon, chip }) => (
                    <Link
                        key={title}
                        href={href}
                        className="rd-panel rd-press rd-focus group flex flex-col p-5 transition-colors hover:border-rd-cyan/40"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <span className={`grid size-10 flex-none place-items-center rounded-xl ${chip}`}>
                                <Icon size={20} />
                            </span>

                            <ChevronRightIcon
                                size={18}
                                className="text-rd-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-rd-cyan motion-reduce:transition-none"
                            />
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-rd-title">{title}</h2>
                        <p className="mt-1 text-sm text-rd-muted">{description}</p>
                    </Link>
                ))}
            </section>

            <section className="rd-panel overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rd-hair p-4">
                    <div>
                        <h2 className="text-lg font-semibold text-rd-title">Today’s queue</h2>
                        <p className="mt-0.5 text-sm text-rd-muted">
                            Front-desk items waiting on an action.
                        </p>
                    </div>

                    <span className="text-sm text-rd-muted">
                        {queueItems.length} {queueItems.length === 1 ? "item" : "items"}
                    </span>
                </div>

                <ul className="space-y-3 p-4">
                    {loading ? (
                        <li className="rounded-xl border border-rd-hair bg-rd-sunken p-4 text-sm text-rd-muted">
                            Loading queue…
                        </li>
                    ) : queueItems.length === 0 ? (
                        <li className="rounded-xl border border-rd-hair bg-rd-sunken p-4 text-sm text-rd-muted">
                            No queue items found for the current records.
                        </li>
                    ) : (
                        queueItems.map((item) => (
                            <li
                                key={`${item.name}-${item.note}`}
                                className="relative flex flex-wrap items-center gap-x-4 gap-y-2 overflow-hidden rounded-xl border border-rd-hair bg-rd-sunken py-4 pl-6 pr-4 transition-colors hover:border-rd-hair-strong hover:bg-rd-raised"
                            >
                                <span
                                    aria-hidden="true"
                                    className={`absolute inset-y-0 left-0 w-1 ${toneBar[item.tone]}`}
                                />

                                <Avatar name={item.name} className="size-10 text-sm" />

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[15px] font-semibold text-rd-title">{item.name}</p>
                                    <p className="mt-0.5 truncate text-sm text-rd-muted">{item.note}</p>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </section>
        </div>
    );
}

function MetricCard({ title, value, hint, accent, loading, format }) {
    const display = format ? format(value) : Number(value || 0).toLocaleString();

    return (
        <article className="rd-panel p-5">
            <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-rd-label">{title}</p>
                <span className={`grid size-10 flex-none place-items-center rounded-xl ${accent}`}>
                    <span className="text-lg font-semibold text-current">
                        {title.charAt(0)}
                    </span>
                </span>
            </div>

            <p className="mt-4 text-3xl font-bold tabular-nums tracking-tight text-rd-title">
                {loading ? "—" : display}
            </p>
            <p className="mt-1 text-sm text-rd-muted">{hint}</p>
        </article>
    );
}
