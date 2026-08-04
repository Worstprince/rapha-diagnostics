import db from "@/lib/db";

export default async function saveTestResult({
    table,
    visitId,
    data
}) {

    const [existing] = await db.query(
        `
        SELECT id
        FROM ${table}
        WHERE visitid = ?
        LIMIT 1
        `,
        [visitId]
    );

    const columns = Object.keys(data);

    const values = Object.values(data);

    if (existing.length > 0) {

        const setClause = columns
            .map(column => `${column} = ?`)
            .join(", ");

        await db.query(
            `
            UPDATE ${table}
            SET ${setClause}
            WHERE visitid = ?
            `,
            [...values, visitId]
        );

    } else {

        await db.query(
            `
            INSERT INTO ${table}
            (${columns.join(", ")}, visitid)
            VALUES
            (${columns.map(() => "?").join(", ")}, ?)
            `,
            [...values, visitId]
        );

    }

}