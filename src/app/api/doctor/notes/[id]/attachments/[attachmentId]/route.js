// app/api/doctor/notes/[id]/attachments/[attachmentId]/route.js

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getCurrentUser } from "@/lib/serverSession";
import getAttachmentById from "@/lib/getAttachmentById";

export async function GET(request, { params }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, attachmentId } = await params;
        const attachment = await getAttachmentById(attachmentId);

        // Confirm the attachment actually belongs to the visit in the URL —
        // stops someone from guessing another visit's attachment ID.
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
