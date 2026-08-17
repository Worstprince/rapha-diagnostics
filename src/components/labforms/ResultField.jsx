"use client";

import { evaluateResult } from "./referenceRanges";

export default function ResultField({
  name,
  value,
  onChange,
  readOnly = false,
  disabled = false,
  range,
  sex,
  className = "",
}) {
  const status = evaluateResult(value, range, sex);
  const flagged = status !== null;

  const flagStyle = flagged
    ? {
        color: "var(--rd-danger-line)",
        WebkitTextFillColor: "var(--rd-danger-line)",
        fontWeight: 700,
      }
    : undefined;

  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      disabled={disabled}
      data-flag={status ?? undefined}
      title={
        flagged
          ? status === "high"
            ? "Above normal range"
            : "Below normal range"
          : undefined
      }
      style={flagStyle}
      className={`w-full rounded bg-rd-field p-2 text-rd-title disabled:cursor-not-allowed disabled:bg-rd-raised ${className}`}
    />
  );
}
