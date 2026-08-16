// app/api/doctor/notes/[id]/attachments/route.js

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getCurrentUser } from "@/lib/serverSession";
import getVisitAttachments from "@/lib/getVisitAttachments";
import addVisitAttachment from "@/lib/mutations/addVisitAttachment";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function GET(request, { params }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const attachments = await getVisitAttachments(id);
        return NextResponse.json({ attachments });
    } catch (err) {
        console.error("GET /api/doctor/notes/[id]/attachments failed:", err);
        return NextResponse.json({ error: "Failed to load attachments" }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || typeof file === "string") {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Stored OUTSIDE /public — attachments may contain patient-identifiable
        // material, so they must only be reachable through the authenticated
        // download route, never a public static URL.
        const uploadDir = path.join(process.cwd(), "uploads", "visit-notes", String(id));
        await fs.mkdir(uploadDir, { recursive: true });

        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
        await fs.writeFile(path.join(uploadDir, safeName), buffer);

        await addVisitAttachment({
            visitId: id,
            uploadedBy: currentUser.id,
            filename: file.name,
            filepath: path.join("visit-notes", String(id), safeName),
            filesize: buffer.length,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("POST /api/doctor/notes/[id]/attachments failed:", err);
        return NextResponse.json({ error: "Failed to upload attachment" }, { status: 500 });
    }
}
