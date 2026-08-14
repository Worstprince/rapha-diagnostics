"use client";

import { useState } from "react";
import { useCurrentUser } from "@/lib/session";

import { Avatar, CheckIcon, Spinner } from "@/app/dashboard/reception/_ui";
import Toast from "@/app/dashboard/reception/_toast";
import ConfirmDialog from "@/components/ConfirmDialog";

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

const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "birthDate",
  "sex",
  "civilStatus",
  "mobileNumber",
  "email",
  "address",
];

const fieldClasses = "rd-input min-w-0";

function inputClasses(hasError, extra = "") {
  return `${fieldClasses} ${hasError ? "rd-input--error" : ""} ${extra}`.trim();
}

function ageFrom(birthDate) {
  if (!birthDate) return null;

  const dob = new Date(birthDate);
  if (Number.isNaN(dob.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

function SectionHeader({ title, description }) {
  return (
    <div className="border-b border-rd-hair p-4">
      <h2 className="text-lg font-semibold text-rd-title">{title}</h2>
      <p className="mt-0.5 text-sm text-rd-muted">{description}</p>
    </div>
  );
}

function Field({ id, label, error, required = false, className = "", children }) {
  return (
    <div className={`min-w-0 ${className}`.trim()}>

      <label htmlFor={id} className="rd-label">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-rd-danger">
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-rd-danger">
          {error}
        </p>
      )}

    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2">
      <dt className="text-xs font-semibold uppercase tracking-wider text-rd-muted">
        {label}
      </dt>
      <dd className="min-w-0 truncate text-right text-sm font-medium text-rd-text">
        {value || <span className="text-rd-placeholder">Not set</span>}
      </dd>
    </div>
  );
}

export default function PatientRegistration() {
  const currentUser = useCurrentUser();
  const [patient, setPatient] = useState(EMPTY_PATIENT);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  function handleChange(e) {
    const { name, value } = e.target;
    setPatient((prev) => ({ ...prev, [name]: value }));
    // clear field-level error when user changes the value
    setErrors((prev) => {
      if (!prev || !prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function validate() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};

    if (!patient.firstName) newErrors.firstName = "First name is required.";
    if (!patient.lastName) newErrors.lastName = "Last name is required.";
    if (!patient.birthDate) newErrors.birthDate = "Date of birth is required.";
    else if (patient.birthDate > today) newErrors.birthDate = "Date of birth cannot be in the future.";
    if (!patient.sex) newErrors.sex = "Please select sex.";
    if (!patient.civilStatus) newErrors.civilStatus = "Please select civil status.";
    if (!patient.mobileNumber) newErrors.mobileNumber = "Mobile number is required.";
    if (!patient.email) newErrors.email = "Email address is required.";
    else if (!emailRegex.test(patient.email)) newErrors.email = "Please enter a valid email address.";
    if (!patient.address) newErrors.address = "Address is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleReset() {
    setPatient(EMPTY_PATIENT);
    setStatus(null);
    setErrors({});
  }

  function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    if (!validate()) return;

    setIsConfirmOpen(true);
  }

async function submitPatient() {

    if (!currentUser?.id) {
        setStatus({
            tone: "error",
            text: "User session not found."
        });
        console.log("CURRENT USER:", currentUser);
        return;
    }

    setSubmitting(true);

    try {

        const payload = {
            ...patient,
            userId: currentUser.id
        };

        console.log("CURRENT USER:", currentUser);
        console.log("PAYLOAD:", payload);

        if (!payload.suffix) {
            delete payload.suffix;
        }

        const response = await fetch("/api/patients", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            setStatus({
                tone: "error",
                text: result.message || "Registration failed."
            });
            return;
        }

        const registeredName = [patient.firstName, patient.lastName]
            .filter(Boolean)
            .join(" ")
            .trim();

        setStatus({
            tone: "success",
            text: registeredName
                ? `${registeredName} was registered successfully.`
                : "Patient registered successfully."
        });

        setPatient(EMPTY_PATIENT);
        setErrors({});

    } catch (error) {

        console.error(error);

        setStatus({
            tone: "error",
            text: "Unable to connect to the server."
        });

    } finally {

        setSubmitting(false);

    }
}

  const fullName = [patient.firstName, patient.middleName, patient.lastName, patient.suffix]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");

  const age = ageFrom(patient.birthDate);
  const filledRequired = REQUIRED_FIELDS.filter((name) => patient[name]).length;
  const isComplete = filledRequired === REQUIRED_FIELDS.length;
  const isDirty = Object.values(patient).some(Boolean);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-full space-y-5">

      <ConfirmDialog
        open={isConfirmOpen}
        title="Register this patient?"
        description={`${fullName} will be added to the patient records.`}
        confirmLabel="Register patient"
        cancelLabel="Go back"
        onConfirm={() => {
          setIsConfirmOpen(false);
          submitPatient();
        }}
        onCancel={() => setIsConfirmOpen(false)}
      />

      <Toast
        status={status}
        onDismiss={() => setStatus(null)}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start">

        <div className="space-y-5">

          <section className="rd-panel">

            <SectionHeader
              title="Personal information"
              description="Legal name and identity details as they appear on the patient's ID."
            />

            <div className="grid gap-4 p-4 sm:grid-cols-2">

              <Field id="firstName" label="First name" required error={errors.firstName}>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={patient.firstName}
                  onChange={handleChange}
                  placeholder="Juan"
                  aria-invalid={Boolean(errors.firstName)}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  className={inputClasses(errors.firstName)}
                />
              </Field>

              <Field id="middleName" label="Middle name">
                <input
                  id="middleName"
                  type="text"
                  name="middleName"
                  value={patient.middleName}
                  onChange={handleChange}
                  placeholder="Santos"
                  className={fieldClasses}
                />
              </Field>

              <Field id="lastName" label="Last name" required error={errors.lastName}>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={patient.lastName}
                  onChange={handleChange}
                  placeholder="Dela Cruz"
                  aria-invalid={Boolean(errors.lastName)}
                  aria-describedby={errors.lastName ? "lastName-error" : undefined}
                  className={inputClasses(errors.lastName)}
                />
              </Field>

              <Field id="suffix" label="Suffix">
                <input
                  id="suffix"
                  type="text"
                  name="suffix"
                  value={patient.suffix}
                  onChange={handleChange}
                  placeholder="Jr., Sr., III"
                  className={fieldClasses}
                />
              </Field>

              <Field id="birthDate" label="Date of birth" required error={errors.birthDate}>
                <input
                  id="birthDate"
                  type="date"
                  name="birthDate"
                  value={patient.birthDate}
                  onChange={handleChange}
                  max={today}
                  aria-label="Date of birth"
                  aria-invalid={Boolean(errors.birthDate)}
                  aria-describedby={errors.birthDate ? "birthDate-error" : undefined}
                  className={inputClasses(errors.birthDate)}
                />
              </Field>

              <Field id="sex" label="Sex" required error={errors.sex}>
                <select
                  id="sex"
                  name="sex"
                  aria-label="Sex"
                  value={patient.sex}
                  onChange={handleChange}
                  data-empty={patient.sex ? "false" : "true"}
                  aria-invalid={Boolean(errors.sex)}
                  aria-describedby={errors.sex ? "sex-error" : undefined}
                  className={inputClasses(errors.sex)}
                >
                  <option value="">Select sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </Field>

              <Field
                id="civilStatus"
                label="Civil status"
                required
                error={errors.civilStatus}
                className="sm:col-span-2"
              >
                <select
                  id="civilStatus"
                  name="civilStatus"
                  aria-label="Civil status"
                  value={patient.civilStatus}
                  onChange={handleChange}
                  data-empty={patient.civilStatus ? "false" : "true"}
                  aria-invalid={Boolean(errors.civilStatus)}
                  aria-describedby={errors.civilStatus ? "civilStatus-error" : undefined}
                  className={inputClasses(errors.civilStatus)}
                >
                  <option value="">Select status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
              </Field>

            </div>

          </section>

          <section className="rd-panel">

            <SectionHeader
              title="Contact information"
              description="How the clinic reaches this patient about results and follow-ups."
            />

            <div className="grid gap-4 p-4 sm:grid-cols-2">

              <Field
                id="mobileNumber"
                label="Mobile number"
                required
                error={errors.mobileNumber}
              >
                <input
                  id="mobileNumber"
                  type="tel"
                  name="mobileNumber"
                  value={patient.mobileNumber}
                  onChange={handleChange}
                  placeholder="0917 000 0000"
                  aria-invalid={Boolean(errors.mobileNumber)}
                  aria-describedby={errors.mobileNumber ? "mobileNumber-error" : undefined}
                  className={inputClasses(errors.mobileNumber)}
                />
              </Field>

              <Field id="email" label="Email address" required error={errors.email}>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={patient.email}
                  onChange={handleChange}
                  placeholder="patient@email.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={inputClasses(errors.email)}
                />
              </Field>

              <Field
                id="address"
                label="Complete address"
                required
                error={errors.address}
                className="sm:col-span-2"
              >
                <textarea
                  id="address"
                  name="address"
                  value={patient.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="House no., street, barangay, city, province"
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={errors.address ? "address-error" : undefined}
                  className={inputClasses(errors.address, "min-h-[96px] resize-y")}
                />
              </Field>

            </div>

          </section>

        </div>

        <aside className="lg:sticky lg:top-4">

          <section className="rd-panel">

            <SectionHeader
              title="Record preview"
              description="A quick check of what will be saved."
            />

            <div className="space-y-4 p-4">

              <div className="flex items-center gap-3 rounded-xl border border-rd-hair bg-rd-sunken p-3">

                <Avatar name={fullName || "?"} className="size-11 text-sm" />

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-rd-title">
                    {fullName || "New patient"}
                  </p>
                  <p className="mt-0.5 text-xs text-rd-muted">
                    {age === null ? "Age pending" : `${age} years old`}
                  </p>
                </div>

              </div>

              <dl className="divide-y divide-rd-hair">
                <SummaryRow label="Sex" value={patient.sex} />
                <SummaryRow label="Civil status" value={patient.civilStatus} />
                <SummaryRow label="Mobile" value={patient.mobileNumber} />
                <SummaryRow label="Email" value={patient.email} />
                <SummaryRow label="Address" value={patient.address} />
              </dl>

              <div className="rounded-xl border border-rd-hair bg-rd-sunken p-3">

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-rd-muted">
                    Required fields
                  </span>
                  <span className="text-sm font-bold tabular-nums text-rd-title">
                    {filledRequired}/{REQUIRED_FIELDS.length}
                  </span>
                </div>

                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={REQUIRED_FIELDS.length}
                  aria-valuenow={filledRequired}
                  aria-label="Required fields completed"
                  className="mt-2 h-1.5 overflow-hidden rounded-full bg-rd-raised"
                >
                  <span
                    className={`block h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none ${
                      isComplete ? "bg-emerald-500" : "bg-rd-cyan"
                    }`}
                    style={{
                      width: `${(filledRequired / REQUIRED_FIELDS.length) * 100}%`,
                    }}
                  />
                </div>

              </div>

              <div className="flex flex-col gap-2.5">

                <button
                  type="submit"
                  disabled={submitting}
                  className="rd-btn rd-press rd-focus w-full"
                >
                  {submitting ? (
                    <>
                      <Spinner />
                      Registering…
                    </>
                  ) : (
                    <>
                      <CheckIcon size={16} />
                      Register patient
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={submitting || !isDirty}
                  className="rd-btn-ghost rd-press rd-focus w-full"
                >
                  Clear form
                </button>

              </div>

            </div>

          </section>

        </aside>

      </div>

    </form>
  );
}
