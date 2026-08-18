// src/lib/getVisitCommentById.js

import db from "@/lib/db";

export default async function getVisitCommentById(commentId) {
    const [rows] = await db.query(
        `SELECT id, visitid, authorid FROM tblvisitnotecomments WHERE id = ?`,
        [commentId]
    );
    return rows[0] ?? null;
}