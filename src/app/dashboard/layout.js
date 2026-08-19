"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NotebookPen as NotebookPenIcon } from "lucide-react";

import AccountMenu from "@/components/AccountMenu";
import AnimatedMark from "@/components/BrandMark";
import { useCurrentUser } from "@/lib/session";
import {
  ActivityIcon,
  CalendarCheckIcon,
  ClipboardIcon,
  CloseIcon,
  GridIcon,
  MenuIcon,
  UserPlusIcon,
  UsersIcon,
} from "@/components/icons";

const ROLE_HOMES = {
  admin: "/dashboard/admin",
  reception: "/dashboard/reception",
  doctor: "/dashboard/doctor",
  medtech: "/dashboard/medtech",
};

/* Which dashboards front the drawn mark rather than the flat nav tile. */
const ANIMATED_MARK_HOMES = [ROLE_HOMES.admin, ROLE_HOMES.doctor];

function overviewLink(href) {
  return { href, label: "Overview", Icon: GridIcon };
}

const adminSections = [
  {
    label: "General",
    links: [
      overviewLink(ROLE_HOMES.admin),
      { href: "/dashboard/admin/activityLog", label: "Activity Log", Icon: ActivityIcon },
    ],
  },
  {
    label: "User Management",
    links: [
      { href: "/dashboard/admin/viewUsers", label: "View Users", Icon: UsersIcon },
      { href: "/dashboard/admin/addUsers", label: "Add Users", Icon: UserPlusIcon },
    ],
  },
];

const receptionSections = [
  { label: "General", links: [overviewLink(ROLE_HOMES.reception)] },
  {
    label: "Patient",
    links: [
      { href: "/dashboard/reception/registration", label: "Registration", Icon: ClipboardIcon },
      { href: "/dashboard/reception/visitation", label: "Visitation", Icon: CalendarCheckIcon },
      { href: "/dashboard/reception/billing", label: "Billing History", Icon: CalendarCheckIcon },
    ],
  },
];

const doctorSections = [
  { label: "General", links: [overviewLink(ROLE_HOMES.doctor)] },
  {
    label: "Patient List",
    links: [
            {
        href: "/dashboard/doctor/patients",
        label: "View Patients",
        Icon: UsersIcon,
      },
      {
        href: "/dashboard/doctor/visitation",
        label: "View Visitations",
        Icon: CalendarCheckIcon,
      },
      {
        href: "/dashboard/doctor/visitation/history",
        label: "View Visitation History",
        Icon: CalendarCheckIcon,
      },
      {
        href: "/dashboard/doctor/notes",
        label: "Diagnostic Notes",
        Icon: NotebookPenIcon,
      },
    ],
  },
];

const medtechSections = [
  { label: "General", links: [overviewLink(ROLE_HOMES.medtech)] },
  {
    label: "Laboratory",
    links: [
      { href: "/dashboard/medtech/assignments", label: "Assignments", Icon: ClipboardIcon },            
      {
        href: "/dashboard/medtech/patients",
        label: "View Patients",
        Icon: UsersIcon,
      },
      {
        href: "/dashboard/medtech/visitation",
        label: "View Visitations",
        Icon: CalendarCheckIcon,
      },
      {
        href: "/dashboard/medtech/visitation/history",
        label: "View Visitation History",
        Icon: CalendarCheckIcon,
      },
    ],
  },
];

const baseSections = [];

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

/* The nav tile is the mark by default; the sections listed in
   ANIMATED_MARK_HOMES get the drawn version with its orbiting trails instead.
   Scoped to the section rather than a single page so the lockup does not swap
   out from under someone who clicks into a sub-page. */
function Wordmark({ animated = false }) {
  return (
    <div className="flex items-center gap-3">
      {animated ? <AnimatedMark size={44} className="rd-mark -my-1" /> : <BrandMark />}
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

const roleHomes = Object.values(ROLE_HOMES);

function isLinkActive(href, pathname, siblingHrefs = []) {
  if (roleHomes.includes(href)) {
    return pathname === href || (href === ROLE_HOMES.admin && pathname === "/dashboard");
  }
  if (href === "/dashboard/admin/viewUsers" && pathname.startsWith("/dashboard/admin/editUsers")) {
    return true;
  }
  if (pathname === href) {
    return true;
  }
  if (!pathname.startsWith(`${href}/`)) {
    return false;
  }
  /* A nested route like /visitation/history matches its parent's prefix too, so
     the parent only claims a child path when no longer link owns it — otherwise
     both rows light up at once. */
  return !siblingHrefs.some(
    (other) =>
      other.length > href.length &&
      (pathname === other || pathname.startsWith(`${other}/`)),
  );
}

function SectionNav({ sections, pathname, onNavigate }) {
  const siblingHrefs = sections.flatMap((section) =>
    section.links.map((link) => link.href),
  );

  return (
    <nav aria-label="Dashboard navigation" className="space-y-6">
      {sections.map((section) => (
        <div key={section.label}>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-rd-muted">
            {section.label}
          </p>
          <ul className="mt-2 space-y-1">
            {section.links.map(({ href, label, Icon }) => {
              const active = isLinkActive(href, pathname, siblingHrefs);
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

const normalizeRole = (value) => String(value ?? "").trim().toLowerCase();

const ROLE_ACCESS = {
  administrator: ["/dashboard/admin"],
  receptionist: ["/dashboard/reception"],
  "medical technologist": ["/dashboard/medtech"],
  pathologist: ["/dashboard/doctor"],
  physician: ["/dashboard/doctor"],
  doctor: ["/dashboard/doctor"],
};

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const showAnimatedMark = ANIMATED_MARK_HOMES.some(
    (home) => pathname === home || pathname.startsWith(`${home}/`),
  );
  const router = useRouter();
  const user = useCurrentUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!user?.role || !pathname.startsWith("/dashboard") || pathname === "/dashboard/access-denied") return;

    const roleKey = normalizeRole(user.role);
    const allowedPaths = ROLE_ACCESS[roleKey] ?? [];
    const isAllowed = allowedPaths.some(
      (allowedPath) => pathname === allowedPath || pathname.startsWith(`${allowedPath}/`),
    );

    if (!isAllowed) {
      router.replace("/dashboard/access-denied");
    }
  }, [user, pathname, router]);

  const sections = pathname.startsWith("/dashboard/admin") || pathname === "/dashboard"
    ? adminSections
    : pathname.startsWith("/dashboard/reception")
      ? receptionSections
      : pathname.startsWith("/dashboard/doctor")
        ? doctorSections
        : pathname.startsWith("/dashboard/medtech")
          ? medtechSections
          : baseSections;

  /* Links close the drawer themselves via onNavigate — watching pathname instead
     would miss a tap on the route you're already on. popstate covers the one exit
     a link can't: the browser back button. */
  useEffect(() => {
    if (!menuOpen) return;

    closeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;

      /* The account menu's dialogs portal to <body> and dismiss themselves on
         Escape. Both listeners sit on document, so without this the one keypress
         would close the dialog and collapse the drawer underneath it. */
      const dialog =
        event.target instanceof Element
          ? event.target.closest('[role="dialog"][aria-modal="true"]')
          : null;
      if (dialog && dialog !== drawerRef.current) return;

      setMenuOpen(false);
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
        <aside className="no-print border-b border-rd-hair bg-rd-card backdrop-blur-xl lg:sticky lg:top-4 lg:flex lg:h-[calc(100dvh-2rem)] lg:w-72 lg:flex-none lg:flex-col lg:rounded-2xl lg:border lg:shadow-[var(--rd-card-shadow)]">
          <div className="flex items-center justify-between gap-3 p-5 lg:p-4">
            <Wordmark animated={showAnimatedMark} />
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

          {/* Only the nav scrolls. The account row is pinned as its own block so
              the menu it opens can't be clipped by the scroll container. */}
          <div className="rd-scroll-thin hidden min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-2 pt-4 lg:flex">
            <SectionNav sections={sections} pathname={pathname} />
          </div>

          <div className="hidden flex-none px-3 pb-4 lg:block">
            <AccountMenu />
          </div>
        </aside>

        {menuOpen && (
          <div className="no-print fixed inset-0 z-50 lg:hidden">
            <div className="rd-scrim absolute inset-0 bg-black/50" onClick={closeMenu} aria-hidden="true" />
            <div
              ref={drawerRef}
              id="dashboard-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Dashboard navigation"
              className="rd-drawer absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-rd-hair bg-rd-card backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-3 p-5">
                <Wordmark animated={showAnimatedMark} />
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

              <div className="rd-scroll-thin flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-2 pt-4">
                <SectionNav sections={sections} pathname={pathname} onNavigate={closeMenu} />
              </div>

              <div className="flex-none px-3 pb-5">
                <AccountMenu />
              </div>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 p-5 lg:p-4">{children}</main>
      </div>
    </div>
  );
}
