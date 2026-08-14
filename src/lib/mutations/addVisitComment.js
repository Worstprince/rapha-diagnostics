

import db from "@/lib/db";

export default async function addVisitComment({ visitId, authorId, comment }) {
    await db.query(
        `INSERT INTO tblvisitnotecomments (visitid, authorid, comment) VALUES (?, ?, ?)`,
        [visitId, authorId, comment]
    );
    return { success: true };
}
