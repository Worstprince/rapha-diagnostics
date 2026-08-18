// app/api/doctor/notes/[id]/attachments/[attachmentId]/route.js

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getCurrentUser } from "@/lib/serverSession";
import getAttachmentById from "@/lib/getAttachmentById";
import getVisitNoteStatus from "@/lib/getVisitNoteStatus";
import deleteVisitAttachment from "@/lib/mutations/deleteVisitAttachment";

export async function GET(request, { params }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, attachmentId } = await params;
        const attachment = await getAttachmentById(attachmentId);

        if (!attachment || String(attachment.visitid) !== String(id)) {
            return NextResponse.json({ error: "Attachment not found" }, { status: 404 });
        }

        const fullPath = path.join(process.cwd(), "uploads", attachment.filepath);
        const fileBuffer = await fs.readFile(fullPath);

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": `attachment; filename="${attachment.filename}"`,
            },
        });
    } catch (err) {
        console.error("GET /api/doctor/notes/[id]/attachments/[attachmentId] failed:", err);
        return NextResponse.json({ error: "Failed to download attachment" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, attachmentId } = await params;
        const attachment = await getAttachmentById(attachmentId);

        if (!attachment || String(attachment.visitid) !== String(id)) {
            return NextResponse.json({ error: "Attachment not found" }, { status: 404 });
        }

        if (String(attachment.uploadedby) !== String(currentUser.id)) {
            return NextResponse.json(
                { error: "You can only remove your own attachments" },
                { status: 403 }
            );
        }

        const noteStatus = await getVisitNoteStatus(id);
        if (noteStatus === "Finalized") {
            return NextResponse.json(
                { error: "Cannot remove attachments from a finalized note" },
                { status: 409 }
            );
        }

        // DB is the source of truth for the UI, so delete that first.
        await deleteVisitAttachment(attachmentId);

        // Disk cleanup is best-effort — if the file's already missing for some
        // reason, don't fail the request over it.
        try {
            const fullPath = path.join(process.cwd(), "uploads", attachment.filepath);
            await fs.unlink(fullPath);
        } catch (unlinkErr) {
            console.warn(`Could not delete file from disk for attachment ${attachmentId}:`, unlinkErr);
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("DELETE /api/doctor/notes/[id]/attachments/[attachmentId] failed:", err);
        return NextResponse.json({ error: "Failed to remove attachment" }, { status: 500 });
    }
}