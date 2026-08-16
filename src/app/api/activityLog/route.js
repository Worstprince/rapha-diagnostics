import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {

    try {

        const { searchParams } = new URL(request.url);


        // Pagination

        const page = Math.max(
            Number(searchParams.get("page")) || 1,
            1
        );

        const limit = Math.max(
            Number(searchParams.get("limit")) || 10,
            1
        );

        const offset = (page - 1) * limit;


        // Filters

        const search = searchParams.get("search") || "";
        const moduleFilter = searchParams.get("module") || "";
        const actionFilter = searchParams.get("action") || "";
        const usernameFilter = searchParams.get("username") || "";
        const sortDate = searchParams.get("sortDate") || "";


        const conditions = [];
        const values = [];


        // Search

        if (search.trim()) {

            conditions.push(`
                (
                    u.username LIKE ?
                    OR a.action LIKE ?
                    OR a.module LIKE ?
                    OR a.description LIKE ?
                )
            `);

            const searchValue = `%${search.trim()}%`;

            values.push(
                searchValue,
                searchValue,
                searchValue,
                searchValue
            );

        }


        // Module filter

        if (moduleFilter) {

            conditions.push(
                "a.module = ?"
            );

            values.push(
                moduleFilter
            );

        }


        // Action filter

        if (actionFilter) {

            conditions.push(
                "a.action = ?"
            );

            values.push(
                actionFilter
            );

        }


        // Username filter

        if (usernameFilter) {

            conditions.push(
                "u.username = ?"
            );

            values.push(
                usernameFilter
            );

        }


        // WHERE clause

        const whereClause =
            conditions.length > 0
                ? `WHERE ${conditions.join(" AND ")}`
                : "";

        const countWhereClause =
            conditions.length > 0
                ? `WHERE ${conditions.join(" AND ")}`
                : "";


        // Sorting

        let orderBy = "datetime DESC";

        if (sortDate === "oldest") {

            orderBy = "datetime ASC";

        }


        // Get paginated activity logs

        const [rows] = await db.query(
            `
            SELECT
                a.id,
                u.username,
                a.action,
                a.module,
                a.description,
                a.datetime
            FROM tblactivitylog a
            LEFT JOIN tblusers u ON a.userid = u.id
            ${whereClause}
            ORDER BY ${orderBy}
            LIMIT ? OFFSET ?
            `,
            [
                ...values,
                limit,
                offset
            ]
        );


        // Get total number of matching records

        const [countRows] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM tblactivitylog a
            LEFT JOIN tblusers u ON a.userid = u.id
            ${countWhereClause}
            `,
            values
        );


        const total = Number(
            countRows[0]?.total || 0
        );


        const totalPages = Math.ceil(
            total / limit
        );


        // Get all available modules

        const [moduleRows] = await db.query(
            `
            SELECT DISTINCT a.module
            FROM tblactivitylog a
            WHERE a.module IS NOT NULL
            AND a.module <> ''
            ORDER BY a.module ASC
            `
        );


        // Get all available actions

        const [actionRows] = await db.query(
            `
            SELECT DISTINCT a.action
            FROM tblactivitylog a
            WHERE action IS NOT NULL
            AND action <> ''
            ORDER BY action ASC
            `
        );


        // Get all available usernames

        const [usernameRows] = await db.query(
            `
            SELECT DISTINCT u.username
            FROM tblactivitylog a
            LEFT JOIN tblusers u ON a.userid = u.id
            WHERE u.username IS NOT NULL
            AND u.username <> ''
            ORDER BY u.username ASC
            `
        );


        return NextResponse.json({

            rows,

            total,

            page,

            limit,

            totalPages,

            modules: moduleRows.map(
                row => row.module
            ),

            actions: actionRows.map(
                row => row.action
            ),

            usernames: usernameRows.map(
                row => row.username
            )

        });


    } catch (error) {

        console.error(
            "ACTIVITY LOG ERROR:",
            error
        );


        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch activity logs."
            },
            {
                status: 500
            }
        );

    }

}