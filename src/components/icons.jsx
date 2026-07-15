/* Outline icons for the dashboard nav. One size and one stroke width across the
   whole set — mixing either reads as sloppy once they sit in a column together. */

function Icon({ className = "", children }) {
  return (
    <svg
      className={`flex-none ${className}`.trim()}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function GridIcon({ className }) {
  return (
    <Icon className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </Icon>
  );
}

export function ActivityIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M3 12h4l3-8 4 16 3-8h4" />
    </Icon>
  );
}

export function UsersIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M16 19v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V19" />
      <circle cx="9" cy="7" r="3.5" />
      <path d="M22 19v-1.5a4 4 0 0 0-3-3.87" />
      <path d="M16 3.63a4 4 0 0 1 0 7.75" />
    </Icon>
  );
}

export function UserPlusIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M15 19v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V19" />
      <circle cx="8.5" cy="7" r="3.5" />
      <path d="M19 8v6M22 11h-6" />
    </Icon>
  );
}

export function UserCogIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M11 19v-1.5a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4V19" />
      <circle cx="6" cy="7" r="3.5" />
      <circle cx="17.5" cy="14.5" r="3" />
      <path d="M17.5 9.5v1.4M17.5 18.1v1.4M22 14.5h-1.4M14.4 14.5H13M20.7 11.3l-1 1M15.3 16.7l-1 1M20.7 17.7l-1-1M15.3 12.3l-1-1" />
    </Icon>
  );
}

export function ClipboardIcon({ className }) {
  return (
    <Icon className={className}>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11v6M15 14H9" />
    </Icon>
  );
}

export function CalendarCheckIcon({ className }) {
  return (
    <Icon className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M9 16l2 2 4-4" />
    </Icon>
  );
}

export function MenuIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Icon>
  );
}

export function SignOutIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </Icon>
  );
}

export function CloseIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
  );
}
