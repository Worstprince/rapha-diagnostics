"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import ConfirmDialog from "@/components/ConfirmDialog";
import ThemeToggle from "@/components/ThemeToggle";
import {
  ActivityIcon,
  CalendarCheckIcon,
  ClipboardIcon,
  CloseIcon,
  GridIcon,
  MenuIcon,
  SignOutIcon,
  UserCogIcon,
  UserPlusIcon,
  UsersIcon,
} from "@/components/icons";
import { signOut, useCurrentUser } from "@/lib/session";
import { useTheme } from "@/lib/theme";

const overview = { href: "/dashboard", label: "Overview", Icon: GridIcon };

const adminSections = [
  {
    label: "General",
    links: [
      overview,
      { href: "/dashboard/admin/activityLog", label: "Activity Log", Icon: ActivityIcon },
    ],
  },
  {
    label: "User Management",
    links: [
      { href: "/dashboard/admin/viewUsers", label: "View Users", Icon: UsersIcon },
      { href: "/dashboard/admin/addUsers", label: "Add Users", Icon: UserPlusIcon },
      { href: "/dashboard/admin/editUsers", label: "Edit Users", Icon: UserCogIcon },
    ],
  },
];

const receptionSections = [
  { label: "General", links: [overview] },
  {
    label: "Patient",
    links: [
      { href: "/dashboard/reception/registration", label: "Registration", Icon: ClipboardIcon },
      { href: "/dashboard/reception/visitation", label: "Visitation", Icon: CalendarCheckIcon },
    ],
  },
];

const baseSections = [{ label: "General", links: [overview] }];

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

function Wordmark() {
  return (
    <div className="flex items-center gap-3">
      <BrandMark />
      <div className="leading-none">
        <p className="text-base font-extrabold tracking-tight text-rd-title">Rapha</p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-rd-muted">
          Diagnostics
        </p>
      </div>
    </div>
  );
}

const rowBase =
  "rd-press rd-focus relative flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium";
const rowIdle = "text-rd-label hover:bg-rd-raised hover:text-rd-title";
const rowActive =
  "border border-rd-hair-strong bg-rd-raised text-rd-cyan shadow-[var(--rd-lift)]";

/* `/dashboard` redirects to `/dashboard/admin`, so Overview has to answer to both.
   Prefix matching would light it up on every admin subpage instead. */
function isLinkActive(href, pathname) {
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/dashboard/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SectionNav({ sections, pathname, onNavigate }) {
  return (
    <nav aria-label="Dashboard navigation" className="space-y-6">
      {sections.map((section) => (
        <div key={section.label}>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-rd-muted">
            {section.label}
          </p>
          <ul className="mt-2 space-y-1">
            {section.links.map(({ href, label, Icon }) => {
              const active = isLinkActive(href, pathname);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    /* The active pill carries a border the idle row lacks, so it
                       also claims a transparent one — otherwise every row shifts
                       a pixel as the selection moves. */
                    className={`${rowBase} ${active ? rowActive : `border border-transparent ${rowIdle}`}`}
                  >
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute -left-px h-5 w-0.5 rounded-full bg-rd-cyan"
                      />
                    )}
                    <Icon />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function initialsOf(name) {
  if (!name) return "";
  return name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function UserFooter() {
  const router = useRouter();
  const user = useCurrentUser();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSignOut = () => {
    setConfirmOpen(false);
    signOut();
    router.push("/auth/login");
  };

  /* Null on the server and on the first client paint, so the block is skipped
     rather than flashing a guessed name. */
  if (!user) return null;

  return (
    <div className="mt-6 flex items-center gap-3 rounded-xl border border-rd-hair bg-rd-sunken p-2.5">
      <span
        aria-hidden="true"
        className="grid size-9 flex-none place-items-center rounded-full bg-rd-cyan/15 text-xs font-bold text-rd-cyan"
      >
        {initialsOf(user.username)}
      </span>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-semibold text-rd-title">{user.username}</p>
        <p className="truncate text-xs text-rd-muted">{user.role}</p>
      </div>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        aria-label="Sign out"
        title="Sign out"
        className="rd-press rd-focus ml-auto grid size-11 flex-none cursor-pointer place-items-center rounded-lg text-rd-muted hover:bg-rd-raised hover:text-rd-title"
      >
        <SignOutIcon />
      </button>

      <ConfirmDialog
        open={confirmOpen}
        tone="danger"
        title="Sign out?"
        description={`You'll be signed out of ${user.username} and returned to the login page.`}
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        onConfirm={handleSignOut}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  const isAdmin = pathname.startsWith("/dashboard/admin") || pathname === "/dashboard";
  const isReception = pathname.startsWith("/dashboard/reception");
  const sections = isAdmin ? adminSections : isReception ? receptionSections : baseSections;

  /* Links close the drawer themselves via onNavigate — watching pathname instead
     would miss a tap on the route you're already on. popstate covers the one exit
     a link can't: the browser back button. */
  useEffect(() => {
    if (!menuOpen) return;

    closeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onPopState = () => setMenuOpen(false);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("popstate", onPopState);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("popstate", onPopState);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <div className="min-h-dvh bg-rd-canvas text-rd-text">
      <div className="flex min-h-dvh flex-col lg:flex-row lg:gap-4 lg:p-4">
        {/* Flush bar on mobile; a floating panel once there's room to inset it. */}
        <aside className="border-b border-rd-hair bg-rd-card backdrop-blur-xl lg:sticky lg:top-4 lg:flex lg:h-[calc(100dvh-2rem)] lg:w-72 lg:flex-none lg:flex-col lg:rounded-2xl lg:border lg:shadow-[var(--rd-card-shadow)]">
          <div className="flex items-center justify-between gap-3 p-5 lg:p-4">
            <Wordmark />
            <div className="flex items-center gap-2">
              <ThemeToggle theme={theme} onToggle={toggle} />
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={menuOpen}
                aria-controls="dashboard-menu"
                className="rd-press rd-focus grid size-11 cursor-pointer place-items-center rounded-lg text-rd-label hover:bg-rd-raised hover:text-rd-title lg:hidden"
              >
                <MenuIcon />
              </button>
            </div>
          </div>

          <div className="hidden min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-4 pt-4 lg:flex">
            <SectionNav sections={sections} pathname={pathname} />
            <div className="mt-auto">
              <UserFooter />
            </div>
          </div>
        </aside>

        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="rd-scrim absolute inset-0 bg-black/50" onClick={closeMenu} aria-hidden="true" />
            <div
              id="dashboard-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Dashboard navigation"
              className="rd-drawer absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-rd-hair bg-rd-card backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-3 p-5">
                <Wordmark />
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeMenu}
                  aria-label="Close navigation menu"
                  className="rd-press rd-focus grid size-11 cursor-pointer place-items-center rounded-lg text-rd-label hover:bg-rd-raised hover:text-rd-title"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-5 pt-4">
                <SectionNav sections={sections} pathname={pathname} onNavigate={closeMenu} />
                <div className="mt-auto">
                  <UserFooter />
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 p-5 lg:p-4">{children}</main>
      </div>
    </div>
  );
}
