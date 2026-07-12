import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {

    const patient = await request.json();

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

    return NextResponse.json({
        success: true
    });

}