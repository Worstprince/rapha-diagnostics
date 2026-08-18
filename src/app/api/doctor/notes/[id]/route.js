// app/api/doctor/notes/[id]/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/serverSession";
import saveDraftNote from "@/lib/mutations/saveDraftNote";

export async function PATCH(request, { params }) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        await saveDraftNote({
            visitId: id,
            findings: body.findings ?? "",
            impression: body.impression ?? "",
            recommendation: body.recommendation ?? "",
            criticalAcknowledged: Boolean(body.criticalAcknowledged),
            doctorId: currentUser.id,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("PATCH /api/doctor/notes/[id] failed:", err);
        return NextResponse.json({ error: "Failed to save draft" }, { status: 500 });
    }
}
