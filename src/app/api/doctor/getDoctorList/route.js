import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const [rows] = await db.query(
    `
    SELECT idtbluserinfo AS id, fname, lname
    FROM tbluserinfo
    ORDER BY lname ASC
    `
  );

  return NextResponse.json({
    success: true,
    doctors: rows
  });
}