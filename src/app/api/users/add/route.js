import db from "@/lib/db";
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
    


        await db.query(
            `
            INSERT INTO tblusers
            (
                username,
                password,
                email,
                role,
                created_at,
                archivestatus
        )     VALUES (?, ?, ?, ?, NOW(), 0)
            `,
            [
                user.username,
                user.password,
                user.email,
                user.role
            ]
        );

        await logActivity(
            1 , //to be changed to userId from session
            "User registration",
            `Registered new user: ${user.username}`
        );

        return NextResponse.json({
            success: true,
            message: "User added successfully."
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Failed to add user"
        }, { status: 500 });
    }
}