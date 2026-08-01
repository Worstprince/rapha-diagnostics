import db from "@/lib/db";
import { NextResponse } from "next/server";

const RESULT_TABLES = {
    1: "test_bloodtyperesult",
    2: "test_chemistryresult",
    3: "test_dengueresult",
    4: "test_fobtresult",
    5: "test_hbsagresult",
    6: "test_hematologyresult",
    7: "test_ogttresult",
    8: "test_pregnancytestresult",
    9: "test_semenalysis",
    10: "test_stoolexamresult",
    11: "test_thyroidexamresult",
    12: "test_urinalysisresult",
    13: "test_vdrlresult"
};

export async function GET(request, { params }) {

    try {
        const { id: assignmentId } = await params;

        const [assignmentRows] = await db.query(
            `
            SELECT
                pt.*,
                t.name
            FROM tblpatienttests pt
            INNER JOIN tbltests t
                ON pt.testid = t.id
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

        const table = RESULT_TABLES[assignment.testid];

        if (!table) {

            return NextResponse.json(
                {
                    message: "Unknown laboratory test."
                },
                {
                    status: 400
                }
            );

        }

        const [resultRows] = await db.query(
            `
            SELECT *
            FROM ${table}
            WHERE visitid = ?
            ORDER BY id DESC
            LIMIT 1
            `,
            [assignment.visitid]
        );

        if (resultRows.length === 0) {

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
                name: assignment.name
            },

            result: resultRows[0]

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

        const { status } = await request.json();

        await db.query(
            `
            UPDATE tblpatienttests
            SET status = ?
            WHERE id = ?
            `,
            [status, assignmentId]
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