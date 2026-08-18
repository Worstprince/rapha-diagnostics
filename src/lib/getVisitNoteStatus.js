// src/lib/getVisitNoteStatus.js

import db from "@/lib/db";

// NOTE: assumes tblvisitnotes uses `visitid` as its FK column, consistent
// with tblvisitnotecomments/tblvisitnoteattachments. Adjust if it's named
// differently in your actual schema.
export default async function getVisitNoteStatus(visitId) {
    const [rows] = await db.query(
        `SELECT status FROM tblvisitnotes WHERE visitid = ?`,
        [visitId]
    );
    return rows[0]?.status ?? null;
}