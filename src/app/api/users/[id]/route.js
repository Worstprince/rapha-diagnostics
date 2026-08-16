import db from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/logActivity";
import { getCurrentUser } from "@/lib/serverSession";

export async function GET(request, { params }) {

    try {

        const { id } = await params;

        const [user] = await db.query(
            `
            SELECT
                id,
                username,
                email,
                role,
                archivestatus
            FROM tblusers
            WHERE id = ?
            `,
            [id]
        );

        if (user.length === 0) {

            return NextResponse.json(
                {
                    success: false,
                    message: "User not found."
                },
                {
                    status: 404
                }
            );

        }

        return NextResponse.json(
            {
                success: true,
                data: user[0]
            },
            {
                status: 200
            }
        );

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch user."
            },
            {
                status: 500
            }
        );

    }

}


export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Authentication required."
                },
                {
                    status: 401
                }
            );
        }

        if (String(currentUser.id) !== String(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You can only update your own profile."
                },
                {
                    status: 403
                }
            );
        }

        const { username } = await request.json();
        const trimmedUsername = typeof username === "string" ? username.trim() : "";

        if (!trimmedUsername) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username is required."
                },
                {
                    status: 400
                }
            );
        }

        if (trimmedUsername.length < 3) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username must be at least 3 characters."
                },
                {
                    status: 400
                }
            );
        }

        const [existingRows] = await db.query(
            `
            SELECT id, username
            FROM tblusers
            WHERE id = ?
            `,
            [id]
        );

        if (existingRows.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found."
                },
                {
                    status: 404
                }
            );
        }

        const [duplicateRows] = await db.query(
            `
            SELECT id
            FROM tblusers
            WHERE username = ?
            AND id <> ?
            `,
            [trimmedUsername, id]
        );

        if (duplicateRows.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username already exists."
                },
                {
                    status: 409
                }
            );
        }

        await db.query(
            `
            UPDATE tblusers
            SET username = ?
            WHERE id = ?
            `,
            [trimmedUsername, id]
        );

        await logActivity(
            currentUser.id,
            "Profile Updated",
            `Updated username to: ${trimmedUsername}`,
            "User Profile"
        );

        return NextResponse.json(
            {
                success: true,
                message: "Username updated successfully."
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update username."
            },
            {
                status: 500
            }
        );
    }
}

export async function PUT(request, { params }) {

    try {

        const { id } = await params;

        const user = await request.json();

        const { userId } = user;


        // Get the user's current information
        // so we can detect archive/restore changes.
        const [existingRows] = await db.query(
            `
            SELECT
                id,
                username,
                archivestatus
            FROM tblusers
            WHERE id = ?
            `,
            [id]
        );


        if (existingRows.length === 0) {

            return NextResponse.json(
                {
                    success: false,
                    message: "User not found."
                },
                {
                    status: 404
                }
            );

        }


        const existingUser = existingRows[0];


        // Check if username/email belongs to another user
        const [duplicateRows] = await db.query(
            `
            SELECT
                id
            FROM tblusers
            WHERE (username = ? OR email = ?)
            AND id <> ?
            `,
            [
                user.username,
                user.email,
                id
            ]
        );


        if (duplicateRows.length > 0) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Username or email already exists."
                },
                {
                    status: 409
                }
            );

        }

        
        // Update WITHOUT changing password
        if (user.password === "") {

            await db.query(
                `
                UPDATE tblusers
                SET
                    username = ?,
                    email = ?,
                    role = ?,
                    archivestatus = ?
                WHERE id = ?
                `,
                [
                    user.username,
                    user.email,
                    user.role,
                    user.archivestatus,
                    id
                ]
            );

        }
        
        // Update WITH password
        else {
            const hashedPassword = await bcrypt.hash(user.password, 12);
            await db.query(
                `
                UPDATE tblusers
                SET
                    username = ?,
                    password = ?,
                    email = ?,
                    role = ?,
                    archivestatus = ?
                WHERE id = ?
                `,
                [
                    user.username,
                    hashedPassword,
                    user.email,
                    user.role,
                    user.archivestatus,
                    id
                ]
            );

        }


        // Determine what type of activity happened

        if (
            !existingUser.archivestatus &&
            user.archivestatus
        ) {

            await logActivity(
                userId,
                "User Archived",
                `Archived user: ${user.username}`,
                "User Management"
            );

        }

        else if (
            existingUser.archivestatus &&
            !user.archivestatus
        ) {

            await logActivity(
                userId,
                "User Restored",
                `Restored user: ${user.username}`,
                "User Management"
            );

        }

        else {

            await logActivity(
                userId,
                "User Update",
                `Updated user: ${user.username}`,
                "User Management"
            );

        }


        return NextResponse.json(
            {
                success: true,
                message: "User updated successfully."
            },
            {
                status: 200
            }
        );


    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update user."
            },
            {
                status: 500
            }
        );

    }

}