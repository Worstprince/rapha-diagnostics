// app/api/auth/logout/route.js

import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/session.config";

export async function POST() {
    const response = NextResponse.json({ success: true });

    response.cookies.set(SESSION_COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0, // expires immediately
    });

    return response;
}
