import db from "@/lib/db";

export default async function checkVisitApproved(visitId) {

    const [rows] = await db.query(
        `
        SELECT status
        FROM tblpatienttests
        WHERE visitid = ?
        `,
        [visitId]
    );

    const allApproved = rows.every(row => row.status === "Approved");

    if (allApproved && rows.length > 0) {

        await db.query(
            `
            UPDATE tblpatientvisitation
            SET status = 'Approved'
            WHERE id = ?
            `,
            [visitId]
        );

    }

}