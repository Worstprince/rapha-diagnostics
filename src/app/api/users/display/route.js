import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [rows] = await db.query(
            `
            SELECT id, username, password, role, created_at, archivestatus 
            FROM tblusers
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