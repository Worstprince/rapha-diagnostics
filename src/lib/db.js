import mysql from "mysql2/promise";

let db;

try {
    db = await mysql.createPool({
        port: 3306,
        host: "localhost",
        user: "root",
        password: "root",
        database: "raphaschema",
    });
} catch (error) {
    console.error("Error connecting to the database:", error);
}

export default db;