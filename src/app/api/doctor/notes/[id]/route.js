// app/api/doctor/notes/[id]/route.js
//
// Note: if you're on Next.js 15+, `params` is a Promise and needs
// `const { id } = await params;` instead of destructuring directly.

import { NextResponse } from "next/server";
import { useCurrentUser } from "@/lib/session";
import saveDraftNote from "@/lib/mutations/saveDraftNote";

export async function PATCH(request, { params }) {
    try {
        const currentUser = await useCurrentUser();

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