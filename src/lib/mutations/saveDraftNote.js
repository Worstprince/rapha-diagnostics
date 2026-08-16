// lib/mutations/saveDraftNote.js

import db from "@/lib/db";

export default async function saveDraftNote({
    visitId,
    findings,
    impression,
    recommendation,
    criticalAcknowledged,
    doctorId,
}) {
    try {
        await db.query(
            `
            INSERT INTO tblvisitnotes
                (visitid, findings, impression, recommendation, critical_acknowledged, createdby, status)
            VALUES (?, ?, ?, ?, ?, ?, 'draft')
            ON DUPLICATE KEY UPDATE
                findings = VALUES(findings),
                impression = VALUES(impression),
                recommendation = VALUES(recommendation),
                critical_acknowledged = VALUES(critical_acknowledged)
            `,
            [visitId, findings, impression, recommendation, criticalAcknowledged, doctorId]
        );

        return { success: true };
    } catch (err) {
        console.error("saveDraftNote failed:", err);
        throw err;
    }
}
