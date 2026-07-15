"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

/* A modal confirm. Unlike the nav drawer, this one traps Tab: the whole point is
   to make you answer the question, and a focus ring wandering into the page
   behind the scrim would let you act on a form the dialog is guarding. */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  onConfirm,
  onCancel,
}) {
  const titleId = useId();
  const descId = useId();

  const panelRef = useRef(null);
  const confirmRef = useRef(null);
  const cancelRef = useRef(null);

  /* Callers pass inline arrow functions, so keeping onCancel in the effect deps
     would re-run it — and steal focus back — on every parent render. */
  const cancelHandler = useRef(onCancel);
  useEffect(() => {
    cancelHandler.current = onCancel;
  });

  useEffect(() => {
    if (!open) return;

    const opener = document.activeElement;

    /* A destructive dialog opens on the safe choice: Enter should not confirm
       something you can't undo. */
    (tone === "danger" ? cancelRef : confirmRef).current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        cancelHandler.current?.();
        return;
      }
      if (event.key !== "Tab") return;

      const nodes = panelRef.current?.querySelectorAll("button:not([disabled])");
      if (!nodes?.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      /* Whatever opened the dialog gets focus back, so keyboard users resume
         where they left off rather than at the top of the document. */
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [open, tone]);

  if (!open || typeof document === "undefined") return null;

  /* Portalled to <body> deliberately. `position: fixed` resolves against the
     nearest ancestor with a filter/backdrop-filter/transform rather than the
     viewport — so rendered in place, a dialog opened from the sidebar (which is
     backdrop-blurred and scrolls) would be trapped and clipped inside it. */
  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center p-5">
      <div className="rd-scrim absolute inset-0 bg-black/50" onClick={onCancel} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className="rd-panel rd-dialog relative w-full max-w-sm p-6"
      >
        <h2 id={titleId} className="text-lg font-semibold text-rd-title">
          {title}
        </h2>

        {description && (
          <p id={descId} className="mt-2 text-sm text-rd-muted">
            {description}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="rd-btn-ghost rd-press rd-focus"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={`${tone === "danger" ? "rd-btn-danger" : "rd-btn"} rd-press rd-focus`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
