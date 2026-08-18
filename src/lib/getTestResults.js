import db from "@/lib/db";

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
    18: "test_hemresult"
};

export default async function getTestResult(testId, visitId) {

    const table = RESULT_TABLES[testId];

    if (!table) {
        throw new Error("Unknown laboratory test.");
    }

    const [rows] = await db.query(
        `
        SELECT *
        FROM ${table}
        WHERE visitid = ?
        ORDER BY id DESC
        LIMIT 1
        `,
        [visitId]
    );

    return rows[0] ?? null;
}