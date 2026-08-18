// src/lib/mutations/deleteVisitComment.js

import db from "@/lib/db";

export default async function deleteVisitComment(commentId) {
    const [result] = await db.query(
        `DELETE FROM tblvisitnotecomments WHERE id = ?`,
        [commentId]
    );
    return result.affectedRows > 0;
}