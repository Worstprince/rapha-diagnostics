import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {

const {
    patientId,
    assignmentId,
    testId,
    visitId,
    result
} = await request.json();

    switch (testId) {

        case 1: // Blood Typing
        if (!result.bloodType || !result.rhFactor) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Complete the Blood Typing result."
                },
                {
                    status: 400
                }
            );
        }
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

            await db.query(`
                UPDATE tblpatienttests
                SET status = 'Done'
                WHERE id = ?
            `, [assignmentId]);

            break;

        case 2: // Chemistry

    await db.query(
            `
            INSERT INTO test_chemistryresult
            (
                glucose,
                creatinine,
                uricAcid,
                totalCholesterol,
                triglycerides,
                hdlCholesterol,
                ldlCholesterol,
                sgot,
                sgpt,
                totalBilirubin,
                directBilirubin,
                indirectBilirubin,
                hba1c,
                bun,
                date,
                visitid
            )
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?)
            `,
            [
                result.glucose,
                result.creatinine,
                result.uricAcid,
                result.totalCholesterol,
                result.triglycerides,
                result.hdlCholesterol,
                result.ldlCholesterol,
                result.sgot,
                result.sgpt,
                result.totalBilirubin,
                result.directBilirubin,
                result.indirectBilirubin,
                result.hba1c,
                result.bun,
                visitId
            ]
        );

        await db.query(
            `
            UPDATE tblpatienttests
            SET status = 'Done'
            WHERE id = ?
            `,
            [assignmentId]
        );

        break;

        case 3: // Dengue

            if (!result.ns1 || !result.igg || !result.igm) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Complete the Dengue result."
                    },
                    {
                        status: 400
                    }
                );
            }

            await db.query(
                `
                INSERT INTO test_dengueresult
                (
                    ns1,
                    igg,
                    igm,
                    date,
                    visitid
                )
                VALUES
                (?, ?, ?, CURDATE(), ?)
                `,
                [
                    result.ns1,
                    result.igg,
                    result.igm,
                    visitId
                ]
            );

            await db.query(
                `
                UPDATE tblpatienttests
                SET status = 'Done'
                WHERE id = ?
                `,
                [assignmentId]
            );

            break;

        case 4: // FOBT

            if (!result.fobt) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Complete the FOBT result."
                    },
                    {
                        status: 400
                    }
                );
            }

            await db.query(
                `
                INSERT INTO test_fobtresult
                (
                    fobtResult,
                    date,
                    visitid
                )
                VALUES
                (?, CURDATE(), ?)
                `,
                [
                    result.fobt,
                    visitId
                ]
            );

            await db.query(
                `
                UPDATE tblpatienttests
                SET status = 'Done'
                WHERE id = ?
                `,
                [assignmentId]
            );

            break;

        case 6: // Hematology

            await db.query(
        `
        INSERT INTO test_hematologyresult
        (
            hemoglobinMass,
            rbcNumConcentration,
            wbcNumConcentration,
            bleedingTime,
            clottingTime,
            bloodGroup,
            plateletCount,
            hematoCrit,
            bsmp,
            segmenters,
            band,
            juvenile,
            lymphocytes,
            monocytes,
            eosinophils,
            basophils,
            mcv,
            mch,
            mchc,
            rdwCv,
            date,
            other,
            visitid
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?)
        `,
        [
            result.hemoglobin,
            result.rbc,
            result.wbc,
            result.bleedingTime,
            result.clottingTime,
            result.bloodGroup,
            result.platelet,
            result.hematocrit,
            result.bsmp,
            result.segmenters,
            result.band,
            result.juvenile,
            result.lymphocytes,
            result.monocytes,
            result.eosinophils,
            result.basophils,
            result.mcv,
            result.mch,
            result.mchc,
            result.rdw,
            result.others,
            visitId
        ]);
        await db.query(`
                UPDATE tblpatienttests
                SET status = 'Done'
                WHERE id = ?
            `, [assignmentId]);

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