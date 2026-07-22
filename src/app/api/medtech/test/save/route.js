import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {

    const { testId, visitId, result } = await request.json();

    switch (testId) {

        case 1: // Blood Typing

            await db.query(`
                INSERT INTO test_bloodtyperesult
                (
                    visitid,
                    bloodtype,
                    rhfactor
                )
                VALUES (?, ?, ?)
            `, [
                visitId,
                result.bloodType,
                result.rhFactor
            ]);

            break;

        case 2: // Chemistry

            await db.query();

            break;

        case 3: // Hematology

            await db.query();

            break;

        default:

            return NextResponse.json(
                { message: "Unknown test." },
                { status: 400 }
            );

    }

    return NextResponse.json({
        success: true
    });

}