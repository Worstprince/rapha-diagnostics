
// app/api/doctor/notes/[id]/comments/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/serverSession";
import getVisitComments from "@/lib/getVisitComments";
import addVisitComment from "@/lib/mutations/addVisitComment";

export async function GET(request, { params }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const comments = await getVisitComments(id);
        return NextResponse.json({ comments });
    } catch (err) {
        console.error("GET /api/doctor/notes/[id]/comments failed:", err);
        return NextResponse.json({ error: "Failed to load comments" }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { comment } = await request.json();

        if (!comment || !comment.trim()) {
            return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
        }

        await addVisitComment({
            visitId: id,
            authorId: currentUser.id,
            comment: comment.trim(),
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("POST /api/doctor/notes/[id]/comments failed:", err);
        return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
    }
}
