import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const user = await request.json();
        const newUser = await db.user.create({
            data: user
        });
        return NextResponse.json(newUser);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
    }
}