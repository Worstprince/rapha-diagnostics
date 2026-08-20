import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/* Signatures live outside public/ on purpose.

   A signature on a lab report is a legally meaningful mark. Anything under
   public/ is served by filename to anyone who asks -- no session, no role
   check -- so a predictable name like user-13.png would hand out a
   pathologist's signature to whoever guessed it. These are read back through
   an authenticated route instead. */
const STORE = path.join(process.cwd(), "private", "signatures");

/* One signature per user, named after the account. Overwriting on re-upload
   means no orphaned files accumulate and no cleanup job is ever needed. */
export function signatureFileName(userId) {
    return `user-${Number(userId)}.png`;
}

export function signaturePath(userId) {
    return path.join(STORE, signatureFileName(userId));
}

/* Nothing that arrives from a browser is trusted as an image. The bytes are
   decoded, checked for a real PNG header, and then re-encoded by sharp, which
   drops any EXIF, colour profile or appended payload along the way. */
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
export const MAX_WIDTH = 900;
export const MAX_HEIGHT = 360;

export function decodeDataUrl(dataUrl) {
    if (typeof dataUrl !== "string") {
        return { error: "No image was supplied." };
    }

    const match = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl.trim());

    if (!match) {
        return { error: "The signature must be a PNG image." };
    }

    const buffer = Buffer.from(match[1], "base64");

    if (buffer.length === 0) {
        return { error: "The signature image was empty." };
    }

    if (buffer.length > MAX_UPLOAD_BYTES) {
        return { error: "That image is too large. Keep it under 2 MB." };
    }

    if (!buffer.subarray(0, 8).equals(PNG_MAGIC)) {
        return { error: "That file is not a PNG image." };
    }

    return { buffer };
}

export async function saveSignature(userId, buffer) {
    await fs.mkdir(STORE, { recursive: true });

    /* Alpha is the whole point -- the stored file is a silhouette that the view
       layer paints with the current theme colour, so flattening it here would
       break the light/dark behaviour entirely. */
    const png = await sharp(buffer)
        .ensureAlpha()
        .resize({
            width: MAX_WIDTH,
            height: MAX_HEIGHT,
            fit: "inside",
            withoutEnlargement: true,
        })
        .png({ compressionLevel: 9 })
        .toBuffer();

    await fs.writeFile(signaturePath(userId), png);

    return { bytes: png.length };
}

export async function readSignature(userId) {
    try {
        return await fs.readFile(signaturePath(userId));
    } catch {
        return null;
    }
}

export async function deleteSignature(userId) {
    try {
        await fs.unlink(signaturePath(userId));
        return true;
    } catch {
        return false;
    }
}
