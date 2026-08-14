import db from "@/lib/db";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/logActivity";

export async function POST(request) {
  const body = await request.json();

  const {
    patientId,
    doctorId,
    referringDoctor,
    clinic,
    visitDate,
    priority,
    notes,
    tests, 
    userId
  } = body;

  // Basic validation
  if (!patientId || !visitDate || !priority || !Array.isArray(tests) || tests.length === 0) {
    return NextResponse.json(
      { success: false, message: "Missing required fields." },
      { status: 400 }
    );
  }

  // "Walk-in / none" isn't a real doctor id — store as null
  const resolvedDoctorId =
    doctorId && doctorId !== "Walk-in / none" ? doctorId : null;

  const connection = await db.getConnection();

  try {

    let referringDoctorId = null;

    if (
        referringDoctor &&
        referringDoctor.trim() !== "" &&
        referringDoctor !== "Walk-in / none"
    ) {

        const [referringRows] = await connection.query(
            `
            SELECT id
            FROM tblreferringdoctors
            WHERE name = ?
            LIMIT 1
            `,
            [referringDoctor.trim()]
        );


        if (referringRows.length > 0) {

            // if doctor exists
            referringDoctorId = referringRows[0].id;

        } else {

            // if doctor doesn't exist, create one
            const [insertResult] = await connection.query(
                `
                INSERT INTO tblreferringdoctors
                (name, clinic)
                VALUES (?, ?)
                `,
                [
                    referringDoctor.trim(),
                    clinic && clinic.trim() !== "" ? clinic.trim() : null,
                ]
            );

            referringDoctorId = insertResult.insertId;

        }

    }

    await connection.beginTransaction();

    // Insert the visitation record
    const [visitResult] = await connection.query(
      `
      INSERT INTO tblpatientvisitation
      (patientId, visited_at, doctorid, status, priority, notes, referringdoctor, recorded_at, recorded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)
      `,
      [patientId, visitDate, resolvedDoctorId, "Pending", priority, notes ?? null, referringDoctorId, userId]
    );

    const visitId = visitResult.insertId;

    // Insert one row per selected test, linked to this visit
    const testRows = tests.map((testId) => [visitId, testId, null, "Pending"]);

    await connection.query(
      `
      INSERT INTO tblpatienttests
      (visitid, testid, medtechid, status)
      VALUES ?
      `,
      [testRows]
    );

    await connection.commit();

    await logActivity(
      userId,
      "Visitation created",
      `Created new visitation for patient ID: ${patientId}`,
      "Patient Management"
    );

    return NextResponse.json({
      success: true,
      visitId,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error creating visitation:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create visitation." },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}