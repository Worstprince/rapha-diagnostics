import db from "@/lib/db";
import { NextResponse } from "next/server";
import checkVisitApproved from "@/lib/checkVisitApproved";
import getTestResult from "@/lib/getTestResults";
import { logActivity } from "@/lib/logActivity";

export async function GET(request, { params }) {

    try {
        const { id: assignmentId } = await params;

        const [assignmentRows] = await db.query(
            `
            SELECT
                pt.*,
                t.name,
                v.doctorid,
                CONCAT(docui.fname, ' ', docui.lname) AS doctorname,
                CONCAT(mtui.fname, ' ', mtui.lname) AS medtechname
            FROM tblpatienttests pt
            INNER JOIN tbltests t
                ON pt.testid = t.id
            INNER JOIN tblpatientvisitation v
                ON v.id = pt.visitid
            LEFT JOIN tblusers docu
                ON docu.id = v.doctorid
            LEFT JOIN tbluserinfo docui
                ON docui.userid = docu.id
            LEFT JOIN tblusers mtu
                ON mtu.id = pt.medtechid
            LEFT JOIN tbluserinfo mtui
                ON mtui.userid = mtu.id
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

            patient: {
                ...patientRows[0],
                doctorId: assignment.doctorid ?? null,
                doctorName: assignment.doctorname || null,
                medtechId: assignment.medtechid ?? null,
                medtechName: assignment.medtechname || null
            },

            test: {
                id: assignment.id,
                visitid: assignment.visitid,
                testid: assignment.testid,
                status: assignment.status,
                name: assignment.name,
                doctorid: assignment.doctorid ?? null,
                doctorName: assignment.doctorname || null,
                medtechid: assignment.medtechid ?? null,
                medtechName: assignment.medtechname || null
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

        const { status, userId } = await request.json();
        const [rows] = await db.query(
            "SELECT visitid FROM tblpatienttests WHERE id = ?",
            [assignmentId]
        );

        const visitationId = rows[0].visitid;
        await db.query(
            `
            UPDATE tblpatienttests
            SET status = ?
            WHERE id = ?
            `,
            [status, assignmentId]
        );
        await checkVisitApproved(visitationId);
        await logActivity(
            userId,
            "Result Approved",
            `Result for assignment ID ${assignmentId} has been approved.`,
            "Laboratory"
        );
        return NextResponse.json({
            message: "Result approved successfully."
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