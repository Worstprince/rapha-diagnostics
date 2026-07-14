import db from "@/lib/db";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/logActivity";

export async function GET(request, { params }) {
    try {
        const { id } = await params
        const [user] = await db.query(
            `
            SELECT
                id,
                username,
                email,
                role
            FROM tblusers
            WHERE id = ?
            `,
            [id]
        );

        if (user.length === 0) {
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

        return NextResponse.json(
            {
                success: true,
                data: user[0]
            },
            {
                status: 200
            }
        );

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch user."
            },
            {
                status: 400
            }
        );
    }

}

export async function PUT(request, { params }) {

    try {
        const { id } = await params;
        const user = await request.json();

        // Check if username/email belongs to another user
        const [rows] = await db.query(
            `
            SELECT id
            FROM tblusers
            WHERE (username = ? OR email = ?)
            AND id <> ?
            `,
            [
                user.username,
                user.email,
                id
            ]
        );

        if (rows.length > 0) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Username or email already exists."
                },
                {
                    status: 409
                }
            );

        }

        // Update WITHOUT changing password
        if (user.password === "") {

            await db.query(
                `
                UPDATE tblusers
                SET
                    username = ?,
                    email = ?,
                    role = ?
                WHERE id = ?
                `,
                [
                    user.username,
                    user.email,
                    user.role,
                    id
                ]
            );

        }
        else {

            await db.query(
                `
                UPDATE tblusers
                SET
                    username = ?,
                    password = ?,
                    email = ?,
                    role = ?
                WHERE id = ?
                `,
                [
                    user.username,
                    user.password,
                    user.email,
                    user.role,
                    id
                ]
            );

        }

        await logActivity(
            1, // Replace with logged-in user's ID later
            "User Update",
            `Updated user: ${user.username}`
        );

        return NextResponse.json({
            success: true,
            message: "User updated successfully."
        });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update user."
            },
            {
                status: 500
            }
        );

    }

}