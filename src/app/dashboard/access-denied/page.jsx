import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-6 py-12">
      <div className="rd-panel w-full p-8 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-red-500/40 bg-red-500/10 text-red-400">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5" />
            <path d="M12 16h.01" />
          </svg>
        </div>
        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.28em] text-rd-muted">
          Access denied
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">
          You do not have permission to view this page.
        </h1>
        <p className="mt-3 text-sm text-rd-muted">
          Your account role does not allow access to this area of the dashboard.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard" className="rd-btn rd-press rd-focus">
            Go to dashboard
          </Link>
          <Link href="/auth/login" className="rd-btn-secondary rd-press rd-focus">
            Log in again
          </Link>
        </div>
      </div>
    </main>
  );
}
