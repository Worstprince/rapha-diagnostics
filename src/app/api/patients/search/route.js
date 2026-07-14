import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  if (!search || search.trim().length === 0) {
    return NextResponse.json({ success: true, patients: [] });
  }

  const term = `%${search}%`;

  const [rows] = await db.query(
    `
    SELECT id, fname, mname, lname, suffix, birthdate, sex, civilStatus, mobileNum, email, address
    FROM tblpatients
    WHERE CONCAT(fname, ' ', lname) LIKE ?
    OR fname LIKE ?
    OR lname LIKE ?
    LIMIT 20
    `,
    [term, term, term]
  );

  return NextResponse.json({
    success: true,
    patients: rows
  });
}