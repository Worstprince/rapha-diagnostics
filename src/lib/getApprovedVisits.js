import db from "@/lib/db";
import { NARRATIVE_OPTIONAL_TESTS, normalizeTestName } from "@/lib/testResultTables";

const NOTE_STATUS_LABEL = {
    draft: "Draft",
    finalized: "Finalized",
    amended: "Finalized", // still shows as Finalized in the queue; amendment history lives elsewhere
};

// A visit only needs a diagnostic note if at least one of its tests could
// carry a result worth clinical interpretation. If every test on the visit
// is in NARRATIVE_OPTIONAL_TESTS (currently just Blood Type and Pregnancy —
// tests with no isCritical concept at all), there's nothing to document,
// so the visit never enters the queue rather than needing a manual dismiss.
function visitNeedsNarrative(testNames) {
    return testNames.some(
        (name) => !NARRATIVE_OPTIONAL_TESTS.has(normalizeTestName(name))
    );
}

export default async function getApprovedVisits() {
    try {
        const [rows] = await db.query(
            `
            SELECT
                v.id AS visitId,
                p.fname,
                p.mname,
                p.lname,
                v.visited_at,
                v.priority,
                GROUP_CONCAT(DISTINCT t.name ORDER BY t.name SEPARATOR ', ') AS tests,
                n.status AS noteStatus
            FROM raphaschema.tblpatients AS p
            INNER JOIN tblpatientvisitation AS v
                ON p.id = v.patientId
            INNER JOIN tblpatienttests AS pt
                ON pt.visitid = v.id
            INNER JOIN tbltests AS t
                ON t.id = pt.testid
            LEFT JOIN tblvisitnotes AS n
                ON n.visitid = v.id
            WHERE v.status = 'Approved'
            GROUP BY v.id, p.fname, p.mname, p.lname, v.visited_at, v.priority, n.status
            ORDER BY
                CASE v.priority
                    WHEN 'Emergency' THEN 1
                    WHEN 'Routine'   THEN 2
                    ELSE 3
                END,
                v.visited_at ASC;
            `
        );

        return rows
            .map((row) => {
                const tests = row.tests ? row.tests.split(", ") : [];
                return {
                    id: String(row.visitId),
                    patientName: [row.fname, row.mname, row.lname]
                        .filter(Boolean)
                        .join(" "),
                    initials: `${row.fname?.[0] ?? ""}${row.lname?.[0] ?? ""}`.toUpperCase(),
                    tests,
                    visitDate: new Date(row.visited_at).toLocaleString("en-US", {
                        dateStyle: "short",
                        timeStyle: "short",
                    }),
                    priority: row.priority,
                    status: row.noteStatus
                        ? NOTE_STATUS_LABEL[row.noteStatus] ?? "Draft"
                        : "Awaiting note",
                };
            })
            .filter((visit) => visitNeedsNarrative(visit.tests));
    } catch (err) {
        console.error("getApprovedVisits failed:", err);
        throw err;
    }
}