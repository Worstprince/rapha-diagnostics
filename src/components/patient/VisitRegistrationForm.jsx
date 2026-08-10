"use client";

import { useEffect, useMemo, useState } from "react";

const today = new Date().toISOString().slice(0, 10);

export default function VisitRegistrationForm() {
  const [patientSearch, setPatientSearch] = useState("");
  const [visitDate, setVisitDate] = useState(today);
  const [priority, setPriority] = useState("Routine");
  const [referringDoctor, setReferringDoctor] = useState("Walk-in / none");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [notes, setNotes] = useState("");
  const [selectedTests, setSelectedTests] = useState([]);
  const [testCatalog, setTestCatalog] = useState([]);
  const [testSearch, setTestSearch] = useState("");
  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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

  const filteredDoctors = useMemo(() => {
    if (doctorSearch.trim() === "") return doctors;
    const term = doctorSearch.toLowerCase();
    return doctors.filter((doctor) =>
      `${doctor.fname} ${doctor.lname}`.toLowerCase().includes(term)
    );
  }, [doctors, doctorSearch]);

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

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await fetch("/api/doctor/getDoctorList");
        if (!response.ok) throw new Error("Failed to fetch doctors");
        const data = await response.json();
        setDoctors(data.doctors);
      } catch (err) {
        console.error(err);
        setHasLoadingError(true);
      }
    }
    fetchDoctors();
  }, []);
  //------------------------------//
  async function handleCreateVisit() {
  setSubmitError("");

  if (!selectedPatient.id) {
    setSubmitError("Please select a patient first.");

    return;
  }

  if (selectedTests.length === 0) {
    setSubmitError("Please select at least one test.");
    return;
  }

  setIsSubmitting(true);

  try {
    const response = await fetch("/api/patients/visitation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientId: selectedPatient.id,
        doctorId: referringDoctor,
        visitDate,
        priority,
        notes,
        tests: selectedTests.map((test) => test.id),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to create visit.");
    }

    // Reset the form after a successful submission
    setPatientSearch("");
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
    });
    setReferringDoctor("Walk-in / none");
    setDoctorSearch("");
    setPriority("Routine");
    setNotes("");
    setSelectedTests([]);
  } catch (err) {
    console.error(err);
    setSubmitError(err.message);
  } finally {
    setIsSubmitting(false);
  }
}

  //------------------------------//
  const filteredTests = useMemo(() => {
    if (testSearch.trim() === "") return testCatalog;
    const term = testSearch.toLowerCase();
    return testCatalog.filter((test) =>
      test.name.toLowerCase().includes(term)
    );
  }, [testCatalog, testSearch]);

  useEffect(() => {
    async function fetchTests() {
      try {
        const response = await fetch("/api/tests/getTestCatalog");
        if (!response.ok) throw new Error("Failed to fetch tests");
        const data = await response.json();
        setTestCatalog(data.tests);
      } catch (err) {
        console.error(err);
        setHasLoadingError(true);
      }
    }
    fetchTests();
  }, []);

  function handleAddTest(test) {
    const alreadyAdded = selectedTests.some((t) => t.id === test.id);
    if (alreadyAdded) return;
    setSelectedTests((prev) => [...prev, test]);
  }

  function handleRemoveTest(testId) {
    setSelectedTests((prev) => prev.filter((t) => t.id !== testId));
  }

  //------------------------------//

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

  function handleDoctorSearchChange(e) {
    setDoctorSearch(e.target.value);
    setShowDoctorDropdown(true);
  }

  function handleSelectDoctor(doctor) {
    setReferringDoctor(doctor.id);
    setDoctorSearch(`Dr. ${doctor.fname} ${doctor.lname}`);
    setShowDoctorDropdown(false);
  }

  function handleSelectWalkIn() {
    setReferringDoctor("Walk-in / none");
    setDoctorSearch("Walk-in / none");
    setShowDoctorDropdown(false);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest("#patient-search-container")) {
        setShowDropdown(false);
      }
      if (!e.target.closest("#doctor-search-container")) {
        setShowDoctorDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-xl shadow-slate-950/20">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-white">Register Visit</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">
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
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Patient</p>
          <div id="patient-search-container" className="relative">
            <input
              type="text"
              value={patientSearch}
              onChange={handleChange}
              placeholder="Search by name or patient ID..."
              className="w-full rounded-3xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            />

            {showDropdown && searchResults.length > 0 && (
              <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">
                {searchResults.map((patient) => (
                  <li
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    className="cursor-pointer px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                  >
                    {patient.fname} {patient.mname} {patient.lname} {patient.suffix}
                    <span className="ml-2 text-slate-500">{patient.birthdate}</span>
                  </li>
                ))}
              </ul>
            )}

            {showDropdown && patientSearch.trim() !== "" && searchResults.length === 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-500">
                No patients found.
              </div>
            )}
          </div>

          <div className="space-y-4 rounded-[1.75rem] border border-slate-800 bg-slate-900/50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Selected patient</p>

            <div className="grid gap-4 lg:grid-cols-3">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">First name</span>
                <input
                  type="text"
                  value={selectedPatient.fname}
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-slate-400"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">Middle name</span>
                <input
                  type="text"
                  value={selectedPatient.mname}
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-slate-400"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">Last name</span>
                <input
                  type="text"
                  value={selectedPatient.lname}
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-slate-400"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">Suffix</span>
                <input
                  type="text"
                  value={selectedPatient.suffix}
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-slate-400"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">Birthdate</span>
                <input
                  type="text"
                  value={selectedPatient.birthdate}
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-slate-400"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">Sex</span>
                <input
                  type="text"
                  value={selectedPatient.sex}
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-slate-400"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">Civil status</span>
                <input
                  type="text"
                  value={selectedPatient.civilStatus}
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-slate-400"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">Mobile number</span>
                <input
                  type="text"
                  value={selectedPatient.mobileNum}
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-slate-400"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">Email</span>
                <input
                  type="text"
                  value={selectedPatient.email}
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-slate-400"
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-300">Address</span>
              <input
                type="text"
                value={selectedPatient.address}
                disabled
                readOnly
                className="w-full cursor-not-allowed rounded-3xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-slate-400"
              />
            </label>
          </div>
        </div>

        <div className="space-y-6 rounded-[1.75rem] border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Visit details</p>

          <div className="grid gap-4 lg:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-300">Visit date</span>
              <input
                type="date"
                value={visitDate}
                onChange={(event) => setVisitDate(event.target.value)}
                className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-slate-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-300">Priority</span>
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-slate-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              >
                <option>Routine</option>
                <option>Urgent</option>
                <option>Emergency</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-300">Referring doctor</span>
              <div id="doctor-search-container" className="relative">
                <input
                  type="text"
                  value={doctorSearch}
                  onChange={handleDoctorSearchChange}
                  onFocus={() => setShowDoctorDropdown(true)}
                  placeholder="Search doctor by name..."
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-slate-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                />

                {showDoctorDropdown && (
                  <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">
                    <li
                      onClick={handleSelectWalkIn}
                      className="cursor-pointer px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                    >
                      Walk-in / none
                    </li>
                    {filteredDoctors.map((doctor) => (
                      <li
                        key={doctor.id}
                        onClick={() => handleSelectDoctor(doctor)}
                        className="cursor-pointer px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                      >
                        Dr. {doctor.fname} {doctor.lname}
                      </li>
                    ))}
                    {filteredDoctors.length === 0 && (
                      <li className="px-4 py-2 text-sm text-slate-500">No doctors found.</li>
                    )}
                  </ul>
                )}
              </div>
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-300">Notes (optional)</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              placeholder="Fasting status, symptoms, special instructions..."
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            />
          </label>
        </div>

        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Tests requested</p>
            <span className="text-sm text-slate-500">{selectedCountLabel}</span>
          </div>

          <div className="relative mt-4">
            <input
              type="text"
              value={testSearch}
              onChange={(e) => setTestSearch(e.target.value)}
              placeholder="Search tests to add..."
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            />

            {testSearch.trim() !== "" && (
              <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">
                {filteredTests.map((test) => (
                  <li
                    key={test.id}
                    onClick={() => {
                      handleAddTest(test);
                      setTestSearch("");
                    }}
                    className="cursor-pointer px-4 py-2 text-sm text-slate-200 uppercase hover:bg-slate-800"
                  >
                    {test.name}
                  </li>
                ))}
                {filteredTests.length === 0 && (
                  <li className="px-4 py-2 text-sm text-slate-500">No tests found.</li>
                )}
              </ul>
            )}
          </div>

          <div className="mt-6 rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-500">
            {selectedTests.length === 0 ? (
              "No tests selected yet. Select a test from the catalog to assign it to this visit."
            ) : (
              <ul className="space-y-2">
                {selectedTests.map((test) => (
                  <li
                    key={test.id}
                    className="flex items-center justify-between rounded-2xl bg-slate-900/70 px-4 py-2 text-slate-200 uppercase"
                  >
                    {test.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveTest(test.id)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
          {submitError && (
          <p className="mb-3 text-right text-sm text-rose-400">{submitError}</p>
          )}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCreateVisit}
            disabled={isSubmitting}
            className="inline-flex items-center rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          >
            {isSubmitting ? "Creating..." : "Create Visit"}
          </button>
        </div>
      </div>
    </section>
  );
}
