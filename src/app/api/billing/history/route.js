import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const page = Math.max(
            parseInt(searchParams.get("page") || "1", 10),
            1
        );

        const limit = Math.min(
            Math.max(
                parseInt(searchParams.get("limit") || "10", 10),
                1
            ),
            100
        );

        const offset = (page - 1) * limit;

        const search = searchParams.get("search")?.trim() || "";
        const status = searchParams.get("status") || "";
        const priority = searchParams.get("priority") || "";
        const dateFrom = searchParams.get("dateFrom") || "";
        const dateTo = searchParams.get("dateTo") || "";
        const sort = searchParams.get("sort") || "newest";

        const conditions = [];
        const params = [];

        if (search) {
            conditions.push(`
                (
                    CAST(v.id AS CHAR) LIKE ?

                    OR CAST(v.patientId AS CHAR) LIKE ?

                    OR COALESCE(p.fname, '') LIKE ?

                    OR COALESCE(p.mname, '') LIKE ?

                    OR COALESCE(p.lname, '') LIKE ?

                    OR CONCAT_WS(
                        ' ',
                        p.fname,
                        p.mname,
                        p.lname,
                        p.suffix
                    ) LIKE ?

                    OR EXISTS (
                        SELECT 1
                        FROM tblpatienttests ptSearch
                        INNER JOIN tbltests tSearch
                            ON tSearch.id = ptSearch.testid
                        WHERE ptSearch.visitid = v.id
                        AND tSearch.name LIKE ?
                    )
                )
            `);

            const searchValue = `%${search}%`;

            params.push(
                searchValue,
                searchValue,
                searchValue,
                searchValue,
                searchValue,
                searchValue,
                searchValue
            );
        }

        if (status) {
            conditions.push("v.status = ?");
            params.push(status);
        }

        if (priority) {
            conditions.push("v.priority = ?");
            params.push(priority);
        }

        if (dateFrom) {
            conditions.push("DATE(v.visited_at) >= ?");
            params.push(dateFrom);
        }

        if (dateTo) {
            conditions.push("DATE(v.visited_at) <= ?");
            params.push(dateTo);
        }

        const whereClause =
            conditions.length > 0
                ? `WHERE ${conditions.join(" AND ")}`
                : "";

        const orderBy =
            sort === "oldest"
                ? "v.visited_at ASC, v.id ASC"
                : "v.visited_at DESC, v.id DESC";


        const [countRows] = await db.query(
            `
            SELECT COUNT(DISTINCT v.id) AS total

            FROM tblpatientvisitation v

            LEFT JOIN tblpatients p
                ON p.id = v.patientId

            ${whereClause}
            `,
            params
        );

        const total = Number(countRows[0]?.total || 0);

        const [rows] = await db.query(
            `
            SELECT
                v.id AS visitId,

                v.patientId,

                CONCAT_WS(
                    ' ',
                    p.fname,
                    p.mname,
                    p.lname,
                    p.suffix
                ) AS patientName,

                v.visited_at AS visitDate,

                v.status,

                v.priority,

                GROUP_CONCAT(
                    DISTINCT t.name
                    ORDER BY t.name
                    SEPARATOR ', '
                ) AS tests,

                COUNT(DISTINCT pt.id) AS testCount,

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
                p.fname,
                p.mname,
                p.lname,
                p.suffix,
                v.visited_at,
                v.status,
                v.priority

            ORDER BY ${orderBy}

            LIMIT ? OFFSET ?
            `,
            [
                ...params,
                limit,
                offset
            ]
        );

        const totalPages =
            total === 0
                ? 0
                : Math.ceil(total / limit);

        return NextResponse.json({
            success: true,

            rows,

            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to load billing history."
            },
            {
                status: 500
            }
        );
    }
}