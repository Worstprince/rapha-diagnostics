"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/theme";

const patientLinks = [
  { href: "/dashboard/reception/registration", label: "Patient Registration" },
  { href: "/dashboard/reception/visitation", label: "Patient Visitation" },
];

const userManagementLinks = [
  { href: "/dashboard/admin/viewUsers", label: "View Users" },
  { href: "/dashboard/admin/addUsers", label: "Add Users" },
  { href: "/dashboard/admin/editUsers", label: "Edit Users" },
];

function BrandMark() {
  return (
    <svg viewBox="0 0 48 48" width="36" height="36" aria-hidden="true" className="flex-none">
      <defs>
        <linearGradient id="rd-nav-mk" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#67e8f9" />
          <stop offset="0.55" stopColor="#22b8e6" />
          <stop offset="1" stopColor="#2563c9" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#rd-nav-mk)" />
      <path
        d="M7 26 H15 L18 26 L21 15 L26 34 L29 23 L31 26 H41"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Chevron({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="transition-transform duration-200 ease-out"
      style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
    >
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

const navBase =
  "rd-press rd-focus flex items-center gap-2.5 rounded-xl border px-3 py-2 text-sm font-medium";
const navIdle =
  "border-rd-hair bg-rd-sunken text-rd-label hover:border-rd-hair-strong hover:text-rd-title";
const navActive = "border-rd-cyan/50 bg-rd-cyan/10 text-rd-cyan";

const subBase = "rd-press rd-focus block rounded-lg px-3 py-2 text-sm";
const subIdle = "text-rd-muted hover:bg-rd-raised hover:text-rd-title";
const subActive = "bg-rd-cyan/10 font-medium text-rd-cyan";

function NavGroup({ label, open, onToggle, id, links, pathname }) {
  return (
    <div className="rounded-xl border border-rd-hair bg-rd-sunken p-2">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
        className="rd-focus flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-rd-label transition-colors hover:bg-rd-raised hover:text-rd-title"
      >
        <span>{label}</span>
        <Chevron open={open} />
      </button>

      {open && (
        <div id={id} className="mt-1 space-y-0.5 px-1 pb-1">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`${subBase} ${isActive ? subActive : subIdle}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  const [patientOpen, setPatientOpen] = useState(
    pathname?.startsWith("/dashboard/reception") ?? false,
  );
  const [userManagementOpen, setUserManagementOpen] = useState(
    pathname?.startsWith("/dashboard/admin/") ?? false,
  );

  const isAdmin = pathname.startsWith("/dashboard/admin") || pathname === "/dashboard";
  const isReception = pathname.startsWith("/dashboard/reception");
  const isOverview = pathname === "/dashboard" || pathname === "/dashboard/admin";

  return (
    <div className="min-h-dvh bg-rd-canvas text-rd-text">
      <div className="flex min-h-dvh flex-col lg:flex-row">
        <aside className="border-b border-rd-hair bg-rd-card p-5 backdrop-blur-xl lg:w-72 lg:flex-none lg:border-b-0 lg:border-r lg:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <BrandMark />
              <div className="leading-none">
                <p className="text-base font-extrabold tracking-tight text-rd-title">Rapha</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-rd-muted">
                  Diagnostics
                </p>
              </div>
            </div>
            <ThemeToggle theme={theme} onToggle={toggle} />
          </div>

          <p className="mt-4 text-sm text-rd-muted">
            Focused workflow views for every department.
          </p>

          <nav aria-label="Dashboard navigation" className="mt-6 space-y-2">
            <Link
              href="/dashboard"
              aria-current={isOverview ? "page" : undefined}
              className={`${navBase} ${isOverview ? navActive : navIdle}`}
            >
              Overview
            </Link>

            {isAdmin && (
              <Link
                href="/dashboard/admin/activityLog"
                aria-current={pathname === "/dashboard/admin/activityLog" ? "page" : undefined}
                className={`${navBase} ${
                  pathname === "/dashboard/admin/activityLog" ? navActive : navIdle
                }`}
              >
                Activity Log
              </Link>
            )}

            {isAdmin && (
              <NavGroup
                label="User Management"
                id="admin-user-links"
                open={userManagementOpen}
                onToggle={() => setUserManagementOpen((v) => !v)}
                links={userManagementLinks}
                pathname={pathname}
              />
            )}

            {isReception && (
              <NavGroup
                label="Patient"
                id="reception-patient-links"
                open={patientOpen}
                onToggle={() => setPatientOpen((v) => !v)}
                links={patientLinks}
                pathname={pathname}
              />
            )}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
