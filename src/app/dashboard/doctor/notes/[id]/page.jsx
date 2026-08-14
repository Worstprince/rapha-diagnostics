// app/doctor/notes/[id]/page.jsx
// Server component — no "use client" here, since it awaits the DB call directly.
//
// Note: if you're on Next.js 15+, `params` is a Promise and needs
// `const { id } = await params;` instead of `params.id` directly.

import { notFound } from "next/navigation";
import getVisitDetails from "@/lib/getVisitDetails";
import NotesEditor from "@/components/NotesEditor";

export default async function NotesEditorRoute({ params }) {
  const { id } = await params;
  const visit = await getVisitDetails(id);

  if (!visit) {
    notFound();
  }

  return <NotesEditor visit={visit} />;
}
