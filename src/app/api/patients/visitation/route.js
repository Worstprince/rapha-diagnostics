import db from "@/lib/db";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/logActivity";

export async function POST(request) {
    const body = await request.json();

    const {
        patientId,
        doctorId,
        medtechId,
        referringDoctor,
        clinic,
        visitDate,
        priority,
        notes,
        tests,
        userId
    } = body;

    // Basic validation
    if (
        !patientId ||
        !visitDate ||
        !priority ||
        !medtechId ||
        !Array.isArray(tests) ||
        tests.length === 0
    ) {
        return NextResponse.json(
            {
                success: false,
                message: "Missing required fields."
            },
            { status: 400 }
        );
    }

    const resolvedDoctorId =
        doctorId &&
        doctorId !== "Walk-in / none"
            ? doctorId
            : null;

    const resolvedMedtechId =
        medtechId
            ? medtechId
            : null;

    const connection = await db.getConnection();

    try {

        let referringDoctorId = null;

        if (
            referringDoctor &&
            referringDoctor.trim() !== "" &&
            referringDoctor !== "Walk-in / none"
        ) {

            const [referringRows] =
                await connection.query(
                    `
                    SELECT id
                    FROM tblreferringdoctors
                    WHERE name = ?
                    LIMIT 1
                    `,
                    [referringDoctor.trim()]
                );

            if (referringRows.length > 0) {

                referringDoctorId =
                    referringRows[0].id;

            } else {

                const [insertResult] =
                    await connection.query(
                        `
                        INSERT INTO tblreferringdoctors
                        (name, clinic)
                        VALUES (?, ?)
                        `,
                        [
                            referringDoctor.trim(),
                            clinic &&
                            clinic.trim() !== ""
                                ? clinic.trim()
                                : null,
                        ]
                    );

                referringDoctorId =
                    insertResult.insertId;
            }
        }

        await connection.beginTransaction();

        // Insert visitation record
        const [visitResult] =
            await connection.query(
                `
                INSERT INTO tblpatientvisitation
                (
                    patientId,
                    visited_at,
                    doctorid,
                    status,
                    priority,
                    notes,
                    referringdoctor,
                    recorded_at,
                    recorded_by
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)
                `,
                [
                    patientId,
                    visitDate,
                    resolvedDoctorId,
                    "Pending",
                    priority,
                    notes ?? null,
                    referringDoctorId,
                    userId
                ]
            );

        const visitId =
            visitResult.insertId;

        // Insert selected tests with assigned medtech
        const testRows = tests.map(
            (testId) => [
                visitId,
                testId,
                resolvedMedtechId,
                "Pending"
            ]
        );

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

        console.error(
            "Error creating visitation:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to create visitation."
            },
            { status: 500 }
        );

    } finally {

        connection.release();

    }
}