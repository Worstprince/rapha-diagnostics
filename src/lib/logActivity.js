import db from "@/lib/db";

export async function logActivity(userId, action, description) {

    await db.query(
        `
        INSERT INTO tblactivitylog
        (
            userid,
            action,
            description,
            datetime
        )
        VALUES (?, ?, ?, NOW())
        `,
        [
            userId,
            action,
            description
        ]
    );

}