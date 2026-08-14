// lib/queries/getVisitDetails.js

import db from "@/lib/db";
import {
    TEST_RESULT_TABLES,
    NARRATIVE_OPTIONAL_TESTS,
    normalizeTestName,
} from "@/lib/testResultTables";

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

        // A visit made up entirely of tests with no critical-value concept
        // (currently just Blood Type and Pregnancy) never needed a note in
        // the queue — and for the same reason it's blocked here too, even
        // for someone hitting the URL directly. This runs unconditionally,
        // regardless of whether a note already happens to exist for the
        // visit.
        const allOptional = testRows.every(({ testName }) =>
            NARRATIVE_OPTIONAL_TESTS.has(normalizeTestName(testName))
        );
        if (allOptional) return null;

        // 3. Pull each test's result values from its dedicated table
        const tests = [];
        for (const { testName } of testRows) {
            const key = normalizeTestName(testName);
            const config = TEST_RESULT_TABLES[key];

            if (!config) {
                tests.push({ id: key, testType: testName, values: [] });
                continue;
            }

            const [resultRows] = await db.query(
                `SELECT * FROM ${config.table} WHERE visitid = ?`,
                [visitId]
            );
            const resultRow = resultRows[0];

            const values = config.fields.map((f) => {
                const dbValue = resultRow?.[f.column];
                const hasValue =
                    dbValue !== null && dbValue !== undefined && String(dbValue).trim() !== "";
                const displayValue = hasValue ? dbValue : "—";

                return {
                    label: f.label,
                    value: String(displayValue),
                    critical: hasValue && f.isCritical ? f.isCritical(dbValue) : false,
                };
            });

            tests.push({ id: key, testType: testName, values });
        }

        // 4. Existing note draft, if any — including who/when it was finalized
        const [noteRows] = await db.query(
            `
            SELECT
                n.findings,
                n.impression,
                n.recommendation,
                n.status,
                n.critical_acknowledged,
                n.finalized_at,
                u.username AS finalizedByUsername
            FROM tblvisitnotes AS n
            LEFT JOIN tblusers AS u
                ON u.id = n.finalizedby
            WHERE n.visitid = ?
            `,
            [visitId]
        );
        const noteRow = noteRows[0];

        // 5. Comment and attachment counts
        const [commentCountRows] = await db.query(
            `SELECT COUNT(*) AS count FROM tblvisitnotecomments WHERE visitid = ?`,
            [visitId]
        );
        const [attachmentCountRows] = await db.query(
            `SELECT COUNT(*) AS count FROM tblvisitnoteattachments WHERE visitid = ?`,
            [visitId]
        );

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
            finalizedAt: noteRow?.finalized_at
                ? new Date(noteRow.finalized_at).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                  })
                : null,
            finalizedBy: noteRow?.finalizedByUsername ?? null,
            commentCount: commentCountRows[0]?.count ?? 0,
            attachmentCount: attachmentCountRows[0]?.count ?? 0,
        };
    } catch (err) {
        console.error("getVisitDetails failed:", err);
        throw err;
    }
}