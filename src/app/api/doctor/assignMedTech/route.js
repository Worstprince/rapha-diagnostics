import db from "@/lib/db";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/logActivity";

export async function POST(request) {

    const { tests, userId } = await request.json();

    const changes = [];

    for (const test of tests) {

        const [rows] = await db.query(
            `
            SELECT medtechid
            FROM tblpatienttests
            WHERE id = ?
            `,
            [test.id]
        );

        const oldMedtechId = rows[0]?.medtechid;

        // Only update and log if the assignment actually changed
        if (String(oldMedtechId ?? "") !== String(test.medtechid ?? "")) {

            await db.query(
                `
                UPDATE tblpatienttests
                SET medtechid = ?
                WHERE id = ?
                `,
                [
                    test.medtechid,
                    test.id
                ]
            );

            changes.push(
                `Medical Technologist: ${test.medtechid} to Test: ${test.id}`
            );
        }
    }

    if (changes.length > 0) {

        await logActivity(
            userId,
            "Assign MedTech",
            changes.join(", "),
            "Doctor"
        );

    }

    return NextResponse.json({
        success: true,
        message: "Assigned Medical Technologists to patient has been updated!"
    });
}