import db from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/logActivity";

export async function POST(request) {
    try {
        const user = await request.json();

        const [rows] = await db.query(
            `
            SELECT id
            FROM tblusers
            WHERE username = ?
            OR email = ?
            `,
            [
                user.username,
                user.email
            ]
        );

        if (rows.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User or email already exists."
                },
                {
                    status: 409
                }
            );
        }

        const hashedPassword = await bcrypt.hash(user.password, 12);

        const [result] = await db.query(
            `
            INSERT INTO tblusers
            (
                username,
                password,
                email,
                role,
                created_at,
                archivestatus
            )
            VALUES (?, ?, ?, ?, NOW(), 0)
            `,
            [
                user.username,
                hashedPassword,
                user.email,
                user.role
            ]
        );

        const newUserId = result.insertId;

        await db.query(
            `
            INSERT INTO tbluserinfo
            (
                fname,
                mname,
                lname,
                birthdate,
                userid
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                user.fname,
                user.mname || null,
                user.lname,
                user.birthdate || null,
                newUserId
            ]
        );

        await logActivity(
            user.userId,
            "User registration",
            `Registered new user: ${user.username}`,
            "User Management"
        );

        return NextResponse.json({
            success: true,
            message: "User added successfully."
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to add user"
            },
            {
                status: 500
            }
        );
    }
}