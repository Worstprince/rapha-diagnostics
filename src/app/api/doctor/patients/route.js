import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {

    try {

        const [rows] = await db.query(`
            SELECT
                p.id AS patientid,
                CONCAT(p.fname, ' ', p.lname) AS name,
                p.birthdate,
                TIMESTAMPDIFF(
                    YEAR,
                    p.birthdate,
                    CURDATE()
                ) AS age,
                p.sex,
                p.address,

                MAX(v.visited_at) AS lastvisited,

                COUNT(v.id) AS visitcount

            FROM tblpatients p

            LEFT JOIN tblpatientvisitation v
                ON v.patientid = p.id

            GROUP BY
                p.id,
                p.fname,
                p.lname,
                p.birthdate,
                p.sex,
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