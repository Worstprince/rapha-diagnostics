

import db from "@/lib/db";

export default async function getVisitComments(visitId) {
    const [rows] = await db.query(
        `
        SELECT c.id, c.comment, c.created_at, u.username AS authorName
        FROM tblvisitnotecomments AS c
        INNER JOIN tblusers AS u
            ON u.id = c.authorid
        WHERE c.visitid = ?
        ORDER BY c.created_at ASC
        `,
        [visitId]
    );

    return rows.map((r) => ({
        id: r.id,
        comment: r.comment,
        authorName: r.authorName,
        createdAt: new Date(r.created_at).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        }),
    }));
}
