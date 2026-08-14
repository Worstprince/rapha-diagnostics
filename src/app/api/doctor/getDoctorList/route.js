import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const [rows] = await db.query(
    `
    SELECT u.id, ui.idtbluserinfo, ui.fname, ui.lname
    FROM tblusers u
    LEFT JOIN tbluserinfo ui ON u.id = ui.userid
    WHERE role = 'Physician' OR role = 'Pathologist'
    ORDER BY lname ASC;
    `
  );

  return NextResponse.json({
    success: true,
    doctors: rows
  });
}