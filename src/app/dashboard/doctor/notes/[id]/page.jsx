// app/doctor/notes/[id]/page.jsx

import { notFound } from "next/navigation";
import getVisitDetails from "@/lib/getVisitDetails";
import { getCurrentUser } from "@/lib/serverSession";
import NotesEditor from "@/components/NotesEditor";

export default async function NotesEditorRoute({ params }) {
  const { id } = await params;
  const visit = await getVisitDetails(id);

  if (!visit) {
    notFound();
  }

  const currentUser = await getCurrentUser();

  return <NotesEditor visit={visit} currentUserId={currentUser?.id} />;
}