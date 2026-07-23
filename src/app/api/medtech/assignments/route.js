import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {

    const [rows] = await db.query(
        `
        SELECT
            pt.id as assignmentid,
            CONCAT(fname, ' ', lname) as patientname,
            t.id as testid,
            t.name,
            visited_at,
            pt.status
        FROM tblpatienttests pt
        INNER JOIN tblpatientvisitation pv ON pt.visitid = pv.id
        INNER JOIN tbltests t ON t.id = pt.testid
        INNER JOIN tblpatients p ON p.id = pv.patientid
        WHERE pt.status = 'Pending';
        `
    );

    return NextResponse.json(rows);

}