import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const medtechId = searchParams.get("medtechId");

        if (!medtechId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Medtech ID is required."
                },
                {
                    status: 400
                }
            );
        }

        const [rows] = await db.query(
            `
            SELECT
                pt.visitid,
                pt.id AS assignmentid,
                CONCAT(fname, ' ', lname) AS patientname,
                t.id AS testid,
                t.name,
                visited_at,
                pt.status
            FROM tblpatienttests pt
            INNER JOIN tblpatientvisitation pv
                ON pt.visitid = pv.id
            INNER JOIN tbltests t
                ON t.id = pt.testid
            INNER JOIN tblpatients p
                ON p.id = pv.patientid
            AND pt.medtechid = ?
            ORDER BY pv.visited_at DESC, pt.visitid
            `,
            [medtechId]
        );

        const grouped = [];

        for (const row of rows) {
            let visit = grouped.find(
                v => v.visitid === row.visitid
            );

            if (!visit) {
                visit = {
                    visitid: row.visitid,
                    patientname: row.patientname,
                    visited_at: row.visited_at,
                    tests: []
                };

                grouped.push(visit);
            }

            visit.tests.push({
                assignmentid: row.assignmentid,
                testid: row.testid,
                name: row.name,
                status: row.status
            });
        }

        return NextResponse.json(grouped);

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch assignments."
            },
            {
                status: 500
            }
        );
    }
}