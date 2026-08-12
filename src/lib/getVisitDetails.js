// lib/queries/getVisitDetails.js

import db from "@/lib/db";
import { TEST_RESULT_TABLES, normalizeTestName } from "@/lib/testResultTables";

const NOTE_STATUS_LABEL = {
    draft: "Draft",
    finalized: "Finalized",
    amended: "Finalized",
};

export default async function getVisitDetails(visitId) {
    try {
        // 1. Patient + visit info
        const [visitRows] = await db.query(
            `
            SELECT
                v.id AS visitId,
                p.fname,
                p.mname,
                p.lname,
                v.visited_at,
                v.priority
            FROM tblpatientvisitation AS v
            INNER JOIN tblpatients AS p
                ON p.id = v.patientId
            WHERE v.id = ?
            `,
            [visitId]
        );

        const visitRow = visitRows[0];
        if (!visitRow) return null;

        // 2. Which tests were requested for this visit
        const [testRows] = await db.query(
            `
            SELECT t.name AS testName
            FROM tblpatienttests AS pt
            INNER JOIN tbltests AS t
                ON t.id = pt.testid
            WHERE pt.visitid = ?
            `,
            [visitId]
        );

        // 3. Pull each test's result values from its dedicated table
        const tests = [];
        for (const { testName } of testRows) {
            const key = normalizeTestName(testName);
            const config = TEST_RESULT_TABLES[key];

            if (!config) {
                // No results table wired up in the config yet for this test type
                tests.push({ id: key, testType: testName, values: [] });
                continue;
            }

            const [resultRows] = await db.query(
                `SELECT * FROM ${config.table} WHERE visitid = ?`,
                [visitId]
            );
            const resultRow = resultRows[0];

            const values = config.fields.map((f) => {
                const rawValue = resultRow?.[f.column] ?? "—";
                return {
                    label: f.label,
                    value: String(rawValue),
                    critical: f.isCritical ? f.isCritical(rawValue) : false,
                };
            });

            tests.push({ id: key, testType: testName, values });
        }

        // 4. Existing note draft, if any
        const [noteRows] = await db.query(
            `
            SELECT findings, impression, recommendation, status, critical_acknowledged
            FROM tblvisitnotes
            WHERE visitid = ?
            `,
            [visitId]
        );
        const noteRow = noteRows[0];

        return {
            id: String(visitRow.visitId),
            patientName: [visitRow.fname, visitRow.mname, visitRow.lname]
                .filter(Boolean)
                .join(" "),
            initials: `${visitRow.fname?.[0] ?? ""}${visitRow.lname?.[0] ?? ""}`.toUpperCase(),
            visitDate: new Date(visitRow.visited_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
            priority: visitRow.priority,
            status: noteRow ? NOTE_STATUS_LABEL[noteRow.status] ?? "Draft" : "Awaiting note",
            tests,
            initialSections: {
                findings: noteRow?.findings ?? "",
                impression: noteRow?.impression ?? "",
                recommendation: noteRow?.recommendation ?? "",
            },
            criticalAcknowledged: Boolean(noteRow?.critical_acknowledged),
        };
    } catch (err) {
        console.error("getVisitDetails failed:", err);
        throw err;
    }
}
