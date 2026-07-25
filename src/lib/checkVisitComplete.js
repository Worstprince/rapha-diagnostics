import db from "@/lib/db";

export default async function checkVisitComplete(visitId) {

    const [rows] = await db.query(
        `
        SELECT status
        FROM tblpatienttests
        WHERE visitid = ?
        `,
        [visitId]
    );

    const allDone = rows.every(row => row.status === "Done");

    if (allDone && rows.length > 0) {

        await db.query(
            `
            UPDATE tblpatientvisitation
            SET status = 'Done'
            WHERE id = ?
            `,
            [visitId]
        );

    }

}