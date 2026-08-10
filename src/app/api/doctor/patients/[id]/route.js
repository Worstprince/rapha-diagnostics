import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {

    try {

        const { id } = await params;

        // Get patient information
        const [patientRows] = await db.query(
            `
            SELECT
                p.id AS patientid,
                CONCAT_WS(' ', p.fname, p.mname, p.lname, p.suffix) AS name,
                p.birthdate,
                TIMESTAMPDIFF(YEAR, p.birthdate, CURDATE()) AS age,
                p.sex,
                p.civilStatus,
                p.mobilenum,
                p.email,
                p.address
            FROM tblpatients p
            WHERE p.id = ?
            `,
            [id]
        );

        if (patientRows.length === 0) {

            return NextResponse.json(
                {
                    message: "Patient not found."
                },
                {
                    status: 404
                }
            );

        }

        // Get patient's visit history
        const [visitRows] = await db.query(
            `
            SELECT
                v.id AS visitid,
                v.visited_at
            FROM tblpatientvisitation v
            WHERE v.patientid = ?
            ORDER BY v.visited_at DESC
            `,
            [id]
        );

        return NextResponse.json({
            patient: patientRows[0],
            visits: visitRows
        });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                message: "Failed to load patient."
            },
            {
                status: 500
            }
        );

    }

}