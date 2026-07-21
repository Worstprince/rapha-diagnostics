import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {

    try {

        const { id } = await params;

        const [rows] = await db.query(
            `
            SELECT
                pt.id,
                pt.testid,
                pt.visitid,
                pt.status,
                pt.medtechid,

                p.id AS patientid,
                CONCAT(p.fname,' ',p.lname) AS patientname,
                p.birthdate,
                TIMESTAMPDIFF(YEAR,p.birthdate,CURDATE()) AS age,
                p.sex,
                p.address

            FROM tblpatienttests pt

            INNER JOIN tblpatientvisitation v
                ON pt.visitid = v.id

            INNER JOIN tblpatients p
                ON v.patientid = p.id

            WHERE pt.id = ?
            `,
            [id]
        );

        if (rows.length === 0) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Test not found."
                },
                {
                    status: 404
                }
            );

        }

        return NextResponse.json(rows[0]);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: error.message
            },
            {
                status: 500
            }
        );

    }

}