import db from "@/lib/db";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/logActivity";


export async function POST(request) {
    try {
 
    const patient = await request.json();

    const [rows] = await db.query(
        `
        SELECT id 
        FROM tblpatients
        WHERE fname = ?
        AND lname = ?
        AND birthdate = ?
        `,
        [
            patient.firstName,
            patient.lastName,
            patient.birthDate
        ]
    );

    if (rows.length > 0) {

        return NextResponse.json(
            {
                success: false,
                message: "Patient already exists."
            },
            {
                status: 409
            }
        );

    }
    
    await db.query(
        `
        INSERT INTO tblpatients
        (
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

        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            patient.firstName,
            patient.middleName,
            patient.lastName,
            patient.suffix,
            patient.birthDate,
            patient.sex,
            patient.civilStatus,
            patient.mobileNumber,
            patient.email,
            patient.address
        ]
    );

    await logActivity(
        patient.userId , //to be changed to userId from session
        "Patient registration",
        `Registered new patient: ${patient.firstName} ${patient.lastName}`
    );

    return NextResponse.json({
        success: true
    });

}

