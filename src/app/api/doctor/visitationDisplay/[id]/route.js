import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { id } = await params;
    try {
        const [patientRows] = await db.query(
            `
            SELECT
                v.id,
                CONCAT(fname,' ',lname) AS name,
                TIMESTAMPDIFF(YEAR,birthdate,CURDATE()) AS age,
                birthdate,
                sex,
                mobileNum,
                address,
                visited_at,
                priority,
                v.status
            FROM tblpatientvisitation v
            INNER JOIN tblpatients p
            ON p.id = v.patientid
            WHERE v.id = ?;
            `, [id]
        );

        const [testRows] = await db.query(
            `
            SELECT
                pt.id,
                tt.name,
                pt.status,
                pt.medtechid
            FROM tblpatienttests pt
            INNER JOIN tbltests tt
            ON tt.id = pt.testid
            WHERE pt.visitid = ?;
            `, [id]
        );

        return NextResponse.json({

    patient: patientRows[0],

    tests: testRows

});
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