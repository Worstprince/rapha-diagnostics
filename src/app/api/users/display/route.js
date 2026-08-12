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

        const offset = (page - 1) * limit;

        const search =
            searchParams.get("search") || "";

        const roleFilter =
            searchParams.get("role") || "";

        const statusFilter =
            searchParams.get("status") || "";

        const sort =
            searchParams.get("sort") || "";


        const conditions = [];
        const values = [];


        if (search) {

            conditions.push(
                `
                (
                    u.id LIKE ?
                    OR u.username LIKE ?
                    OR u.role LIKE ?
                    OR ui.fname LIKE ?
                    OR ui.mname LIKE ?
                    OR ui.lname LIKE ?
                )
                `
            );

            const searchValue = `%${search}%`;

            values.push(
                searchValue,
                searchValue,
                searchValue,
                searchValue,
                searchValue,
                searchValue
            );

        }


        if (roleFilter) {

            conditions.push(
                "u.role = ?"
            );

            values.push(
                roleFilter
            );

        }


        if (statusFilter === "active") {

            conditions.push(
                "u.archivestatus = 0"
            );

        } else if (statusFilter === "archived") {

            conditions.push(
                "u.archivestatus = 1"
            );

        }


        const whereClause =
            conditions.length > 0
                ? `WHERE ${conditions.join(" AND ")}`
                : "";


        let orderBy =
            "u.created_at DESC";


        if (sort === "newest") {

            orderBy =
                "u.created_at DESC";

        } else if (sort === "oldest") {

            orderBy =
                "u.created_at ASC";

        } else if (sort === "username-asc") {

            orderBy =
                "u.username ASC";

        } else if (sort === "username-desc") {

            orderBy =
                "u.username DESC";

        }


        const [rows] = await db.query(
            `
            SELECT
                u.id,
                u.username,
                u.role,
                u.created_at,
                u.archivestatus,
                ui.fname,
                ui.mname,
                ui.lname
            FROM tblusers u
            LEFT JOIN tbluserinfo ui
                ON ui.userid = u.id
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


        const [countRows] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM tblusers u
            LEFT JOIN tbluserinfo ui
                ON ui.userid = u.id
            ${whereClause}
            `,
            values
        );


        const total =
            Number(countRows[0].total) || 0;


        return NextResponse.json({
            rows,
            total,
            page,
            limit,
            totalPages: Math.ceil(
                total / limit
            )
        });


    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to fetch users."
            },
            {
                status: 500
            }
        );

    }
}