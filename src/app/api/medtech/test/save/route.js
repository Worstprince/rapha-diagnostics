import db from "@/lib/db";
import { NextResponse } from "next/server";
import checkVisitComplete from "@/lib/checkVisitComplete";


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
            await checkVisitComplete(visitId);
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
                await checkVisitComplete(visitId);
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
            await checkVisitComplete(visitId);
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
            await checkVisitComplete(visitId);
            break;

        case 5: //hbsag
            if (!result.hbsag) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Complete the HBSAG result."
                    },
                    {
                        status: 400
                    }
                );
            }

            await db.query(
                `
                INSERT INTO test_hbsagresult
                (
                    hbsagResult,
                    date,
                    visitid
                )
                VALUES
                (?, CURDATE(), ?)
                `,
                [
                    result.hbsag,
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
            await checkVisitComplete(visitId);
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

        case 7: //ogtt 
            if (!result.fbs || !result.firstHour || !result.secondHour) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Complete the OGTT test."
                    },
                    {
                        status: 400
                    }
                );
            }

            await db.query(
                `
                INSERT INTO test_ogttresult
                (
                    fbs,
                    firstHour,
                    secondHour,
                    date,
                    visitid
                )
                VALUES
                (?, ?, ?, CURDATE(), ?)
                `,
                [
                    result.fbs,
                    result.firstHour,
                    result.secondHour,
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
            await checkVisitComplete(visitId);
            break;
  
        case 8: // Pregnancy Test

            if (!result.pregnancyResult) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Complete the Pregnancy Test result."
                    },
                    {
                        status: 400
                    }
                );
            }

            await db.query(
                `
                INSERT INTO test_pregnancytestresult
                (
                    ptHCGSerum,
                    date,
                    visitid
                )
                VALUES
                (?, CURDATE(), ?)
                `,
                [
                    result.pregnancyResult,
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

        case 9: // Semen Analysis

    if (
        !result.appearance ||
        !result.volume ||
        !result.ph ||
        !result.viscosity ||
        !result.morphology ||
        !result.motility ||
        !result.wbc ||
        !result.rbc ||
        !result.viability30min ||
        !result.viability1hour ||
        !result.viability2hours ||
        !result.spermConcentration ||
        !result.spermCount ||
        !result.motilityRapid ||
        !result.motilitySlow ||
        !result.motilitySlowForward ||
        !result.motilityNoForward ||
        !result.motilityNoMovement
    ) {
        return NextResponse.json(
            {
                success: false,
                message: "Complete the Semen Analysis result."
            },
            {
                status: 400
            }
        );
    }

        await db.query(
            `
            INSERT INTO test_semenanalysisresult
            (
                visitid,
                appearance,
                volume,
                ph,
                viscosity,
                others,
                morphology,
                motility,
                wbc,
                rbc,
                m30mins,
                m1hr,
                m2hr,
                v30m,
                v1hr,
                v2hr
            )
            VALUES
            (
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?
            )
            `,
            [
                visitId,
                result.appearance,
                result.volume,
                result.ph,
                result.viscosity,
                result.others,
                result.morphology,
                result.motility,
                result.wbc,
                result.rbc,
                result.m30mins,
                result.m1hr,
                result.m2hr,
                result.v30m,
                result.v1hr,
                result.v2hr
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