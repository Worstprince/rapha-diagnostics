// src/lib/getVisitAttachments.js

import db from "@/lib/db";

export default async function getVisitAttachments(visitId) {
    const [rows] = await db.query(
        `
        SELECT a.id, a.filename, a.filesize, a.uploaded_at, a.uploadedby, u.username AS uploadedByName
        FROM tblvisitnoteattachments AS a
        INNER JOIN tblusers AS u
            ON u.id = a.uploadedby
        WHERE a.visitid = ?
        ORDER BY a.uploaded_at ASC
        `,
        [visitId]
    );

    return rows.map((r) => ({
        id: r.id,
        filename: r.filename,
        filesize: r.filesize,
        uploadedById: r.uploadedby,
        uploadedByName: r.uploadedByName,
        uploadedAt: new Date(r.uploaded_at).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        }),
    }));
}