import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {

        const [rows] = await db.query(
            `
            SELECT
                tblactivitylog.id,
                action,
                description,
                userid,
                datetime,
                username 
            FROM tblactivitylog 
            INNER JOIN tblusers ON tblactivitylog.userid = tblusers.id
            ORDER BY datetime DESC
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