import db from "@/lib/db";
import { NextResponse } from "next/server";

const RESULT_TABLES = {
    1: "test_bloodtyperesult",
    2: "test_hba1cresult",
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
    13: "test_vdrlresult",
    14: "test_hbsagvdrlresult",
    15: "test_antihavresult",
    16: "test_rbsresult",
    17: "test_antihbsresult",
    18: "test_hemresult",
    19: "test_fbsresult",
    20: "test_hivresult",
    21: "test_psaresult",
    22: "test_typhidotresult",
    23: "test_electrolyteresult",
    24: "test_hbsagpthcgresult"
};

export async function GET(request, { params }) {

    try {

        const { id: patientId } = await params;

        const { searchParams } = new URL(request.url);

        const testId = Number(searchParams.get("testId"));
        const field = searchParams.get("field");

        const table = RESULT_TABLES[testId];

        if (!table) {
            return NextResponse.json(
                { message: "Invalid test." },
                { status: 400 }
            );
        }

        if (!field) {
            return NextResponse.json(
                { message: "Result field is required." },
                { status: 400 }
            );
        }

        const [rows] = await db.query(
            `
            SELECT
                r.date,
                r.visitid,
                r.${field} AS value
            FROM ${table} r
            INNER JOIN tblpatientvisitation v
                ON r.visitid = v.id
            WHERE v.patientid = ?
            ORDER BY r.date ASC
            `,
            [patientId]
        );

        return NextResponse.json(rows);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                message: "Failed to load chart data."
            },
            {
                status: 500
            }
        );

    }

}