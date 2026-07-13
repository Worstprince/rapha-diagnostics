"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const patientLinks = [
  { href: "/dashboard/reception/registration", label: "Patient Registration" },
  { href: "/dashboard/reception/visitation", label: "Patient Visitation" },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [patientOpen, setPatientOpen] = useState(pathname?.startsWith("/dashboard/reception") ?? false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-800 bg-slate-900/90 p-6 lg:w-72 lg:border-b-0 lg:border-r lg:p-8">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">RAPHA</p>
              <h1 className="mt-2 text-lg font-semibold text-white">Diagnostic Dashboard</h1>
              <p className="mt-1 text-sm text-slate-400">Focused workflow views for every department.</p>
            </div>

            <nav aria-label="Dashboard navigation" className="space-y-2">
              <Link
                href="/dashboard"
                className={`flex items-center rounded-xl border px-3 py-2 text-sm font-medium transition ${
                  pathname === "/dashboard"
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                    : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-cyan-500 hover:text-white"
                }`}
              >
                Overview
              </Link>

              {pathname.startsWith("/dashboard/admin") && (
                <Link
                  href="/dashboard/admin/activityLog"
                  className={`flex items-center rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    pathname === "/dashboard/admin/activityLog"
                      ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                      : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-cyan-500 hover:text-white"
                  }`}
                >
                  Activity Log
                </Link>
              )}

              {pathname.startsWith("/dashboard/admin") && (
                <Link
                  href="/dashboard/admin/userManagement"
                  className={`flex items-center rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    pathname === "/dashboard/admin/userManagement"
                      ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                      : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-cyan-500 hover:text-white"
                  }`}
                >
                  User Management
                </Link>
              )}

              {pathname.startsWith("/dashboard/reception") && (
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2">
                  <button
                    type="button"
                    aria-expanded={patientOpen}
                    aria-controls="reception-patient-links"
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-800/70 hover:text-white"
                    onClick={() => setPatientOpen((value) => !value)}
                  >
                    <span>Patient</span>
                    <span className="text-xs text-slate-500">{patientOpen ? "▾" : "▸"}</span>
                  </button>

                  {patientOpen && (
                    <div id="reception-patient-links" className="mt-2 space-y-1 px-2 pb-1">
                      {patientLinks.map((link) => {
                        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center rounded-lg px-3 py-2 text-sm transition ${
                              isActive
                                ? "bg-cyan-500/10 text-cyan-300"
                                : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                            }`}
                          >
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
