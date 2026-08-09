"use client";

import { useEffect, useMemo, useState } from "react";

const today = new Date().toISOString().slice(0, 10);

export default function VisitRegistrationForm() {
  const [patientSearch, setPatientSearch] = useState("");
  const [visitDate, setVisitDate] = useState(today);
  const [priority, setPriority] = useState("Routine");
  const [referringDoctor, setReferringDoctor] = useState("Walk-in / none");
  const [notes, setNotes] = useState("");
  const [selectedTests] = useState([]);
  const [hasLoadingError] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState({
    fname: "",
    mname: "",
    lname: "",
    suffix: "",
    birthdate: "",
    sex: "",
    civilStatus: "",
    mobileNum: "",
    email: "",
    address: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedCountLabel = useMemo(() => {
    if (selectedTests.length === 0) return "0 selected";
    return `${selectedTests.length} selected`;
  }, [selectedTests]);

 async function searchPatients(name) {
  const params = new URLSearchParams({ search: name });
  const response = await fetch(`/api/patients/search?${params.toString()}`);
  const data = await response.json();
  setSearchResults(data.patients);
  setShowDropdown(true);
}

  async function handleChange(e) {
    const value = e.target.value;
    setPatientSearch(value);
    searchPatients(value);
  }

  function handleSelectPatient(patient) {
    const sanitizedPatient = Object.fromEntries(
      Object.entries(patient).map(([key, value]) => [key, value ?? ""])
    );

    setSelectedPatient({
      fname: "",
      mname: "",
      lname: "",
      suffix: "",
      birthdate: "",
      sex: "",
      civilStatus: "",
      mobileNum: "",
      email: "",
      address: "",
      ...sanitizedPatient,
    });
    setPatientSearch(`${patient.fname} ${patient.lname}`);
    setShowDropdown(false);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest("#patient-search-container")) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <section className="rounded-[2rem] border border-rd-hair bg-rd-sunken p-8 shadow-[var(--rd-card-shadow)]">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-rd-title">Register Visit</h1>
          <p className="max-w-2xl text-sm leading-6 text-rd-muted">
            Find the patient, then select the tests requested for this visit.
          </p>
        </div>
      </div>

      {hasLoadingError && (
        <div className="mb-8 rounded-3xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
          Could not load doctors or test catalog. Refresh and try again.
        </div>
      )}

      <div className="space-y-8">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rd-muted">Patient</p>
          <div id="patient-search-container" className="relative">
            <input
              type="text"
              value={patientSearch}
              onChange={handleChange}
              placeholder="Search by name or patient ID..."
              className="w-full rounded-3xl border border-rd-hair bg-rd-field px-4 py-3 text-rd-text placeholder:text-rd-placeholder focus:border-rd-cyan focus:outline-none focus:ring-2 focus:ring-rd-cyan/20"
            />

            {showDropdown && searchResults.length > 0 && (
              <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-2xl border border-rd-hair bg-rd-popover shadow-lg">
                {searchResults.map((patient) => (
                  <li
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    className="cursor-pointer px-4 py-2 text-sm text-rd-text hover:bg-rd-raised"
                  >
                    {patient.fname} {patient.mname} {patient.lname} {patient.suffix}
                    <span className="ml-2 text-rd-muted">{patient.birthdate}</span>
                  </li>
                ))}
              </ul>
            )}

            {showDropdown && patientSearch.trim() !== "" && searchResults.length === 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-2xl border border-rd-hair bg-rd-popover px-4 py-3 text-sm text-rd-muted">
                No patients found.
              </div>
            )}
          </div>

          <div className="space-y-4 rounded-[1.75rem] border border-rd-hair bg-rd-sunken p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rd-muted">Selected patient</p>

            <div className="grid gap-4 lg:grid-cols-3">
              <label className="space-y-2">
                <span className="text-sm font-medium text-rd-label">First name</span>
                <input
                  type="text"
                  value={selectedPatient.fname}
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-rd-hair bg-rd-sunken px-4 py-3 text-rd-muted"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-rd-label">Middle name</span>
                <input
                  type="text"
                  value={selectedPatient.mname}
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-rd-hair bg-rd-sunken px-4 py-3 text-rd-muted"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-rd-label">Last name</span>
                <input
                  type="text"
                  value={selectedPatient.lname}
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-rd-hair bg-rd-sunken px-4 py-3 text-rd-muted"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-rd-label">Suffix</span>
                <input
                  type="text"
                  value={selectedPatient.suffix}
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-rd-hair bg-rd-sunken px-4 py-3 text-rd-muted"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-rd-label">Birthdate</span>
                <input
                  type="text"
                  value={selectedPatient.birthdate}
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-rd-hair bg-rd-sunken px-4 py-3 text-rd-muted"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-rd-label">Sex</span>
                <input
                  type="text"
                  value={selectedPatient.sex}
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-rd-hair bg-rd-sunken px-4 py-3 text-rd-muted"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-rd-label">Civil status</span>
                <input
                  type="text"
                  value={selectedPatient.civilStatus}
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-rd-hair bg-rd-sunken px-4 py-3 text-rd-muted"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-rd-label">Mobile number</span>
                <input
                  type="text"
                  value={selectedPatient.mobileNum}
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-rd-hair bg-rd-sunken px-4 py-3 text-rd-muted"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-rd-label">Email</span>
                <input
                  type="text"
                  value={selectedPatient.email}
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-rd-hair bg-rd-sunken px-4 py-3 text-rd-muted"
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-rd-label">Address</span>
              <input
                type="text"
                value={selectedPatient.address}
                disabled
                readOnly
                className="w-full cursor-not-allowed rounded-3xl border border-rd-hair bg-rd-sunken px-4 py-3 text-rd-muted"
              />
            </label>
          </div>
        </div>

        <div className="space-y-6 rounded-[1.75rem] border border-rd-hair bg-rd-sunken p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rd-muted">Visit details</p>

          <div className="grid gap-4 lg:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-rd-label">Visit date</span>
              <input
                type="date"
                value={visitDate}
                onChange={(event) => setVisitDate(event.target.value)}
                className="w-full rounded-3xl border border-rd-hair bg-rd-field px-4 py-3 text-rd-text focus:border-rd-cyan focus:outline-none focus:ring-2 focus:ring-rd-cyan/20"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-rd-label">Priority</span>
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                className="w-full rounded-3xl border border-rd-hair bg-rd-field px-4 py-3 text-rd-text focus:border-rd-cyan focus:outline-none focus:ring-2 focus:ring-rd-cyan/20"
              >
                <option>Routine</option>
                <option>Urgent</option>
                <option>Emergency</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-rd-label">Referring doctor</span>
              <select
                value={referringDoctor}
                onChange={(event) => setReferringDoctor(event.target.value)}
                className="w-full rounded-3xl border border-rd-hair bg-rd-field px-4 py-3 text-rd-text focus:border-rd-cyan focus:outline-none focus:ring-2 focus:ring-rd-cyan/20"
              >
                <option>Walk-in / none</option>
                <option>Dr. Amina Okoro</option>
                <option>Dr. Bola Adeyemi</option>
                <option>Dr. Emma Nwosu</option>
              </select>
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-rd-label">Notes (optional)</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              placeholder="Fasting status, symptoms, special instructions..."
              className="w-full rounded-3xl border border-rd-hair bg-rd-field px-4 py-3 text-rd-text placeholder:text-rd-placeholder focus:border-rd-cyan focus:outline-none focus:ring-2 focus:ring-rd-cyan/20"
            />
          </label>
        </div>

        <div className="rounded-[1.75rem] border border-rd-hair bg-rd-sunken p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rd-muted">Tests requested</p>
            <span className="text-sm text-rd-muted">{selectedCountLabel}</span>
          </div>

          <div className="mt-6 rounded-3xl border border-dashed border-rd-hair-strong bg-rd-sunken p-6 text-sm text-rd-muted">
            No tests selected yet. Select a test from the catalog to assign it to this visit.
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="rd-btn rd-press rd-focus"
          >
            Create Visit
          </button>
        </div>
      </div>
    </section>
  );
}