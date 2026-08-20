"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useSignatureOnFile } from "@/lib/useSignatureOnFile";

/* Capturing an electronic signature.

   Two routes in, because they fail in different places. Uploading a photo of a
   real pen signature is what people ask for, but it only works if the photo is
   reasonably lit -- so the keying runs live with a threshold the user can move,
   and they see the result before it is saved rather than after. Drawing needs
   no keying at all: a canvas stroke is already transparent, so it always comes
   out clean, which makes it the reliable fallback when a photo will not key.

   Both paths produce the same thing: a PNG whose ink is opaque and whose
   background is fully transparent. That is what lets the view layer paint it
   with the current theme colour instead of shipping two files. */

const MAX_W = 900;
const MAX_H = 360;

/* Paper level that becomes fully clear, and ink level that stays fully opaque.
   Everything between ramps, which is what keeps the anti-aliased edge of a pen
   stroke soft instead of jagged. */
const DEFAULT_WHITE = 200;
const INK_OFFSET = 110;

function keyToAlpha(canvas, image, whiteLevel) {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const scale = Math.min(MAX_W / image.width, MAX_H / image.height, 1);
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = frame.data;

    const white = whiteLevel;
    const ink = Math.max(0, whiteLevel - INK_OFFSET);
    const span = Math.max(1, white - ink);

    let kept = 0;

    for (let i = 0; i < px.length; i += 4) {
        const lum = 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];

        let alpha;
        if (lum >= white) alpha = 0;
        else if (lum <= ink) alpha = 255;
        else alpha = Math.round(255 * ((white - lum) / span));

        /* Forced to black so every surviving pixel is pure alpha. The colour is
           applied later by CSS; leaving the original ink colour here would
           fight the theme. */
        px[i] = 0;
        px[i + 1] = 0;
        px[i + 2] = 0;
        px[i + 3] = alpha;

        if (alpha > 8) kept += 1;
    }

    despeckle(px, canvas.width, canvas.height);

    let survived = 0;
    for (let i = 3; i < px.length; i += 4) {
        if (px[i] > 8) survived += 1;
    }

    ctx.putImageData(frame, 0, 0);

    return survived / (px.length / 4);
}

/* Photographs of a signature usually catch more than the signature: the corner
   brackets printed around a signing box, punch holes, ruled lines, specks of
   dirt. Keying cannot tell those from ink -- they are dark on light paper too --
   so they survive, and once saved they are stamped on every report the person
   signs.

   What separates them from the signature is connectivity: a signature is one
   large run of touching pixels, while the marks around it are small islands.
   Every island is measured and anything far smaller than the biggest one is
   dropped. Scale-free, so it behaves the same on a phone photo and a flatbed
   scan.

   The flood fill uses an explicit stack. A recursive one blows the call stack
   on a signature a few hundred pixels wide. */
const ALPHA_FLOOR = 40;
const KEEP_RATIO = 0.04;

function despeckle(px, width, height) {
    const count = width * height;
    const label = new Int32Array(count).fill(-1);
    const sizes = [];
    const stack = new Int32Array(count);

    for (let start = 0; start < count; start += 1) {
        if (label[start] !== -1 || px[start * 4 + 3] <= ALPHA_FLOOR) continue;

        const id = sizes.length;
        let area = 0;
        let top = 0;
        stack[top++] = start;
        label[start] = id;

        while (top > 0) {
            const at = stack[--top];
            area += 1;

            const x = at % width;
            const y = (at / width) | 0;

            for (let dy = -1; dy <= 1; dy += 1) {
                for (let dx = -1; dx <= 1; dx += 1) {
                    if (dx === 0 && dy === 0) continue;

                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;

                    const n = ny * width + nx;
                    if (label[n] !== -1 || px[n * 4 + 3] <= ALPHA_FLOOR) continue;

                    label[n] = id;
                    stack[top++] = n;
                }
            }
        }

        sizes.push(area);
    }

    if (sizes.length < 2) return;

    const biggest = Math.max(...sizes);
    const floor = biggest * KEEP_RATIO;

    for (let i = 0; i < count; i += 1) {
        const id = label[i];
        if (id !== -1 && sizes[id] < floor) {
            px[i * 4 + 3] = 0;
        }
    }
}


function Tab({ active, children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`rd-press rd-focus min-h-11 flex-1 cursor-pointer rounded-xl border px-4 text-sm font-semibold transition-colors ${
                active
                    ? "border-rd-cyan/50 bg-rd-cyan/10 text-rd-cyan"
                    : "border-rd-hair-strong bg-rd-sunken text-rd-label hover:bg-rd-raised hover:text-rd-title"
            }`}
        >
            {children}
        </button>
    );
}


export default function SignatureCapture({ userId, hasExisting, onSaved, onStatus, onDirtyChange }) {
    const [mode, setMode] = useState("upload");
    const [preview, setPreview] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [white, setWhite] = useState(DEFAULT_WHITE);
    const [coverage, setCoverage] = useState(null);
    const [busy, setBusy] = useState(false);
    const [hasImage, setHasImage] = useState(false);

    /* Bumped after every write so the on-file view refetches. Without it the
       browser would keep serving the previous signature from cache and a fresh
       upload would look like it had not taken. */
    const [version, setVersion] = useState(0);
    const onFile = useSignatureOnFile(userId, version);
    const existing = onFile === "present";

    const workRef = useRef(null);
    const blobRef = useRef(null);
    const drawRef = useRef(null);
    const imageRef = useRef(null);
    const drawingRef = useRef(false);
    const inkedRef = useRef(false);

    const showCanvas = useCallback((canvas) => {
        const data = canvas.toDataURL("image/png");
        setPreview(data);

        canvas.toBlob((blob) => {
            if (!blob) return;
            if (blobRef.current) URL.revokeObjectURL(blobRef.current);
            blobRef.current = URL.createObjectURL(blob);
            setPreviewUrl(blobRef.current);
        }, "image/png");
    }, []);

    const dropPreview = useCallback(() => {
        if (blobRef.current) {
            URL.revokeObjectURL(blobRef.current);
            blobRef.current = null;
        }
        setPreview(null);
        setPreviewUrl(null);
    }, []);

    useEffect(() => () => {
        if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    }, []);

    /* Re-key from the original bitmap whenever the threshold moves, never from
       the previous output -- keying an already-keyed image compounds the loss
       and eats the stroke. */
    const rekey = useCallback((level) => {
        const image = imageRef.current;
        const canvas = workRef.current;
        if (!image || !canvas) return;

        const ratio = keyToAlpha(canvas, image, level);
        setCoverage(ratio);
        showCanvas(canvas);
    }, [showCanvas]);

    function handleFile(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            onStatus?.({ tone: "error", text: "Choose an image file." });
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const image = new Image();
            image.onload = () => {
                imageRef.current = image;
                setHasImage(true);
                rekey(white);
            };
            image.onerror = () =>
                onStatus?.({ tone: "error", text: "That image could not be read." });
            image.src = reader.result;
        };

        reader.onerror = () =>
            onStatus?.({ tone: "error", text: "That file could not be read." });

        reader.readAsDataURL(file);
    }

    /* A captured but unsaved mark is the thing worth warning about on the way
       out -- it exists only in this component's state and cannot be recovered
       once the dialog closes. */
    useEffect(() => {
        onDirtyChange?.(Boolean(preview));
    }, [preview, onDirtyChange]);

    /* --- drawing pad --- */

    useEffect(() => {
        if (mode !== "draw") return;

        const canvas = drawRef.current;
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);

        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#000000";

        inkedRef.current = false;
    }, [mode]);

    function pointerPos(event) {
        const rect = drawRef.current.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    function startStroke(event) {
        event.preventDefault();
        drawRef.current.setPointerCapture?.(event.pointerId);
        drawingRef.current = true;

        const ctx = drawRef.current.getContext("2d");
        const { x, y } = pointerPos(event);
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    function extendStroke(event) {
        if (!drawingRef.current) return;
        event.preventDefault();

        const ctx = drawRef.current.getContext("2d");
        const { x, y } = pointerPos(event);
        ctx.lineTo(x, y);
        ctx.stroke();
        inkedRef.current = true;
    }

    function endStroke() {
        if (!drawingRef.current) return;
        drawingRef.current = false;

        /* The canvas began transparent and only the stroke was painted, so what
           comes out already has the alpha the mask needs. No keying. */
        if (inkedRef.current) {
            showCanvas(drawRef.current);
            setCoverage(null);
        }
    }

    function clearPad() {
        const canvas = drawRef.current;
        if (!canvas) return;
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        inkedRef.current = false;
        dropPreview();
    }

    /* --- persistence --- */

    async function save() {
        if (!preview || busy) return;

        setBusy(true);

        try {
            const response = await fetch(`/api/users/${userId}/signature`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: preview }),
            });

            const result = await response.json();

            onStatus?.({
                tone: response.ok ? "success" : "error",
                text: result.message || (response.ok ? "Signature saved." : "Could not save."),
            });

            if (response.ok) {
                /* Once it is on the server it is no longer an unsaved capture.
                   Clearing it is what stops Done from offering to discard work
                   that has already been written. */
                dropPreview();
                setHasImage(false);
                imageRef.current = null;
                clearPad();
                setVersion((v) => v + 1);

                onSaved?.();
            }
        } catch {
            onStatus?.({ tone: "error", text: "Unable to reach the server." });
        } finally {
            setBusy(false);
        }
    }

    async function remove() {
        if (busy) return;
        setBusy(true);

        try {
            const response = await fetch(`/api/users/${userId}/signature`, { method: "DELETE" });
            const result = await response.json();

            onStatus?.({
                tone: response.ok ? "success" : "error",
                text: result.message || "Signature removed.",
            });

            if (response.ok) {
                dropPreview();
                imageRef.current = null;
                setHasImage(false);
                setVersion((v) => v + 1);
                onSaved?.();
            }
        } catch {
            onStatus?.({ tone: "error", text: "Unable to reach the server." });
        } finally {
            setBusy(false);
        }
    }

    /* Almost nothing survived the key -- the photo is too dark, too flat, or
       the threshold is wrong. Better to say so than to let somebody save a
       blank mark onto a clinical report. */
    const tooEmpty = coverage !== null && coverage < 0.004;
    const tooFull = coverage !== null && coverage > 0.45;

    return (
        <div className="mt-5 rounded-xl border border-rd-hair bg-rd-sunken p-4">

            <div className="flex gap-2">
                <Tab active={mode === "upload"} onClick={() => setMode("upload")}>
                    Upload
                </Tab>
                <Tab active={mode === "draw"} onClick={() => setMode("draw")}>
                    Draw
                </Tab>
            </div>


            {mode === "upload" ? (

                <div className="mt-3 space-y-3">

                    <label
                        htmlFor="sig-file"
                        className="rd-press rd-focus flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-dashed border-rd-hair-strong bg-rd-raised px-4 text-sm font-medium text-rd-label transition-colors hover:border-rd-cyan/50 hover:text-rd-cyan"
                    >
                        Choose a photo or scan
                    </label>

                    <input
                        id="sig-file"
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                        className="sr-only"
                    />

                    {hasImage && (
                        <div>
                            <label
                                htmlFor="sig-threshold"
                                className="flex items-center justify-between text-xs font-medium text-rd-muted"
                            >
                                Background removal
                                <span className="tabular-nums">{white}</span>
                            </label>
                            <input
                                id="sig-threshold"
                                type="range"
                                min="120"
                                max="245"
                                value={white}
                                onChange={(e) => {
                                    const next = Number(e.target.value);
                                    setWhite(next);
                                    rekey(next);
                                }}
                                className="mt-1 w-full accent-rd-cyan"
                            />
                            <p className="mt-1 text-xs text-rd-muted">
                                Slide left if the paper still shows, right if the ink is breaking up.
                            </p>
                        </div>
                    )}

                </div>

            ) : (

                <div className="mt-3 space-y-2">

                    <canvas
                        ref={drawRef}
                        onPointerDown={startStroke}
                        onPointerMove={extendStroke}
                        onPointerUp={endStroke}
                        onPointerLeave={endStroke}
                        aria-label="Draw your signature"
                        className="h-32 w-full touch-none rounded-xl border border-rd-hair-strong bg-white"
                    />

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={clearPad}
                            className="rd-press rd-focus min-h-9 cursor-pointer rounded-lg px-3 text-xs font-semibold text-rd-muted transition-colors hover:bg-rd-raised hover:text-rd-title"
                        >
                            Clear
                        </button>
                    </div>

                </div>

            )}


            {(previewUrl || existing) && (
                <div className="mt-3 rounded-xl border border-rd-hair bg-rd-card p-3">

                    <p className="text-xs font-semibold uppercase tracking-wider text-rd-muted">
                        {previewUrl ? "How it will print" : "Signature on file"}
                    </p>

                    {/* Rendered through the same mask the report uses, so this is
                        the real thing in the current theme rather than a
                        thumbnail of the file. */}
                    <div className="mt-2 flex h-16 items-end justify-center">
                        <span
                            aria-hidden="true"
                            className="rd-sign"
                            style={{
                                "--rd-sign-src": previewUrl
                                    ? `url("${previewUrl}")`
                                    : `url("/api/users/${userId}/signature?v=${version}")`,
                            }}
                        />
                    </div>

                    {tooEmpty && (
                        <p role="alert" className="mt-2 text-xs text-rd-danger">
                            Almost nothing was kept. Try a brighter photo, or move the slider right.
                        </p>
                    )}

                    {tooFull && (
                        <p role="alert" className="mt-2 text-xs text-rd-danger">
                            Too much was kept — the paper is coming through. Move the slider left.
                        </p>
                    )}

                </div>
            )}


            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">

                {existing ? (
                    <button
                        type="button"
                        onClick={remove}
                        disabled={busy}
                        className="rd-press rd-focus min-h-11 cursor-pointer rounded-xl px-3 text-sm font-semibold text-rd-danger transition-colors hover:bg-rd-danger-bg disabled:pointer-events-none disabled:opacity-40"
                    >
                        Remove signature
                    </button>
                ) : (
                    <span className="text-xs text-rd-muted">No signature on file.</span>
                )}

                <button
                    type="button"
                    onClick={save}
                    disabled={!preview || busy || tooEmpty}
                    className="rd-btn rd-press rd-focus min-h-11 disabled:pointer-events-none disabled:opacity-40"
                >
                    {busy ? "Saving…" : "Save signature"}
                </button>

            </div>

            <canvas ref={workRef} className="hidden" />

        </div>
    );
}
