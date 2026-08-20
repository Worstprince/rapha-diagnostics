import db from "@/lib/db";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/logActivity";
import { getCurrentUser } from "@/lib/serverSession";
import {
    decodeDataUrl,
    deleteSignature,
    readSignature,
    saveSignature,
    signatureFileName
} from "@/lib/signatureStore";
import { canSign } from "@/lib/signingRoles";

/* Reading is open to any signed-in member of staff: a signature has to render
   on the lab report that the doctor and the medtech both look at. Writing is
   restricted to the owner -- nobody gets to upload somebody else's signature,
   which is the whole point of having one. */
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return new NextResponse(null, { status: 401 });
        }

        const file = await readSignature(id);

        if (!file) {
            return new NextResponse(null, { status: 404 });
        }

        return new NextResponse(file, {
            status: 200,
            headers: {
                "Content-Type": "image/png",
                "Content-Length": String(file.length),
                /* private: it may sit in this user's browser cache but never in
                   a shared proxy. must-revalidate so a re-upload shows up
                   immediately rather than after an arbitrary delay. */
                "Cache-Control": "private, no-cache, must-revalidate",
            },
        });
    } catch (error) {
        console.error(error);
        return new NextResponse(null, { status: 500 });
    }
}


export async function POST(request, { params }) {
    try {
        const { id } = await params;
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { success: false, message: "Authentication required." },
                { status: 401 }
            );
        }

        if (String(currentUser.id) !== String(id)) {
            return NextResponse.json(
                { success: false, message: "You can only change your own signature." },
                { status: 403 }
            );
        }

        if (!canSign(currentUser.role)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Only medical technologists, pathologists and doctors sign results."
                },
                { status: 403 }
            );
        }

        const { image } = await request.json();
        const decoded = decodeDataUrl(image);

        if (decoded.error) {
            return NextResponse.json(
                { success: false, message: decoded.error },
                { status: 400 }
            );
        }

        await saveSignature(id, decoded.buffer);

        /* tbluserinfo holds the person, tblusers holds the account, and a row
           in the first is not guaranteed to exist for every account. Update,
           and insert only if nothing was there to update. */
        const [updated] = await db.query(
            `
            UPDATE tbluserinfo
            SET signature = ?
            WHERE userid = ?
            `,
            [signatureFileName(id), id]
        );

        if (updated.affectedRows === 0) {
            await db.query(
                `
                INSERT INTO tbluserinfo (userid, signature)
                VALUES (?, ?)
                `,
                [id, signatureFileName(id)]
            );
        }

        await logActivity(
            currentUser.id,
            "Signature Updated",
            "Updated the signature on file.",
            "User Profile"
        );

        return NextResponse.json({
            success: true,
            message: "Signature saved.",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false, message: "Could not save the signature." },
            { status: 500 }
        );
    }
}


export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { success: false, message: "Authentication required." },
                { status: 401 }
            );
        }

        if (String(currentUser.id) !== String(id)) {
            return NextResponse.json(
                { success: false, message: "You can only change your own signature." },
                { status: 403 }
            );
        }

        await deleteSignature(id);

        await db.query(
            `
            UPDATE tbluserinfo
            SET signature = NULL
            WHERE userid = ?
            `,
            [id]
        );

        await logActivity(
            currentUser.id,
            "Signature Removed",
            "Removed the signature on file.",
            "User Profile"
        );

        return NextResponse.json({
            success: true,
            message: "Signature removed.",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false, message: "Could not remove the signature." },
            { status: 500 }
        );
    }
}
