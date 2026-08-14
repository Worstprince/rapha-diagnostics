import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const [rows] = await db.query(
    `
    SELECT id, name, price
    FROM tbltests
    ORDER BY name ASC
    `
  );

  return NextResponse.json({
    success: true,
    tests: rows
  });
}