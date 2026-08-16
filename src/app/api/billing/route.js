import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {

    try {

        const { searchParams } = new URL(request.url);

        const page = Math.max(
            Number(searchParams.get("page")) || 1,
            1
        );

        const limit = Math.max(
            Number(searchParams.get("limit")) || 10,
            1
        );

        const search =
            searchParams.get("search")?.trim() || "";

        const status =
            searchParams.get("status") || "";

        const priority =
            searchParams.get("priority") || "";

        const dateFrom =
            searchParams.get("dateFrom") || "";

        const dateTo =
            searchParams.get("dateTo") || "";

        const sort =
            searchParams.get("sort") || "newest";

        const offset = (page - 1) * limit;

        const conditions = [];
        const values = [];


        if (search) {

            conditions.push(`
                (
                    CAST(v.id AS CHAR) LIKE ?
                    OR CAST(v.patientId AS CHAR) LIKE ?

                    OR CONCAT_WS(
                        ' ',
                        p.fname,
                        p.mname,
                        p.lname,
                        p.suffix
                    ) LIKE ?

                    OR t.name LIKE ?
                )
            `);

            const searchValue = `%${search}%`;

            values.push(
                searchValue,
                searchValue,
                searchValue,
                searchValue
            );

        }


        if (status) {

            conditions.push(`
                v.status = ?
            `);

            values.push(status);

        }


        if (priority) {

            conditions.push(`
                v.priority = ?
            `);

            values.push(priority);

        }


        if (dateFrom) {

            conditions.push(`
                DATE(v.visited_at) >= ?
            `);

            values.push(dateFrom);

        }


        if (dateTo) {

            conditions.push(`
                DATE(v.visited_at) <= ?
            `);

            values.push(dateTo);

        }


        const whereClause =
            conditions.length > 0
                ? `WHERE ${conditions.join(" AND ")}`
                : "";


        const orderBy =
            sort === "oldest"
                ? "v.id ASC"
                : "v.id DESC"


        const [countRows] = await db.query(
            `
            SELECT
                COUNT(DISTINCT v.id) AS total

            FROM tblpatientvisitation v

            LEFT JOIN tblpatients p
                ON p.id = v.patientId

            LEFT JOIN tblpatienttests pt
                ON pt.visitid = v.id

            LEFT JOIN tbltests t
                ON t.id = pt.testid

            ${whereClause}
            `,
            values
        );


        const total = Number(
            countRows[0]?.total || 0
        );

        const totalPages =
            total === 0
                ? 0
                : Math.ceil(total / limit);


        const [summaryRows] = await db.query(
            `
            SELECT
                COALESCE(
                    SUM(t.price),
                    0
                ) AS totalRevenue

            FROM tblpatientvisitation v

            LEFT JOIN tblpatients p
                ON p.id = v.patientId

            LEFT JOIN tblpatienttests pt
                ON pt.visitid = v.id

            LEFT JOIN tbltests t
                ON t.id = pt.testid

            ${whereClause}
            `,
            values
        );


        const [rows] = await db.query(
            `
            SELECT

                v.id AS visitId,

                v.patientId AS patientId,

                v.visited_at AS visitDate,

                v.priority,

                v.status,

                CONCAT_WS(
                    ' ',
                    p.fname,
                    p.mname,
                    p.lname,
                    p.suffix
                ) AS patientName,

                GROUP_CONCAT(
                    DISTINCT t.name
                    ORDER BY t.name
                    SEPARATOR ', '
                ) AS tests,

                COUNT(
                    DISTINCT t.id
                ) AS testCount,

                COALESCE(
                    SUM(t.price),
                    0
                ) AS totalCost

            FROM tblpatientvisitation v

            LEFT JOIN tblpatients p
                ON p.id = v.patientId

            LEFT JOIN tblpatienttests pt
                ON pt.visitid = v.id

            LEFT JOIN tbltests t
                ON t.id = pt.testid

            ${whereClause}

            GROUP BY
                v.id,
                v.patientId,
                v.visited_at,
                v.priority,
                v.status,
                p.fname,
                p.mname,
                p.lname,
                p.suffix

            ORDER BY ${orderBy}

            LIMIT ?
            OFFSET ?
            `,
            [
                ...values,
                limit,
                offset
            ]
        );


        return NextResponse.json({

            success: true,

            rows,
            totalRevenue: Number(summaryRows[0]?.totalRevenue || 0),

            pagination: {
                page,
                limit,
                total,
                totalPages
            }

        });

    } catch (error) {

        console.error(
            "BILLING API ERROR:",
            error
        );

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