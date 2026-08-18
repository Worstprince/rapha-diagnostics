import db from "@/lib/db";
import { NextResponse } from "next/server";
import checkVisitComplete from "@/lib/checkVisitComplete";
import saveTestResult from "@/lib/saveTestResult";
import { logActivity } from "@/lib/logActivity";

export async function POST(request) {
    const body = await request.json();

    const {
        assignmentId,
        testId,
        visitId,
        result,
        userId,
        hasExistingResult
    } = body;

    switch (testId) {

        case 1:

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

            await saveTestResult({

                table: "test_bloodtyperesult",

                visitId,

                data: {
                    bloodtype: result.bloodType,
                    rhfactor: result.rhFactor
                }

            });

            break;

        case 2: // Chemistry

            await saveTestResult({

                table: "test_hba1cresult",

                visitId,

                data: {
                    glucose: result.glucose,
                    creatinine: result.creatinine,
                    uricAcid: result.uricAcid,
                    totalCholesterol: result.totalCholesterol,
                    triglycerides: result.triglycerides,
                    hdlCholesterol: result.hdlCholesterol,
                    ldlCholesterol: result.ldlCholesterol,
                    sgot: result.sgot,
                    sgpt: result.sgpt,
                    totalBilirubin: result.totalBilirubin,
                    directBilirubin: result.directBilirubin,
                    indirectBilirubin: result.indirectBilirubin,
                    hba1c: result.hba1c,
                    bun: result.bun,
                    date: new Date()
                }

            });

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

            await saveTestResult({

                table: "test_dengueresult",

                visitId,

                data: {
                    ns1: result.ns1,
                    igg: result.igg,
                    igm: result.igm,
                    date: new Date()
                }

            });

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

            await saveTestResult({

                table: "test_fobtresult",

                visitId,

                data: {
                    fobtResult: result.fobt,
                    date: new Date()
                }

            });
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

            await saveTestResult({

                table: "test_hbsagresult",

                visitId,

                data: {
                    hbsagResult: result.hbsag,
                    date: new Date()
                }

            });
            break;

        case 6: // Hematology

            await saveTestResult({

                table: "test_hematologyresult",

                visitId,

                data: {
                    hemoglobinMass: result.hemoglobin,
                    rbcNumConcentration: result.rbc,
                    wbcNumConcentration: result.wbc,
                    bleedingTime: result.bleedingTime,
                    clottingTime: result.clottingTime,
                    bloodGroup: result.bloodGroup,
                    plateletCount: result.platelet,
                    hematoCrit: result.hematocrit,
                    bsmp: result.bsmp,
                    segmenters: result.segmenters,
                    band: result.band,
                    juvenile: result.juvenile,
                    lymphocytes: result.lymphocytes,
                    monocytes: result.monocytes,
                    eosinophils: result.eosinophils,
                    basophils: result.basophils,
                    mcv: result.mcv,
                    mch: result.mch,
                    mchc: result.mchc,
                    rdwCv: result.rdw,
                    date: new Date(),
                    other: result.others
                }

            });
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

            await saveTestResult({

                table: "test_ogttresult",

                visitId,

                data: {
                    fbs: result.fbs,
                    firstHour: result.firstHour,
                    secondHour: result.secondHour,
                    date: new Date()
                }

            });
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

            await saveTestResult({

                table: "test_pregnancytestresult",

                visitId,

                data: {
                    ptHCGSerum: result.pregnancyResult,
                    date: new Date()
                }

            });
            break;

        case 9: // Semen Analysis

            await saveTestResult({

                table: "test_semenalysis",

                visitId,

                data: {
                    appearance: result.appearance,
                    volume: result.volume,
                    ph: result.ph,
                    viscosity: result.viscosity,
                    others: result.others,

                    morphology: result.morphology,
                    motility: result.motility,
                    wbc: result.wbc,
                    rbc: result.rbc,

                    m30mins: result.motility30min,
                    m1hr: result.motility1hr,
                    m2hr: result.motility2hr,

                    v30mins: result.viability30min,
                    v1hr: result.viability1hr,
                    v2hr: result.viability2hr,

                    spermConcentration: result.spermConcentration,
                    spermCount: result.spermCount,

                    date: new Date()
                }}
            );
            break;

        case 10: // Stool Exam

    await saveTestResult({

        table: "test_stoolexamresult",

        visitId,

        data: {
            color: result.color,
            parasiticOva: result.parasiticOva,
            consistency: result.consistency,
            pussCells: result.pussCells,
            bacteria: result.bacteria,
            rbc: result.rbc,
            fatGlobules: result.fatGlobules,
            occultBlood: result.occultBlood,
            others: result.others,
            fecalysisNo: result.fecalysisNo,
            date: new Date()
        }

    });

    break;   
        
        case 11: // Thyroid Panel

            if (!result.tsh || !result.ft4 || !result.t3 || !result.t4) {
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

            await saveTestResult({

                table: "test_thyroidexamresult",
                visitId,

                data: {
                    tsh: result.tsh,
                    ft4: result.ft4,
                    t3: result.t3,
                    t4: result.t4,
                    date: new Date()
                }

            });
            break;
    
        case 12: // Urinalysis

            await saveTestResult({

                table: "test_urinalysisresult",

                visitId,

                data: {
                    color: result.color,
                    transparency: result.transparency,
                    reaction: result.reaction,
                    sugar: result.sugar,
                    albumin: result.albumin,
                    specificGravity: result.specificGravity,
                    pregnancytest: result.pregnancyTest,
                    others: result.others,
                    epithelialCells: result.epithelialCells,
                    mucusThread: result.mucusThread,
                    pus: result.pus,
                    rbc: result.rbc,
                    renalCells: result.renalCells,
                    cast: result.cast,
                    crystal: result.crystal,
                    bacteria: result.bacteria,
                    date: new Date()
                }

            });

            break;

        case 13: // VDRL

            await saveTestResult({

                table: "test_vdrlresult",

                visitId,

                data: {
                    vdrl: result.vdrl,
                    date: new Date()
                }

            });

            break;

        case 14: // HBSAG and VDRL

            await saveTestResult({

                table: "test_hbsagvdrlresult",

                visitId,

                data: {
                    igg: result.igg,
                    igm: result.igm,
                    date: new Date()
                }

            });

            break;

        case 15: //ANTI HAV

            await saveTestResult({

                table: "test_antihavresult",

                visitId,

                data: {
                    antihav: result.antihav,
                    date: new Date()
                }

            });

            break;

        case 16: // RBS

            await saveTestResult({

                table: "test_rbsresult",

                visitId,

                data: {
                    siUnit: result.siUnit,
                    conventionalUnit: result.conventionalUnit,
                    date: new Date()
                }

            });

            break;
        
        case 17: // antihbs

            await saveTestResult({

                table: "test_antihbsresult",

                visitId,

                data: {
                    antiHBS: result.antiHBS,
                    value: result.value,
                    date: new Date()
                }

            });

            break;

        case 18: // hem

            await saveTestResult({

                table: "test_hemresult",

                visitId,

                data: {
                    rbs: result.rbs,
                    creatinine: result.creatinine,
                    uricAcid: result.uricAcid,
                    totalCholesterol: result.totalCholesterol,
                    triglycerides: result.triglycerides,
                    hdlCholesterol: result.hdlCholesterol,
                    ldlCholesterol: result.ldlCholesterol,
                    sgot: result.sgot,
                    sgpt: result.sgpt,
                    totalBilirubin: result.totalBilirubin,
                    directBilirubin: result.directBilirubin,
                    indirectBilirubin: result.indirectBilirubin,
                    hba1c: result.hba1c,
                    bun: result.bun,
                    date: new Date()
                }

            });

            break;
     
        case 19: // fbs

            await saveTestResult({

                table: "test_fbsresult",

                visitId,

                data: {
                    glucose: result.glucose,
                    date: new Date()
                }

            });

            break;

        case 20: // hiv

            await saveTestResult({

                table: "test_hivresult",

                visitId,

                data: {
                    hiv: result.hiv,
                    date: new Date()
                }

            });

            break;

        case 21: // psa

            await saveTestResult({

                table: "test_psaresult",

                visitId,

                data: {
                    psa: result.psa,
                    date: new Date()
                }

            });

            break;

        case 22: // typhidot

            await saveTestResult({

                table: "test_typhidotresult",

                visitId,

                data: {
                    typhidot: result.typhidot,
                    date: new Date()
                }

            });

            break;        
        
        case 23: // electrolyte

            await saveTestResult({

                table: "test_electrolyteresult",

                visitId,

                data: {
                    sodium: result.sodium,
                    potassium: result.potassium,
                    calcium: result.calcium,
                    magnesium: result.magnesium,
                    date: new Date()
                }

            });

            break;


    default:

            return NextResponse.json(
                { message: "Unknown test." },
                { status: 400 }
            );

    }

    await db.query(
    `
    UPDATE tblpatienttests
    SET status='Done'
    WHERE id=?
    `,
    [assignmentId]
    );

    await checkVisitComplete(visitId);
await logActivity(
    userId,
    hasExistingResult ? "Update Test Result" : "Save Test Result",
    hasExistingResult
        ? `Updated test result for test ID: ${testId}`
        : `Saved test result for test ID: ${testId}`,
    "Test Management"
);
    return NextResponse.json({
        success: true
    });

}