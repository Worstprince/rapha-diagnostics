// app/doctor/notes/page.jsx
// Server component — no "use client" here, since it awaits the DB call directly.

import getApprovedVisits from "@/lib/getApprovedVisits";
import NotesQueueTable from "@/components/NotesQueueTable";

export default async function NotesQueuePage() {
  const entries = await getApprovedVisits();

  return <NotesQueueTable entries={entries} />;
}
