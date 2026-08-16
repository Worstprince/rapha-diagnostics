import db from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/logActivity";
import { getCurrentUser } from "@/lib/serverSession";

export async function POST(request, { params }) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Authentication required."
                },
                {
                    status: 401
                }
            );
        }

        const { id } = await params;

        if (String(currentUser.id) !== String(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You can only change your own password."
                },
                {
                    status: 403
                }
            );
        }

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Current and new password are required."
                },
                {
                    status: 400
                }
            );
        }

        const [rows] = await db.query(
            `
            SELECT id, password, username
            FROM tblusers
            WHERE id = ?
            `,
            [id]
        );

        const user = rows[0];

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found."
                },
                {
                    status: 404
                }
            );
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isCurrentPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Current password is incorrect."
                },
                {
                    status: 400
                }
            );
        }

        if (currentPassword === newPassword) {
            return NextResponse.json(
                {
                    success: false,
                    message: "New password must differ from the current one."
                },
                {
                    status: 400
                }
            );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await db.query(
            `
            UPDATE tblusers
            SET password = ?
            WHERE id = ?
            `,
            [hashedPassword, id]
        );

        await logActivity(
            user.id,
            "Password Changed",
            `Changed password for user: ${user.username}`,
            "Authentication"
        );

        return NextResponse.json(
            {
                success: true,
                message: "Password updated successfully."
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update password."
            },
            {
                status: 500
            }
        );
    }
}
