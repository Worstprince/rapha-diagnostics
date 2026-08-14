import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {

        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Visit ID is required."
                },
                {
                    status: 400
                }
            );
        }

        const [rows] = await db.query(
            `
SELECT
    v.id AS visitId,
    v.patientId,

    p.fname AS patientFname,
    p.mname AS patientMname,
    p.lname AS patientLname,
    p.suffix AS patientSuffix,

    v.visited_at AS visitDate,
    v.status,
    v.priority,

    CONCAT(ui.fname, ' ', ui.lname) AS doctorName,

    pt.id AS patientTestId,
    t.id AS testId,
    t.name AS testName,
    t.price AS testCost,

    rd.name AS referringDoctorName,
    rd.clinic AS referringDoctorClinic,

    v.recorded_at AS recordedAt,
    CONCAT(recorderui.fname, ' ', recorderui.lname) AS recordedBy

FROM tblpatientvisitation v

LEFT JOIN tblpatients p
    ON p.id = v.patientId

LEFT JOIN tblpatienttests pt
    ON pt.visitid = v.id

LEFT JOIN tbltests t
    ON t.id = pt.testid

LEFT JOIN tblusers u
    ON u.id = v.doctorid

LEFT JOIN tblusers recorder
    ON recorder.id = v.recorded_by

LEFT JOIN tbluserinfo recorderui
    ON recorderui.userid = recorder.id

LEFT JOIN tbluserinfo ui
    ON ui.userid = u.id

LEFT JOIN tblreferringdoctors rd
    ON rd.id = v.referringdoctor

WHERE v.id = ?

ORDER BY t.name ASC
            `,
            [id]
        );


        if (rows.length === 0) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Billing record not found."
                },
                {
                    status: 404
                }
            );

        }


const visit = {
    visitId: rows[0].visitId,

    patientId: rows[0].patientId,

    fname: rows[0].patientFname,
    mname: rows[0].patientMname,
    lname: rows[0].patientLname,
    suffix: rows[0].patientSuffix,

    visitDate: rows[0].visitDate,
    status: rows[0].status,
    priority: rows[0].priority,

    doctorName: rows[0].doctorName,

    referringDoctorName: rows[0].referringDoctorName,
    referringDoctorClinic: rows[0].referringDoctorClinic,

    recordedAt: rows[0].recordedAt,
    recordedBy: rows[0].recordedBy,

    tests: rows
        .filter((row) => row.testId !== null)
        .map((row) => ({
            id: row.testId,
            name: row.testName,
            cost: row.testCost
        })),

    totalCost: rows.reduce(
        (total, row) =>
            total + Number(row.testCost || 0),
        0
    )
};


        return NextResponse.json({
            success: true,
            ...visit
        });


    } catch (error) {

        console.error(
            "BILLING DETAILS API ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: error.message
            },
            {
                status: 500
            }
        );

    }
}