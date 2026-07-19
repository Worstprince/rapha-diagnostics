import db from "@/lib/db";

import { NextResponse } from "next/server";

export async function GET(request, { params }) {

    const { id } = await params;

    const [rows] = await db.query(

        `
        SELECT

            pt.id,

            pt.testid,

            pt.status,

            pt.medtechid,

            tt.name,

            CONCAT(p.fname,' ',p.lname) AS patient

        FROM tblpatienttests pt

        INNER JOIN tbltests tt
        ON tt.id = pt.testid

        INNER JOIN tblpatientvisitation v
        ON v.id = pt.visitid

        INNER JOIN tblpatients p
        ON p.id = v.patientid

        WHERE pt.id = ?

        `,
        [id]

    );

    return NextResponse.json(rows[0]);

}