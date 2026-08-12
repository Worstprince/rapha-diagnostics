// lib/mutations/finalizeNote.js

import db from "@/lib/db";

export default async function finalizeNote({
    visitId,
    findings,
    impression,
    recommendation,
    doctorId,
}) {
    try {
        await db.query(
            `
            INSERT INTO tblvisitnotes
                (visitid, findings, impression, recommendation, critical_acknowledged, createdby, status, finalizedby, finalized_at)
            VALUES (?, ?, ?, ?, TRUE, ?, 'finalized', ?, NOW())
            ON DUPLICATE KEY UPDATE
                findings = VALUES(findings),
                impression = VALUES(impression),
                recommendation = VALUES(recommendation),
                critical_acknowledged = TRUE,
                status = IF(status IN ('finalized', 'amended'), 'amended', 'finalized'),
                finalizedby = VALUES(finalizedby),
                finalized_at = VALUES(finalized_at)
            `,
            [visitId, findings, impression, recommendation, doctorId, doctorId]
        );

        return { success: true };
    } catch (err) {
        console.error("finalizeNote failed:", err);
        throw err;
    }
}
