import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {

    const [rows] = await db.query(
        `
        SELECT
            pt.id,
            CONCAT(fname, ' ', lname) as patientname,
            t.id,
            t.name,
            visited_at,
            pt.status
        FROM tblpatienttests pt
        INNER JOIN tblpatientvisitation pv ON pt.visitid = pv.id
        INNER JOIN tbltests t ON t.id = pt.testid
        INNER JOIN tblpatients p ON p.id = pv.patientid;
        `
    );

    return NextResponse.json(rows);

}