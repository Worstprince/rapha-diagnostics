import mysql from "mysql2/promise";

const db = await mysql.createPool({
    port: 3307,
    host: "localhost",
    user: "root",
    password: "",
    database: "raphaschema",
});

export default db;