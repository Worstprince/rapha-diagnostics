import db from "@/lib/db";

const NOTE_STATUS_LABEL = {
    draft: "Draft",
    finalized: "Finalized",
    amended: "Finalized", // still shows as Finalized in the queue; amendment history lives elsewhere
};

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
                    WHEN 'Urgent'    THEN 2
                    WHEN 'Routine'   THEN 3
                    ELSE 4
                END,
                v.visited_at ASC;
            `
        );

        return rows.map((row) => ({
            id: String(row.visitId),
            patientName: [row.fname, row.mname, row.lname]
                .filter(Boolean)
                .join(" "),
            initials: `${row.fname?.[0] ?? ""}${row.lname?.[0] ?? ""}`.toUpperCase(),
            tests: row.tests ? row.tests.split(", ") : [],
            visitDate: new Date(row.visited_at).toLocaleString("en-US", {
                dateStyle: "short",
                timeStyle: "short",
            }),
            priority: row.priority,
            status: row.noteStatus
                ? NOTE_STATUS_LABEL[row.noteStatus] ?? "Draft"
                : "Awaiting note",
        }));
    } catch (err) {
        console.error("getApprovedVisits failed:", err);
        throw err;
    }
}