import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const [rows] = await db.query(`
            SELECT id, name, clinic
            FROM tblreferringdoctors
            ORDER BY name ASC
        `);
        return NextResponse.json({referringDoctors: rows});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch referring doctors." }, { status: 500 });
    }
}