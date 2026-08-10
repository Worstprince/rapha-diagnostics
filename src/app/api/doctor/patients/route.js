import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {

    try {

        const [rows] = await db.query(`
            SELECT
    p.id as patientid,
    CONCAT_WS(' ', p.fname, p.mname, p.lname, p.suffix) AS name,
    p.birthdate,
    TIMESTAMPDIFF(YEAR, p.birthdate, CURDATE()) AS age,
    p.sex,
    p.civilStatus,
    p.mobilenum,
    p.email,
    p.address,
                MAX(v.visited_at) AS lastvisited,

                COUNT(v.id) AS visitcount

            FROM tblpatients p

            LEFT JOIN tblpatientvisitation v
                ON v.patientid = p.id

            GROUP BY
                p.id,
                p.fname,
                p.mname,
                p.lname,
                p.suffix,
                p.birthdate,
                p.sex,
                p.civilStatus,
                p.mobilenum,
                p.email,
                p.address

            ORDER BY
                lastvisited DESC,
                name ASC
        `);

        return NextResponse.json(rows);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                message: "Failed to load patients."
            },
            {
                status: 500
            }
        );

    }

}