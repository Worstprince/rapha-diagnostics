import db from "@/lib/db";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/logActivity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SESSION_COOKIE_NAME } from "@/lib/session.config";
import {
    ACCOUNT_ACTIVE,
    ACCOUNT_LOCKED,
    isArchived,
    isLocked
} from "@/lib/accountStatus";
import {
    LOCK_MINUTES,
    MAX_ATTEMPTS,
    clearAttempts,
    lockState,
    recordFailure
} from "@/lib/loginAttempts";

const CONTACT_ADMIN =
    "Contact an administrator if you need it unlocked sooner.";

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // `email` is the login field value; users may enter their email OR username.
        const identifier =
            typeof email === "string"
                ? email.trim()
                : email;

        if (!identifier || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email/username and password are required."
                },
                {
                    status: 400
                }
            );
        }

        // Locked accounts have to come back from this query, or the lock could
        // never be reported or lifted. Archived ones are filtered out below,
        // where they still get the generic message.
        const [rows] = await db.query(
            `
            SELECT
                id,
                username,
                email,
                role,
                password,
                archivestatus
            FROM tblusers
            WHERE (email = ? OR username = ?)
            `,
            [
                identifier,
                identifier
            ]
        );

        const user = rows[0];

        if (!user || isArchived(user.archivestatus)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email/username or password."
                },
                {
                    status: 401
                }
            );
        }

        if (isLocked(user.archivestatus)) {
            const state = lockState(user.id);

            if (state.locked) {
                return NextResponse.json(
                    {
                        success: false,
                        locked: true,
                        minutesLeft: state.minutesLeft,
                        message:
                            `This account is locked. Try again in ${state.minutesLeft} minute${state.minutesLeft === 1 ? "" : "s"}. ` +
                            CONTACT_ADMIN
                    },
                    {
                        status: 403
                    }
                );
            }

            // The cooldown has run out, so the account lets itself back in.
            // This also covers the case where the server restarted and the
            // timer went with it: the status would otherwise sit at locked for
            // good, turning a ten minute pause into a permanent lockout that
            // only an admin could clear.
            await db.query(
                `
                UPDATE tblusers
                SET archivestatus = ?
                WHERE id = ?
                `,
                [ACCOUNT_ACTIVE, user.id]
            );

            clearAttempts(user.id);
        }

        // Compare the entered password against the stored bcrypt hash.
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            const failure = recordFailure(user.id);

            if (failure.locked) {
                await db.query(
                    `
                    UPDATE tblusers
                    SET archivestatus = ?
                    WHERE id = ?
                    `,
                    [ACCOUNT_LOCKED, user.id]
                );

                await logActivity(
                    user.id,
                    "Account Locked",
                    `Locked for ${LOCK_MINUTES} minutes after ${MAX_ATTEMPTS} failed sign-in attempts: ${user.username}`,
                    "Authentication"
                );

                return NextResponse.json(
                    {
                        success: false,
                        locked: true,
                        minutesLeft: LOCK_MINUTES,
                        message:
                            `Too many failed attempts. This account is locked for ${LOCK_MINUTES} minutes. ` +
                            CONTACT_ADMIN
                    },
                    {
                        status: 403
                    }
                );
            }

            return NextResponse.json(
                {
                    success: false,
                    remaining: failure.remaining,
                    message:
                        `Invalid email/username or password. ` +
                        `${failure.remaining} attempt${failure.remaining === 1 ? "" : "s"} left before this account is locked.`
                },
                {
                    status: 401
                }
            );
        }

        // A clean sign-in wipes the slate; the five have to be consecutive,
        // otherwise an account that fails once a month would eventually lock
        // itself for no reason.
        clearAttempts(user.id);

        await logActivity(
            user.id,
            "Login",
            `User logged in: ${user.username}`,
            "Authentication"
        );

        // Sign a session token containing just enough to identify + authorize
        // the user server-side. Never put the password hash in here.
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.SESSION_SECRET,
            { expiresIn: "8h" }
        );

        const response = NextResponse.json({
            success: true,
            message: "Signed in successfully.",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

        // httpOnly: JS (and therefore any XSS payload) can't read this cookie.
        response.cookies.set(SESSION_COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 8, // 8 hours, matches the token's expiresIn above
        });

        return response;

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Login failed. Please try again."
            },
            {
                status: 500
            }
        );
    }
}
