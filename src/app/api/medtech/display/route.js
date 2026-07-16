import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {

    const [rows] = await db.query(
        `
        SELECT
            id,
            username
        FROM tblusers
        WHERE role = 'Medical Technologist'
        AND archivestatus = 0
        ORDER BY username
        `
    );

    return NextResponse.json(rows);

}