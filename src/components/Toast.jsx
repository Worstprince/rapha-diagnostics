"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const toneBorder = {
    success: "border-emerald-500/50",
    error: "border-red-500/50",
};

const toneDot = {
    success: "bg-emerald-500",
    error: "bg-red-500",
};

const toneTitle = {
    success: "Done",
    error: "Something went wrong",
};

export default function Toast({ status, onDismiss, duration = 6000 }) {

    const [mounted, setMounted] = useState(false);

    const dismiss = useRef(onDismiss);

    useEffect(() => {
        dismiss.current = onDismiss;
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {

        if (!status) return;

        const timer = setTimeout(() => dismiss.current?.(), duration);

        return () => clearTimeout(timer);

    }, [status, duration]);

    if (!mounted || !status) return null;

    const tone = status.tone === "error" ? "error" : "success";

    return createPortal(
        <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4 sm:justify-end sm:px-6">

            <div
                role={tone === "error" ? "alert" : "status"}
                className={`rd-dialog pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-rd-card p-4 shadow-[var(--rd-card-shadow)] backdrop-blur-xl ${toneBorder[tone]}`}
            >

                <span
                    aria-hidden="true"
                    className={`mt-1.5 size-2 flex-none rounded-full ${toneDot[tone]}`}
                />

                <div className="min-w-0 flex-1">

                    <p className="text-sm font-semibold text-rd-title">
                        {toneTitle[tone]}
                    </p>

                    <p className="mt-1 text-sm text-rd-label">
                        {status.text}
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() => dismiss.current?.()}
                    aria-label="Dismiss notification"
                    className="rd-press rd-focus -m-1 grid size-8 flex-none cursor-pointer place-items-center rounded-lg text-rd-muted hover:bg-rd-raised hover:text-rd-title"
                >
                    <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="m6 6 12 12" />
                        <path d="m18 6-12 12" />
                    </svg>
                </button>

            </div>

        </div>,
        document.body,
    );

}
