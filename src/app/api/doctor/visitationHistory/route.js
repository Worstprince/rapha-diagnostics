import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {

    try {

        const searchParams = request.nextUrl.searchParams;

        const search = searchParams.get("search") ?? "";
        const date = searchParams.get("date") ?? "";
        const priority = searchParams.get("priority") ?? "";
        const sortDate = searchParams.get("sortDate") ?? "";

        const page = Math.max(
            parseInt(searchParams.get("page") ?? "1"),
            1
        );

        const limit = Math.max(
            parseInt(searchParams.get("limit") ?? "10"),
            1
        );

        const offset = (page - 1) * limit;


        const conditions = [
            `v.status = 'Approved'`
        ];

        const values = [];


        if (search.trim()) {

            conditions.push(`
                (
                    CONCAT(p.fname, ' ', p.lname) LIKE ?
                    OR p.id LIKE ?
                )
            `);

            const searchTerm = `%${search.trim()}%`;

            values.push(
                searchTerm,
                searchTerm
            );

        }


        if (date) {

            conditions.push(`
                DATE(v.visited_at) = ?
            `);

            values.push(date);

        }


        if (priority) {

            conditions.push(`
                v.priority = ?
            `);

            values.push(priority);

        }


        const whereClause = conditions.join(" AND ");


        let orderBy = `
            v.visited_at DESC
        `;

        if (sortDate === "oldest") {

            orderBy = `
                v.visited_at ASC
            `;

        }


        const [rows] = await db.query(
            `
            SELECT
                v.id AS visitid,

                CONCAT(
                    p.fname,
                    ' ',
                    p.lname
                ) AS name,

                TIMESTAMPDIFF(
                    YEAR,
                    p.birthdate,
                    CURDATE()
                ) AS age,

                p.sex,

                v.visited_at,
                v.status,
                v.priority

            FROM tblpatients AS p

            INNER JOIN tblpatientvisitation AS v
                ON v.patientid = p.id

            WHERE ${whereClause}

            ORDER BY ${orderBy}

            LIMIT ? OFFSET ?
            `,
            [
                ...values,
                limit,
                offset
            ]
        );


        const [countRows] = await db.query(
            `
            SELECT COUNT(*) AS total

            FROM tblpatients AS p

            INNER JOIN tblpatientvisitation AS v
                ON v.patientid = p.id

            WHERE ${whereClause}
            `,
            values
        );


        const total = Number(
            countRows[0]?.total ?? 0
        );

        const totalPages = Math.ceil(
            total / limit
        );


        const [priorities] = await db.query(
            `
            SELECT DISTINCT priority
            FROM tblpatientvisitation
            WHERE status = 'Approved'
            AND priority IS NOT NULL
            ORDER BY priority
            `
        );


        return NextResponse.json({

            rows,

            total,

            totalPages,

            priorities: priorities.map(
                row => row.priority
            )

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