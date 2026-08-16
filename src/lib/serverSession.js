// lib/serverSession.js
//
// This is the server-side counterpart to the client's useCurrentUser() hook.
// useCurrentUser() reads localStorage, which only exists in the browser —
// this reads the httpOnly cookie set at login, which the server can verify.

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { SESSION_COOKIE_NAME } from "@/lib/session.config";

export async function getCurrentUser() {
    const cookieStore = await cookies(); // Next.js 15+: cookies() is async
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) return null;

    try {
        // Returns whatever was signed at login — { id, role, iat, exp }
        return jwt.verify(token, process.env.SESSION_SECRET);
    } catch {
        // Expired or tampered token
        return null;
    }
}
