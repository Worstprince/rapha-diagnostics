import mysql from "mysql2/promise";

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    /* This server runs in UTC -- NOW() and UTC_TIMESTAMP() return the same
       string -- so every stored DATETIME is a UTC wall clock. The driver's
       default is `local`, which meant it read "2026-08-20 04:36:43" as 4:36am
       *Manila* and built a Date eight hours before the instant that actually
       happened. Every timestamp in the app was quietly eight hours early;
       an account created at 12:36pm displayed as 4:36am.

       Naming the zone makes the driver read those strings as UTC, which is what
       they are. The Date is then a true instant and the view layer can render
       it in Philippine time (see lib/datetime).

       Safe on the write path: every timestamp column is filled by NOW() or a
       CURRENT_TIMESTAMP default, server-side. Nothing binds a JS Date as a
       datetime parameter, so this setting only affects reads. That is worth
       re-checking before anyone adds one -- with `Z` a bound Date serialises as
       UTC, which is consistent with NOW(), but it is a real behaviour change
       for writes. */
    timezone: "Z"
});

export default db;