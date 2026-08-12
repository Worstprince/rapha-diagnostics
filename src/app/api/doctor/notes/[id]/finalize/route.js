// app/api/doctor/notes/[id]/finalize/route.js
//
// Note: if you're on Next.js 15+, `params` is a Promise and needs
// `const { id } = await params;` instead of destructuring directly.

import { NextResponse } from "next/server";
import { useCurrentUser } from "@/lib/session";
import finalizeNote from "@/lib/mutations/finalizeNote";

export async function POST(request, { params }) {
    try {
        const currentUser = await useCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        await finalizeNote({
            visitId: id,
            findings: body.findings ?? "",
            impression: body.impression ?? "",
            recommendation: body.recommendation ?? "",
            doctorId: currentUser.id,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("POST /api/doctor/notes/[id]/finalize failed:", err);
        return NextResponse.json({ error: "Failed to finalize note" }, { status: 500 });
    }
}