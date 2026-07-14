import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const { id} = await params
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