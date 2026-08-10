import db from "@/lib/db";

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

const RESULT_FIELDS = {

    1: [],

    2: [
        "glucose",
        "creatinine",
        "uricAcid",
        "totalCholesterol",
        "triglycerides",
        "hdlCholesterol",
        "ldlCholesterol",
        "sgot",
        "sgpt",
        "totalBilirubin",
        "directBilirubin",
        "indirectBilirubin",
        "hba1c",
        "bun"
    ]

};

export default async function getTestTrend(
    patientId,
    testId,
    field
) {

    const table = RESULT_TABLES[testId];

    if (!table) {
        throw new Error("Unknown laboratory test.");
    }

    if (!RESULT_FIELDS[testId]?.includes(field)) {
        throw new Error("Invalid laboratory field.");
    }

    const [rows] = await db.query(
        `
        SELECT
            r.visitid,
            v.visited_at AS date,
            r.${field} AS value
        FROM ${table} r
        INNER JOIN tblpatientvisitation v
            ON r.visitid = v.id
        INNER JOIN tblpatienttests pt
            ON pt.visitid = r.visitid
            AND pt.testid = ?
        WHERE v.patientid = ?
            AND r.${field} IS NOT NULL
            AND r.${field} != ''
        ORDER BY v.visited_at ASC
        `,
        [
            testId,
            patientId
        ]
    );

    return rows;
}