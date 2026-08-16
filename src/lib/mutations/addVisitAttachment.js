

import db from "@/lib/db";

export default async function addVisitAttachment({
    visitId,
    uploadedBy,
    filename,
    filepath,
    filesize,
}) {
    await db.query(
        `
        INSERT INTO tblvisitnoteattachments (visitid, uploadedby, filename, filepath, filesize)
        VALUES (?, ?, ?, ?, ?)
        `,
        [visitId, uploadedBy, filename, filepath, filesize]
    );
    return { success: true };
}
