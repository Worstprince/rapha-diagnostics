import db from "@/lib/db";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/logActivity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SESSION_COOKIE_NAME } from "@/lib/session.config";

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // `email` is the login field value; users may enter their email OR username.
        const identifier =
            typeof email === "string"
                ? email.trim()
                : email;

        if (!identifier || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email/username and password are required."
                },
                {
                    status: 400
                }
            );
        }

        const [rows] = await db.query(
            `
            SELECT
                id,
                username,
                email,
                role,
                password
            FROM tblusers
            WHERE (email = ? OR username = ?)
            AND archivestatus = 0
            `,
            [
                identifier,
                identifier
            ]
        );

        const user = rows[0];
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email/username or password."
                },
                {
                    status: 401
                }
            );
        }

        // Compare the entered password against the stored bcrypt hash.
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email/username or password."
                },
                {
                    status: 401
                }
            );
        }

        await logActivity(
            user.id,
            "Login",
            `User logged in: ${user.username}`,
            "Authentication"
        );

        // Sign a session token containing just enough to identify + authorize
        // the user server-side. Never put the password hash in here.
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.SESSION_SECRET,
            { expiresIn: "8h" }
        );

        const response = NextResponse.json({
            success: true,
            message: "Signed in successfully.",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

        // httpOnly: JS (and therefore any XSS payload) can't read this cookie.
        response.cookies.set(SESSION_COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 8, // 8 hours, matches the token's expiresIn above
        });

        return response;

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Login failed. Please try again."
            },
            {
                status: 500
            }
        );
    }
}
