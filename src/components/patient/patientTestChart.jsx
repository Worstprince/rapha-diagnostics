"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { useTheme } from "@/lib/theme";
import { EmptyState, FlaskIcon } from "@/app/dashboard/doctor/_ui";

const FALLBACK = {
    accent: "#22d3ee",
    grid: "rgba(148, 163, 184, 0.16)",
    muted: "#93a4bb",
};

function readPalette() {
    if (typeof window === "undefined") return FALLBACK;

    const style = getComputedStyle(document.documentElement);
    const read = (name, fallback) =>
        style.getPropertyValue(name).trim() || fallback;

    return {
        accent: read("--rd-cyan", FALLBACK.accent),
        grid: read("--rd-hair-strong", FALLBACK.grid),
        muted: read("--rd-muted", FALLBACK.muted),
    };
}

function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-xl border border-rd-hair-strong bg-rd-popover px-3 py-2 shadow-[var(--rd-lift)]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                {label}
            </p>
            <p className="mt-0.5 text-sm font-bold tabular-nums text-rd-title">
                {payload[0].value}
            </p>
        </div>
    );
}

function Stat({ label, value, tone = "text-rd-title" }) {
    return (
        <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                {label}
            </p>
            <p className={`mt-1 truncate text-sm font-bold tabular-nums ${tone}`}>
                {value}
            </p>
        </div>
    );
}

function TrendBadge({ delta }) {
    if (delta === null) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rd-hair-strong bg-rd-raised px-2.5 py-1 text-xs font-medium text-rd-label">
                First reading
            </span>
        );
    }

    const flat = delta === 0;
    const up = delta > 0;

    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rd-hair-strong bg-rd-raised px-2.5 py-1 text-xs font-medium tabular-nums text-rd-title">
            <svg
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={flat || up ? "" : "rotate-180"}
            >
                {flat ? <path d="M5 12h14" /> : <path d="M12 19V5m0 0-6 6m6-6 6 6" />}
            </svg>
            {flat ? "No change" : `${up ? "+" : ""}${delta}`}
        </span>
    );
}

const formatTick = (value) =>
    typeof value === "number" ? value.toLocaleString() : value;

export default function PatientTestChart({ data = [], title, subtitle }) {

    const { theme } = useTheme();
    const [palette, setPalette] = useState(FALLBACK);
    const gradientId = useId();

    useEffect(() => {
        setPalette(readPalette());
    }, [theme]);

    const summary = useMemo(() => {
        if (data.length === 0) return null;

        const values = data.map((row) => row.value);
        const latest = values[values.length - 1];
        const previous = values.length > 1 ? values[values.length - 2] : null;

        const round = (n) => Math.round(n * 100) / 100;

        return {
            latest: round(latest),
            delta: previous === null ? null : round(latest - previous),
            min: round(Math.min(...values)),
            max: round(Math.max(...values)),
            average: round(values.reduce((sum, n) => sum + n, 0) / values.length),
            first: data[0].date,
            last: data[data.length - 1].date,
        };
    }, [data]);

    return (
        <section className="rd-panel overflow-hidden">

            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-rd-hair p-4">

                <div className="min-w-0">

                    <h2 className="text-lg font-semibold text-rd-title">{title}</h2>

                    <p className="mt-1 text-sm text-rd-muted">
                        {!summary
                            ? (subtitle ?? "No readings recorded")
                            : data.length === 1
                              ? `1 reading · ${summary.first}`
                              : `${data.length} readings · ${summary.first} → ${summary.last}`}
                    </p>

                </div>

                {summary && (
                    <div className="flex flex-none items-center gap-3">
                        <div className="text-right">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                                Latest
                            </p>
                            <p className="text-2xl font-bold tabular-nums leading-tight text-rd-title">
                                {summary.latest}
                            </p>
                        </div>
                        <TrendBadge delta={summary.delta} />
                    </div>
                )}

            </div>

            {data.length === 0 ? (

                <EmptyState
                    title="No historical data"
                    hint="Results for this value appear here once they are recorded."
                    Icon={FlaskIcon}
                />

            ) : (

                <>

                    <div
                        role="img"
                        aria-label={`Line chart of ${title} over ${data.length} readings`}
                        className="h-72 px-2 pt-5 sm:h-80"
                    >

                        <p className="sr-only">
                            Line chart of {title}. {data.length} readings from{" "}
                            {summary.first} to {summary.last}. Latest {summary.latest},
                            lowest {summary.min}, highest {summary.max}, average{" "}
                            {summary.average}.
                        </p>

                        <ResponsiveContainer width="100%" height="100%">

                            <AreaChart
                                data={data}
                                margin={{ top: 4, right: 16, bottom: 4, left: 4 }}
                            >

                                <defs>
                                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={palette.accent} stopOpacity={0.28} />
                                        <stop offset="100%" stopColor={palette.accent} stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    stroke={palette.grid}
                                    strokeDasharray="4 4"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="date"
                                    stroke={palette.grid}
                                    tick={{ fill: palette.muted, fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={10}
                                    minTickGap={24}
                                />

                                <YAxis
                                    stroke={palette.grid}
                                    tick={{ fill: palette.muted, fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    width={52}
                                    tickFormatter={formatTick}
                                    domain={["auto", "auto"]}
                                    padding={{ top: 16, bottom: 8 }}
                                />

                                <Tooltip
                                    content={<ChartTooltip />}
                                    cursor={{ stroke: palette.accent, strokeWidth: 1, strokeDasharray: "4 4" }}
                                />

                                {data.length > 1 && (
                                    <ReferenceLine
                                        y={summary.average}
                                        stroke={palette.muted}
                                        strokeDasharray="2 6"
                                        strokeOpacity={0.7}
                                        label={{
                                            value: `avg ${summary.average}`,
                                            position: "right",
                                            fill: palette.muted,
                                            fontSize: 11,
                                        }}
                                    />
                                )}

                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={palette.accent}
                                    strokeWidth={2.5}
                                    fill={`url(#${gradientId})`}
                                    dot={{ r: 3, fill: palette.accent, strokeWidth: 0 }}
                                    activeDot={{ r: 5, strokeWidth: 2 }}
                                    isAnimationActive={false}
                                />

                            </AreaChart>

                        </ResponsiveContainer>

                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-rd-hair p-4 sm:grid-cols-4">
                        <Stat label="Latest" value={summary.latest} />
                        <Stat label="Average" value={summary.average} />
                        <Stat label="Lowest" value={summary.min} />
                        <Stat label="Highest" value={summary.max} />
                    </div>

                    <p className="border-t border-rd-hair px-4 py-3 text-[11px] text-rd-muted">
                        Vertical axis is scaled to the observed range, not to zero.
                    </p>

                </>

            )}

        </section>
    );
}
