// src/lib/mutations/deleteVisitAttachment.js

import db from "@/lib/db";

export default async function deleteVisitAttachment(attachmentId) {
    const [result] = await db.query(
        `DELETE FROM tblvisitnoteattachments WHERE id = ?`,
        [attachmentId]
    );
    return result.affectedRows > 0;
}