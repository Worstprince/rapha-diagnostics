// app/doctor/notes/page.jsx
// Server component — no "use client" here, since it awaits the DB call directly.

import getApprovedVisits from "@/lib/getApprovedVisits";
import NotesQueueTable from "@/components/NotesQueueTable";

// Without this, Next.js has no signal (no cookies()/headers()/searchParams,
// no fetch()) that this route needs per-request data, so it can statically
// prerender the page at build/deploy time and keep serving that snapshot —
// meaning newly approved visits never show up until the next deploy.
export const dynamic = "force-dynamic";

export default async function NotesQueuePage() {
  const entries = await getApprovedVisits();

  return <NotesQueueTable entries={entries} />;
}
