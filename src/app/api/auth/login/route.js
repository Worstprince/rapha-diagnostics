import db from "@/lib/db";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/logActivity";

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // `email` is the login field value; users may enter their email OR username.
        const identifier = typeof email === "string" ? email.trim() : email;

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
            SELECT id, username, email, role, password
            FROM tblusers
            WHERE (email = ? OR username = ?)
            AND archivestatus = 0
            `,
            [identifier, identifier]
        );

        const user = rows[0];

        // NOTE: passwords are stored in plain text (see api/users/add), so we
        // compare directly. Hash with bcrypt once storage is migrated.
        if (!user || user.password !== password) {
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
            `User logged in: ${user.username}`
        );

        return NextResponse.json({
            success: true,
            message: "Signed in successfully.",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

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
