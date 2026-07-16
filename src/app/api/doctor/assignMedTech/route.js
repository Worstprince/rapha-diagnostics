import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { tests } = await request.json();
    for (const test of tests) {

        await db.query(
            `
            UPDATE tblpatienttests
            SET
                medtechid = ?,
                status = 'Assigned'
            WHERE id = ?
            `,
            [
                test.medtechid,
                test.id
            ]
        );

    }

    return NextResponse.json({
        success: true,
        message: "Assigned Medical Technologists to patient has been updated!"
    });

}