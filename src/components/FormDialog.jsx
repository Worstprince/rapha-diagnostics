"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

/* Same modal contract as ConfirmDialog, but the trap walks every focusable node
   instead of only buttons — a form dialog whose Tab cycle skipped its own inputs
   would be unusable by keyboard. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function FormDialog({ open, title, description, onClose, children }) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef(null);

  /* Callers pass inline arrow functions, so keeping onClose in the effect deps
     would re-run it — and steal focus back — on every parent render. */
  const closeHandler = useRef(onClose);
  useEffect(() => {
    closeHandler.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    /* The first field takes focus rather than the panel: these dialogs exist to
       be typed into, so the caret starts where the work does. */
    const first = panelRef.current?.querySelector(FOCUSABLE);
    if (first instanceof HTMLElement) first.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closeHandler.current?.();
        return;
      }
      if (event.key !== "Tab") return;

      const nodes = panelRef.current?.querySelectorAll(FOCUSABLE);
      if (!nodes?.length) return;

      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === firstNode) {
        event.preventDefault();
        lastNode.focus();
      } else if (!event.shiftKey && document.activeElement === lastNode) {
        event.preventDefault();
        firstNode.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  /* Portalled for the same reason ConfirmDialog is: `position: fixed` resolves
     against the nearest backdrop-filtered ancestor, and the sidebar this opens
     from is one — rendered in place it would be trapped inside it. */
  return createPortal(
    <div className="fixed inset-0 z-[70] grid place-items-center p-5">
      <div className="rd-scrim absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className="rd-panel rd-dialog rd-scroll-thin relative max-h-[calc(100dvh-2.5rem)] w-full max-w-md overflow-y-auto p-6"
      >
        <h2 id={titleId} className="text-lg font-semibold text-rd-title">
          {title}
        </h2>

        {description && (
          <p id={descId} className="mt-2 text-sm text-rd-muted">
            {description}
          </p>
        )}

        <div className="mt-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
