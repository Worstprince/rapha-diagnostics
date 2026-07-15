import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [rows] = await db.query(
            `
SELECT v.id as visitid, CONCAT(fname, ' ', lname) as name, TIMESTAMPDIFF(YEAR, 
birthdate, CURDATE()) as age, sex, visited_at, v.status, v.priority 
FROM tblpatients
INNER JOIN tblpatientvisitation as v ON v.patientid = tblpatients.id;
            `
        );
        return NextResponse.json(rows);
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