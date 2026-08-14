import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [rows] = await db.query(`
            SELECT
                id,
                fname,
                mname,
                lname,
                suffix,
                birthdate,
                sex,
                civilStatus,
                mobileNum,
                email,
                address
            FROM tblpatients
            ORDER BY lname, fname
        `);

        return NextResponse.json({
            success: true,
            patients: rows
        });

    } catch (error) {

        console.error("PATIENT SEARCH API ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to load patients."
            },
            {
                status: 500
            }
        );
    }
}