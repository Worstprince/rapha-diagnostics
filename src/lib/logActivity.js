import db from "@/lib/db";

export async function logActivity(userId, action, description, module) {

    await db.query(
        `
        INSERT INTO tblactivitylog
        (
            userid,
            action,
            description,
            datetime,
            module
        )
        VALUES (?, ?, ?, NOW(), ?)
        `,
        [
            userId,
            action,
            description,
            module
        ]
    );

}