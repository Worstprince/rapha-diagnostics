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
            
            await checkVisitComplete(visitId);
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

            await checkVisitComplete(visitId);
            break;

        case 9: // Semen Analysis

    await db.query(
        `
        INSERT INTO test_semenalysis
        (
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

            v30mins,
            v1hr,
            v2hr,

            spermConcentration,
            spermCount,

            date,
            visitid
        )
        VALUES
        (
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?,
            ?, ?, ?,
            ?, ?,
            CURDATE(),
            ?
        )
        `,
        [
            result.appearance,
            result.volume,
            result.ph,
            result.viscosity,
            result.others,

            result.morphology,
            result.motility,
            result.wbc,
            result.rbc,

            result.motility30min,
            result.motility1hr,
            result.motility2hr,

            result.viability30min,
            result.viability1hr,
            result.viability2hr,

            result.spermConcentration,
            result.spermCount,

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
        
        case 10: // Stool Exam

    await db.query(
        `
        INSERT INTO test_stoolexamresult
        (
            color,
            parasiticOva,
            consistency,
            pussCells,
            bacteria,
            rbc,
            fatGlobules,
            occultBlood,
            others,
            fecalysisNo,
            date,
            visitid
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?)
        `,
        [
            result.color,
            result.parasiticOva,
            result.consistency,
            result.pussCells,
            result.bacteria,
            result.rbc,
            result.fatGlobules,
            result.occultBlood,
            result.others,
            result.fecalysisNo,
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
    
        case 11: // Thyroid Panel

    if (!result.tsh || !result.ft4) {
        return NextResponse.json(
            {
                success: false,
                message: "Complete the Thyroid Panel result."
            },
            {
                status: 400
            }
        );
    }

    await db.query(
        `
        INSERT INTO test_thyroidexamresult
        (
            tsh,
            ft4,
            date,
            visitid
        )
        VALUES
        (?, ?, CURDATE(), ?)
        `,
        [
            result.tsh,
            result.ft4,
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