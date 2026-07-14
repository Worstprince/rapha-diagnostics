"use client";

import { useState } from "react";

const EMPTY_PATIENT = {
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  birthDate: "",
  sex: "",
  civilStatus: "",
  mobileNumber: "",
  email: "",
  address: "",
};

const fieldClasses =
  "w-full min-w-0 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30";
const labelClasses = "mb-1.5 block text-sm font-medium text-slate-300";

export default function PatientRegistration() {
  const [patient, setPatient] = useState(EMPTY_PATIENT);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setPatient((prev) => ({ ...prev, [name]: value }));
  }

  function handleReset() {
    setPatient(EMPTY_PATIENT);
    setStatus(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!patient.firstName || !patient.lastName || !patient.birthDate || !patient.sex || !patient.civilStatus) {
      setStatus({ type: "error", message: "Please fill in all required fields." });
      return;
    }

    if (patient.email && !emailRegex.test(patient.email)) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patient),
      });

      const result = await response.json();

      if (!response.ok) {
        setStatus({ type: "error", message: result.message || "Registration failed." });
        return;
      }

      setStatus({ type: "success", message: "Patient registered successfully." });
      setPatient(EMPTY_PATIENT);
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: "Unable to connect to the server." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-full space-y-6 overflow-x-hidden">
      {status && (
        <div
          role="status"
          className={
            status.type === "success"
              ? "rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
              : "rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
          }
        >
          {status.message}
        </div>
      )}

      <fieldset className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70 p-4 sm:p-6">
        <legend className="px-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Personal information
        </legend>

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className={labelClasses}>
              First name <span className="text-cyan-400">*</span>
            </label>
            <input id="firstName" type="text" name="firstName" value={patient.firstName} onChange={handleChange} placeholder="Juan" className={fieldClasses} />
          </div>

          <div>
            <label htmlFor="middleName" className={labelClasses}>
              Middle name
            </label>
            <input id="middleName" type="text" name="middleName" value={patient.middleName} onChange={handleChange} placeholder="Santos" className={fieldClasses} />
          </div>

          <div>
            <label htmlFor="lastName" className={labelClasses}>
              Last name <span className="text-cyan-400">*</span>
            </label>
            <input id="lastName" type="text" name="lastName" value={patient.lastName} onChange={handleChange} placeholder="Dela Cruz" className={fieldClasses} />
          </div>

          <div>
            <label htmlFor="suffix" className={labelClasses}>
              Suffix
            </label>
            <input id="suffix" type="text" name="suffix" value={patient.suffix} onChange={handleChange} placeholder="Jr., Sr., III" className={fieldClasses} />
          </div>

          <div>
            <label htmlFor="birthDate" className={labelClasses}>
              Date of birth <span className="text-cyan-400">*</span>
            </label>
            <input id="birthDate" type="date" name="birthDate" value={patient.birthDate} onChange={handleChange} className={`${fieldClasses} [color-scheme:dark]`} />
          </div>

          <div>
            <label htmlFor="sex" className={labelClasses}>
              Sex <span className="text-cyan-400">*</span>
            </label>
            <select id="sex" name="sex" value={patient.sex} onChange={handleChange} className={fieldClasses}>
              <option value="">Select sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label htmlFor="civilStatus" className={labelClasses}>
              Civil status <span className="text-cyan-400">*</span>
            </label>
            <select id="civilStatus" name="civilStatus" value={patient.civilStatus} onChange={handleChange} className={fieldClasses}>
              <option value="">Select status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widowed">Widowed</option>
              <option value="Separated">Separated</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70 p-4 sm:p-6">
        <legend className="px-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Contact information
        </legend>

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="mobileNumber" className={labelClasses}>
              Mobile number
            </label>
            <input id="mobileNumber" type="tel" name="mobileNumber" value={patient.mobileNumber} onChange={handleChange} placeholder="0917 000 0000" className={fieldClasses} />
          </div>

          <div>
            <label htmlFor="email" className={labelClasses}>
              Email address
            </label>
            <input id="email" type="email" name="email" value={patient.email} onChange={handleChange} placeholder="patient@email.com" className={fieldClasses} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="address" className={labelClasses}>
              Complete address
            </label>
            <textarea id="address" name="address" value={patient.address} onChange={handleChange} rows="3" placeholder="House no., street, barangay, city, province" className={`${fieldClasses} min-h-[96px] resize-y`} />
          </div>
        </div>
      </fieldset>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={handleReset} disabled={submitting} className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50">
          Clear
        </button>
        <button type="submit" disabled={submitting} className="rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? "Registering…" : "Register patient"}
        </button>
      </div>
    </form>
  );
}
