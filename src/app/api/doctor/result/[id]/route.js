import db from "@/lib/db";
import { NextResponse } from "next/server";
import checkVisitApproved from "@/lib/checkVisitApproved";
import getTestResult from "@/lib/getTestResults";

export async function GET(request, { params }) {

    try {
        const { id: assignmentId } = await params;

const [assignmentRows] = await db.query(
    `
    SELECT
        pt.*,
        t.name,
        med.username AS medtechName,
        doc.username AS doctorName
    FROM tblpatienttests pt

    INNER JOIN tbltests t
        ON pt.testid = t.id

    LEFT JOIN tblusers med
        ON pt.medtechid = med.id

    LEFT JOIN tblusers doc
        ON pt.doctorid = doc.id

    WHERE pt.id = ?
    `,
    [assignmentId]
);

        if (assignmentRows.length === 0) {

            return NextResponse.json(
                {
                    message: "Assignment not found."
                },
                {
                    status: 404
                }
            );

        }

        const assignment = assignmentRows[0];

        const [patientRows] = await db.query(
            `
            SELECT
                p.id AS patientid,
                CONCAT(p.fname,' ',p.lname) AS name,
                p.birthdate,
                TIMESTAMPDIFF(YEAR,p.birthdate,CURDATE()) AS age,
                p.sex,
                p.address,
                p.mobilenum
            FROM tblpatientvisitation v
            INNER JOIN tblpatients p
                ON v.patientid = p.id
            WHERE v.id = ?
            `,
            [assignment.visitid]
        );

        if (patientRows.length === 0) {

            return NextResponse.json(
                {
                    message: "Patient not found."
                },
                {
                    status: 404
                }
            );

        }

        const result = await getTestResult(
            assignment.testid,
            assignment.visitid
        );


        if (!result) {
            return NextResponse.json(
                {
                    message: "Laboratory result not found."
                },
                {
                    status: 404
                }
            );
        }

        return NextResponse.json({

            patient: patientRows[0],

test: {
    id: assignment.id,
    visitid: assignment.visitid,
    testid: assignment.testid,
    status: assignment.status,
    name: assignment.name,
    medtechName: assignment.medtechName,
    doctorName: assignment.doctorName
},

            result

        });

    }
    catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                message: "Internal server error."
            },
            {
                status: 500
            }
        );

    }

}

export async function PATCH(request, { params }) {
    try {
        const { id: assignmentId } = await params;

        const { status, doctorId } = await request.json();

        if (!doctorId) {
            return NextResponse.json(
                {
                    message: "Doctor ID is required."
                },
                {
                    status: 400
                }
            );
        }

        const [rows] = await db.query(
            "SELECT visitid FROM tblpatienttests WHERE id = ?",
            [assignmentId]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                {
                    message: "Assignment not found."
                },
                {
                    status: 404
                }
            );
        }

        const visitationId = rows[0].visitid;

        await db.query(
            `
            UPDATE tblpatienttests
            SET
                status = ?,
                doctorid = ?
            WHERE id = ?
            `,
            [
                status,
                doctorId,
                assignmentId
            ]
        );

        await checkVisitApproved(visitationId);

        return NextResponse.json({
            message: "Result approved successfully."
        });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                message: "Internal server error."
            },
            {
                status: 500
            }
        );
    }
}