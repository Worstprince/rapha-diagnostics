// app/api/doctor/notes/[id]/comments/[commentId]/route.js

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/serverSession";
import getVisitCommentById from "@/lib/getVisitCommentById";
import getVisitNoteStatus from "@/lib/getVisitNoteStatus";
import deleteVisitComment from "@/lib/mutations/deleteVisitComment";

export async function DELETE(request, { params }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, commentId } = await params;
        const comment = await getVisitCommentById(commentId);

        if (!comment || String(comment.visitid) !== String(id)) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }

        if (String(comment.authorid) !== String(currentUser.id)) {
            return NextResponse.json(
                { error: "You can only remove your own comments" },
                { status: 403 }
            );
        }

        const noteStatus = await getVisitNoteStatus(id);
        if (noteStatus === "Finalized") {
            return NextResponse.json(
                { error: "Cannot remove comments from a finalized note" },
                { status: 409 }
            );
        }

        await deleteVisitComment(commentId);
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("DELETE /api/doctor/notes/[id]/comments/[commentId] failed:", err);
        return NextResponse.json({ error: "Failed to remove comment" }, { status: 500 });
    }
}