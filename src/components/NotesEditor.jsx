"use client";

// components/NotesEditor.jsx

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bold,
  Italic,
  List,
  ListOrdered,
  Sparkles,
  Paperclip,
  MessageSquarePlus,
  MessageCircle,
  History,
  AlertTriangle,
  Clock,
  PenLine,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const MOCK_QUICK_PHRASES = [
  { id: "wnl", label: "Within normal limits", text: "Within normal limits." },
  {
    id: "repeat",
    label: "Recommend repeat",
    text: "Recommend repeat testing in 1–2 weeks if symptoms persist.",
  },
];

const SECTION_KEYS = ["findings", "impression", "recommendation"];

const SECTION_LABELS = {
  findings: "Findings",
  impression: "Impression",
  recommendation: "Recommendation",
};

const STATUS_CLASSES = {
  "Awaiting note": "bg-slate-500/15 text-slate-400",
  Draft: "bg-cyan-500/15 text-cyan-400",
  Finalized: "bg-emerald-500/15 text-emerald-400",
};

const PRIORITY_CLASSES = {
  Emergency: "bg-amber-500/15 text-amber-400",
  Urgent: "bg-red-500/15 text-red-400",
  Routine: "bg-slate-500/15 text-slate-400",
};

function ToolbarButton({ label, onClick, children, accent = false }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={
        "inline-flex h-7 items-center justify-center rounded-md px-2 text-sm transition-colors " +
        (accent
          ? "gap-1.5 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          : "w-7 text-slate-400 hover:bg-white/5")
      }
    >
      {children}
    </button>
  );
}

function TestSummaryCard({ test }) {
  const [open, setOpen] = useState(true);
  const hasCritical = test.values.some((v) => v.critical);

  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3.5 py-2.5"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-slate-200">
          {test.testType}
          {hasCritical && (
            <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-medium text-red-400">
              Critical
            </span>
          )}
        </span>
        {open ? (
          <ChevronUp size={14} className="text-slate-500" aria-hidden="true" />
        ) : (
          <ChevronDown size={14} className="text-slate-500" aria-hidden="true" />
        )}
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-white/5 px-3.5 py-2.5">
          {test.values.length === 0 ? (
            <p className="col-span-2 text-xs text-slate-500">
              No result values available.
            </p>
          ) : (
            test.values.map((v) => (
              <div key={v.label} className="flex items-baseline justify-between gap-2">
                <span className="text-xs text-slate-500">{v.label}</span>
                <span
                  className={
                    "text-sm font-medium " +
                    (v.critical ? "text-red-400" : "text-slate-200")
                  }
                >
                  {v.value}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function NotesEditor({ visit }) {
  const router = useRouter();

  const {
    id,
    patientName,
    initials,
    visitDate,
    priority,
    status,
    tests,
    initialSections,
    criticalAcknowledged,
  } = visit;

  const editableRefs = useRef({
    findings: null,
    impression: null,
    recommendation: null,
  });

  const criticalValues = useMemo(
    () =>
      tests.flatMap((t) =>
        t.values
          .filter((v) => v.critical)
          .map((v) => ({
            id: `${t.id}-${v.label}`,
            label: `${t.testType}: ${v.label} ${v.value}`,
          }))
      ),
    [tests]
  );

  const [acknowledged, setAcknowledged] = useState(
    criticalAcknowledged || criticalValues.length === 0
  );
  const [savedJustNow, setSavedJustNow] = useState(true);
  const [showPhraseMenu, setShowPhraseMenu] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  const canFinalize = acknowledged && status !== "Finalized";

  const getSections = useCallback(() => {
    const out = {};
    SECTION_KEYS.forEach((key) => {
      out[key] = editableRefs.current[key]?.innerText ?? "";
    });
    return out;
  }, []);

  const exec = useCallback((command) => {
    document.execCommand(command, false);
  }, []);

  const insertQuickPhrase = useCallback((text) => {
    document.execCommand("insertText", false, text);
    setShowPhraseMenu(false);
  }, []);

  const handleSaveDraft = useCallback(async () => {
    const sections = getSections();
    try {
      const res = await fetch(`/api/doctor/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...sections, criticalAcknowledged: acknowledged }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSavedJustNow(true);
      router.refresh(); // picks up the "Awaiting note" -> "Draft" status change
    } catch (err) {
      console.error("Failed to save draft:", err);
      setSavedJustNow(false);
    }
  }, [getSections, id, acknowledged, router]);

  const handleFinalize = useCallback(async () => {
    if (!canFinalize) return;
    const sections = getSections();
    try {
      const res = await fetch(`/api/doctor/notes/${id}/finalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sections),
      });
      if (!res.ok) throw new Error("Finalize failed");
      router.refresh(); // picks up the new "Finalized" status
    } catch (err) {
      console.error("Failed to finalize note:", err);
    }
  }, [canFinalize, getSections, id, router]);

  // Calls the AI narrative builder and fills the editable sections with its draft.
  // The doctor is expected to review/edit before saving or finalizing.
  const handleAIAssist = useCallback(async () => {
    setAiGenerating(true);
    try {
      const res = await fetch(`/api/doctor/notes/${id}/ai-assist`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("AI assist failed");
      const { draft } = await res.json();

      SECTION_KEYS.forEach((key) => {
        const el = editableRefs.current[key];
        if (el && draft[key]) {
          el.innerText = draft[key];
        }
      });
      setSavedJustNow(false); // drafted text isn't saved to the DB yet
    } catch (err) {
      console.error("Failed to generate AI draft:", err);
    } finally {
      setAiGenerating(false);
    }
  }, [id]);

  return (
    <div className="min-h-screen w-full bg-[#0a0e1a] px-6 py-6 text-slate-100">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-4 rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/doctor/notes")}
            className="mb-3 flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back to notes
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10 text-sm font-semibold text-cyan-300">
                {initials}
              </span>
              <div>
                <p className="text-base font-semibold text-white">{patientName}</p>
                <p className="text-xs text-slate-500">Visit date: {visitDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={
                  "rounded-full px-2.5 py-1 text-xs font-medium " +
                  PRIORITY_CLASSES[priority]
                }
              >
                {priority}
              </span>
              <span
                className={
                  "rounded-full px-2.5 py-1 text-xs font-medium " +
                  STATUS_CLASSES[status]
                }
              >
                {status}
              </span>
            </div>
          </div>
        </div>

        {/* Critical alert */}
        {criticalValues.length > 0 && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-5 py-3">
            <AlertTriangle size={16} className="shrink-0 text-red-400" aria-hidden="true" />
            <p className="flex-1 text-[13px] text-red-300">
              {criticalValues.map((cv) => cv.label).join("; ")} — acknowledge before
              finalizing.
            </p>
            {!acknowledged && (
              <button
                type="button"
                onClick={() => setAcknowledged(true)}
                className="h-7 rounded-md border border-red-400/30 px-2.5 text-xs font-medium text-red-300 hover:bg-red-500/10"
              >
                Acknowledge
              </button>
            )}
          </div>
        )}

        {/* All-tests summary */}
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Test results for this visit
          </p>
          <div className="grid grid-cols-2 gap-3">
            {tests.map((t) => (
              <TestSummaryCard key={t.id} test={t} />
            ))}
          </div>
        </div>

        {/* Editor card */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="mb-2 flex items-center gap-2">
            <p className="flex-1 text-[13px] text-slate-500">Diagnostic narrative</p>
          </div>

          <div className="rounded-lg border border-white/5">
            {/* Toolbar */}
            <div className="relative flex flex-wrap items-center gap-0.5 border-b border-white/5 bg-white/[0.02] px-2 py-1.5">
              <ToolbarButton label="Bold" onClick={() => exec("bold")}>
                <Bold size={15} />
              </ToolbarButton>
              <ToolbarButton label="Italic" onClick={() => exec("italic")}>
                <Italic size={15} />
              </ToolbarButton>
              <span className="mx-1 h-4.5 w-px bg-white/10" />
              <ToolbarButton
                label="Bullet list"
                onClick={() => exec("insertUnorderedList")}
              >
                <List size={15} />
              </ToolbarButton>
              <ToolbarButton
                label="Numbered list"
                onClick={() => exec("insertOrderedList")}
              >
                <ListOrdered size={15} />
              </ToolbarButton>
              <span className="mx-1 h-4.5 w-px bg-white/10" />
              <ToolbarButton
                label="Insert quick phrase"
                onClick={() => setShowPhraseMenu((v) => !v)}
              >
                <MessageSquarePlus size={15} />
              </ToolbarButton>
              <ToolbarButton label="Attach file" onClick={() => console.log("TODO: attach")}>
                <Paperclip size={15} />
              </ToolbarButton>

              {showPhraseMenu && (
                <div className="absolute left-2 top-9 z-10 w-56 rounded-md border border-white/10 bg-[#111726] py-1 shadow-lg">
                  {MOCK_QUICK_PHRASES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => insertQuickPhrase(p.text)}
                      className="block w-full px-3 py-1.5 text-left text-[13px] text-slate-300 hover:bg-white/5"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}

              <span className="flex-1" />

              <button
                type="button"
                onClick={handleAIAssist}
                disabled={aiGenerating}
                className="inline-flex h-7 items-center gap-1.5 rounded-md border border-cyan-500/30 px-2.5 text-[13px] font-medium text-cyan-400 hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Sparkles size={14} aria-hidden="true" />
                {aiGenerating ? "Generating…" : "AI assist"}
              </button>
            </div>

            {/* Sections */}
            <div className="space-y-4 px-4 py-3.5">
              {SECTION_KEYS.map((key) => (
                <div key={key}>
                  <p className="mb-1 text-[14px] font-medium text-slate-200">
                    {SECTION_LABELS[key]}
                  </p>
                  <div
                    ref={(el) => {
                      editableRefs.current[key] = el;
                    }}
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder={`Enter ${SECTION_LABELS[key].toLowerCase()}…`}
                    className="min-h-[24px] whitespace-pre-wrap text-[14px] leading-[1.7] text-slate-300 outline-none empty:before:text-slate-600 empty:before:content-[attr(data-placeholder)]"
                  >
                    {initialSections[key]}
                  </div>
                </div>
              ))}
            </div>

            {/* Meta strip */}
            <div className="flex items-center gap-4 border-t border-white/5 bg-white/[0.02] px-4 py-2">
              <button
                type="button"
                onClick={() => console.log("TODO: comments")}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300"
              >
                <MessageCircle size={14} aria-hidden="true" />
                0 comments
              </button>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Paperclip size={14} aria-hidden="true" />
                0 attachments
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <History size={14} aria-hidden="true" />
                Version history
              </span>
            </div>
          </div>

          {/* Footer actions */}
          <div className="mt-3 flex items-center justify-between">
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <Clock size={13} aria-hidden="true" />
              {savedJustNow ? "Autosaved just now" : "Unsaved changes"}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="h-8 rounded-md border border-white/10 px-3 text-[13px] font-medium text-slate-300 hover:bg-white/5"
              >
                Save draft
              </button>
              <button
                type="button"
                disabled={!canFinalize}
                onClick={handleFinalize}
                className="flex h-8 items-center gap-1.5 rounded-md bg-cyan-500 px-3 text-[13px] font-medium text-[#0a0e1a] hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
              >
                <PenLine size={14} aria-hidden="true" />
                Sign and finalize
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
