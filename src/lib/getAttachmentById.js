

import db from "@/lib/db";

export default async function getAttachmentById(attachmentId) {
    const [rows] = await db.query(
        `SELECT id, visitid, filename, filepath FROM tblvisitnoteattachments WHERE id = ?`,
        [attachmentId]
    );
    return rows[0] ?? null;
}
