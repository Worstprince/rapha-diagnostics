import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {

    const [rows] = await db.query(
        `
        SELECT 
            u.id,
            u.username,
            CONCAT(ui.fname, ' ', ui.lname) AS name
        FROM tblusers u
        LEFT JOIN tbluserinfo ui
            ON ui.userid = u.id
        WHERE u.role = 'Medical Technologist'
        AND u.archivestatus = 0
        ORDER BY u.username;
        `
    );

    return NextResponse.json(rows);

}