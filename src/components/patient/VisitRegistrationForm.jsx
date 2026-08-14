"use client";

import { useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/lib/session";

import {
  Avatar,
  CheckIcon,
  CloseIcon,
  SearchIcon,
  Spinner,
} from "@/app/dashboard/reception/_ui";
import Toast from "@/app/dashboard/reception/_toast";
import ConfirmDialog from "@/components/ConfirmDialog";

const today = new Date().toISOString().slice(0, 10);

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="flex-none text-sm text-rd-muted">{label}</dt>
      <dd className="min-w-0 truncate text-right text-sm font-medium text-rd-title">
        {value || <span className="font-normal text-rd-muted">Not set</span>}
      </dd>
    </div>
  );
}

function PatientDetail({ label, value, span }) {
  return (
    <div className={span ? "sm:col-span-2" : undefined}>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-rd-title">
        {value || <span className="font-normal text-rd-muted">—</span>}
      </dd>
    </div>
  );
}

export default function VisitRegistrationForm() {
  const currentUser = useCurrentUser();

  const [patientSearch, setPatientSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [hasVisitToday, setHasVisitToday] = useState(false);

  const [visitDate, setVisitDate] = useState(today);
  const [priority, setPriority] = useState("Routine");

  const [clinic, setClinic] = useState("");

  const [assignedDoctor, setAssignedDoctor] =
    useState("");

  const [referralType, setReferralType] =
    useState("walk-in");

  const [referringDoctor, setReferringDoctor] =
    useState("");

  // For the dropdown display on doctor referral
  const [referringDoctors, setReferringDoctors] = useState([]);
  const [showReferringDoctorDropdown, setShowReferringDoctorDropdown] =
  useState(false);

  const [notes, setNotes] = useState("");

  const [selectedTests, setSelectedTests] = useState([]);
  const [testCatalog, setTestCatalog] = useState([]);
  const [testSearch, setTestSearch] = useState("");

  const [doctors, setDoctors] = useState([]);

  const [hasLoadingError, setHasLoadingError] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [toast, setToast] =
    useState(null);

  const [isConfirmOpen, setIsConfirmOpen] =
    useState(false);

  const [selectedPatient, setSelectedPatient] = useState({
    id: "",
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


  /*
   * PATIENTS
   */

  const filteredPatients = useMemo(() => {
    const terms = patientSearch
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    if (terms.length === 0) {
      return patients;
    }

    return patients.filter((patient) => {
      const haystack = [
        patient.fname,
        patient.mname,
        patient.lname,
        patient.suffix,
        patient.id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return terms.every((term) =>
        haystack.includes(term)
      );
    });
  }, [patients, patientSearch]);


  /*
   * WHAT THE DROPDOWN ACTUALLY SHOWS
   *
   * With no search term the whole roster is not useful, so the
   * newest records are offered instead. Results are capped so a
   * large catalogue never renders thousands of rows.
   */

  const isShowingRecent = patientSearch.trim() === "";

  const visiblePatients = useMemo(() => {
    if (isShowingRecent) {
      return [...patients]
        .sort(
          (a, b) => Number(b.id || 0) - Number(a.id || 0)
        )
        .slice(0, 8);
    }

    return filteredPatients.slice(0, 50);
  }, [patients, filteredPatients, isShowingRecent]);


  /*
   * DOCTORS
   */

  const sortedDoctors = useMemo(() => {
    return [...doctors].sort((a, b) =>
      `${a.lname} ${a.fname}`.localeCompare(
        `${b.lname} ${b.fname}`
      )
    );
  }, [doctors]);


  /*
   * TESTS
   */

  const filteredTests = useMemo(() => {
    const term = testSearch.trim().toLowerCase();

    if (term === "") {
      return testCatalog;
    }

    return testCatalog.filter((test) =>
      test.name.toLowerCase().includes(term)
    );
  }, [testCatalog, testSearch]);


  /*
   * SELECTED TEST COUNT
   */

  const selectedCountLabel = useMemo(() => {
    if (selectedTests.length === 0) {
      return "0 selected";
    }

    return `${selectedTests.length} selected`;
  }, [selectedTests]);


  /*
   * TOTAL COST
   */

  const totalCost = useMemo(() => {
    return selectedTests.reduce(
      (total, test) =>
        total + Number(test.price || 0),
      0
    );
  }, [selectedTests]);


  /*
   * LOAD PATIENTS
   *
   * The endpoint is called with an empty search.
   * This gives us the patient list once.
   *
   * After that, searching is done locally using
   * filteredPatients.
   */

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch(
          "/api/patients/search?search=",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch patients."
          );
        }

        const data = await response.json();

        setPatients(data.patients || []);
      } catch (error) {
        console.error(
          "PATIENT LOAD ERROR:",
          error
        );

        setHasLoadingError(true);
      }
    }

    fetchPatients();
  }, []);


  /*
   * LOAD DOCTORS
   */

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await fetch(
          "/api/doctor/getDoctorList",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch doctors."
          );
        }

        const data = await response.json();

        setDoctors(data.doctors || []);
      } catch (error) {
        console.error(
          "DOCTOR LOAD ERROR:",
          error
        );

        setHasLoadingError(true);
      }
    }

    fetchDoctors();
  }, []);


  /*
   * LOAD TEST CATALOG
   */

  useEffect(() => {
    async function fetchTests() {
      try {
        const response = await fetch(
          "/api/tests/getTestCatalog",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch tests."
          );
        }

        const data = await response.json();

        setTestCatalog(data.tests || []);
      } catch (error) {
        console.error(
          "TEST LOAD ERROR:",
          error
        );

        setHasLoadingError(true);
      }
    }

    fetchTests();
  }, []);


  // for loading the referring doctors list
  useEffect(() => {
  async function fetchReferringDoctors() {
    try {
      const response = await fetch(
        "/api/referring-doctors",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch referring doctors."
        );
      }

      const data = await response.json();

      setReferringDoctors(
        data.referringDoctors || []
      );
    } catch (error) {
      console.error(
        "REFERRING DOCTOR LOAD ERROR:",
        error
      );

      setHasLoadingError(true);
    }
  }

  fetchReferringDoctors();
}, []);


  /*
   * PATIENT SEARCH
   *
   * This no longer calls the API.
   * It only changes the search text.
   *
   * filteredPatients automatically updates.
   */

  function handlePatientSearchChange(e) {
    setPatientSearch(e.target.value);
    setShowPatientDropdown(true);
    setHighlightedIndex(0);
  }


  /*
   * KEYBOARD NAVIGATION
   */

  function handlePatientKeyDown(e) {
    if (!showPatientDropdown) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setShowPatientDropdown(true);
        setHighlightedIndex(0);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((index) =>
        Math.min(index + 1, visiblePatients.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((index) =>
        Math.max(index - 1, 0)
      );
    } else if (e.key === "Enter") {
      const patient = visiblePatients[highlightedIndex];

      if (patient) {
        e.preventDefault();
        handleSelectPatient(patient);
      }
    } else if (e.key === "Escape") {
      setShowPatientDropdown(false);
    }
  }


  /*
   * SELECT PATIENT
   */

  function handleSelectPatient(patient) {
    const sanitizedPatient = Object.fromEntries(
      Object.entries(patient).map(
        ([key, value]) => [
          key,
          value ?? "",
        ]
      )
    );

    setSelectedPatient({
      id: "",
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

    setPatientSearch(
      [
        patient.fname,
        patient.mname,
        patient.lname,
        patient.suffix,
      ]
        .filter(Boolean)
        .join(" ")
    );

    setShowPatientDropdown(false);
  }


  /*
   * CLEAR PATIENT
   */

  function handleClearPatient() {
    setSelectedPatient({
      id: "",
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

    setPatientSearch("");
    setShowPatientDropdown(false);
  }


  /*
   * REFERRAL SOURCE
   */

  function handleReferralTypeChange(value) {
    setReferralType(value);

    if (value === "walk-in") {
      setReferringDoctor("");
      setClinic("");
    }
  }


  /*
   * ADD TEST
   */

  function handleAddTest(test) {
    const alreadyAdded =
      selectedTests.some(
        (selectedTest) =>
          selectedTest.id === test.id
      );

    if (alreadyAdded) {
      return;
    }

    setSelectedTests((prev) => [
      ...prev,
      test,
    ]);
  }


  /*
   * REMOVE TEST
   */

  function handleRemoveTest(testId) {
    setSelectedTests((prev) =>
      prev.filter(
        (test) => test.id !== testId
      )
    );
  }


  /*
   * CREATE VISIT
   */

  async function handleCreateVisit() {
    setToast(null);

    if (!selectedPatient.id) {
      setToast({
        tone: "error",
        text: "Please select a patient first.",
      });
      return;
    }

    if (selectedTests.length === 0) {
      setToast({
        tone: "error",
        text: "Please select at least one test.",
      });
      return;
    }

    if (!currentUser?.id) {
      setToast({
        tone: "error",
        text: "Unable to determine the current user.",
      });
      return;
    }

    const visitPatientName = [
      selectedPatient.fname,
      selectedPatient.lname,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    const visitTestCount =
      selectedTests.length;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/patients/visitation",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            patientId:
              selectedPatient.id,

            doctorId:
              assignedDoctor || null,

            visitDate,

            priority,

            referringDoctor:
              isReferred
                ? referringDoctor.trim()
                : "Walk-in / none",

            clinic,

            notes,

            tests:
              selectedTests.map(
                (test) => test.id
              ),

            userId:
              currentUser.id,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to create visit."
        );
      }


      setToast({
        tone: "success",
        text: `Visit created for ${
          visitPatientName || "the patient"
        } with ${visitTestCount} ${
          visitTestCount === 1
            ? "test"
            : "tests"
        }.`,
      });


      /*
       * RESET FORM
       */

      setPatientSearch("");

      setSelectedPatient({
        id: "",
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

      setShowPatientDropdown(false);

      setReferralType("walk-in");

      setReferringDoctor("");

      setPriority("Routine");

      setClinic("");

      setAssignedDoctor("");

      setNotes("");

      setSelectedTests([]);

      setTestSearch("");

    } catch (error) {
      console.error(error);

      setToast({
        tone: "error",
        text:
          error.message ||
          "Failed to create visit.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }


  /*
   * CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
   */

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        !e.target.closest(
          "#patient-search-container"
        )
      ) {
        setShowPatientDropdown(false);
      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);


  const patientFullName = [
    selectedPatient.fname,
    selectedPatient.mname,
    selectedPatient.lname,
    selectedPatient.suffix,
  ]
    .filter(Boolean)
    .join(" ");

  const hasSelectedPatient = Boolean(patientFullName);

  const isReferred = referralType === "referred";

  const referralSummary = isReferred
    ? referringDoctor.trim() ||
      "Outside doctor"
    : "Walk-in / none";

  const assignedDoctorName = (() => {
    const match = doctors.find(
      (doctor) =>
        String(doctor.id) ===
        String(assignedDoctor)
    );

    return match
      ? `Dr. ${match.fname} ${match.lname}`
      : "";
  })();

  const validationMessage = !hasSelectedPatient
    ? "Select a patient to continue."
    : selectedTests.length === 0
      ? "Add at least one test."
      : null;

  const hasUnsavedWork =
    hasSelectedPatient ||
    selectedTests.length > 0 ||
    isReferred ||
    clinic.trim() !== "" ||
    assignedDoctor !== "" ||
    notes.trim() !== "";


  /*
   * UNSAVED WORK GUARD
   */

  useEffect(() => {
    if (!hasUnsavedWork) return;

    function handleBeforeUnload(event) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [hasUnsavedWork]);


  /*
   * SAME-DAY VISIT CHECK
   *
   * Reads the existing patient record endpoint so reception can
   * see that a visit already exists before creating a second one.
   */

  useEffect(() => {
    if (!selectedPatient.id) {
      setHasVisitToday(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(
          `/api/doctor/patients/${selectedPatient.id}`,
          { cache: "no-store" }
        );

        if (!response.ok) return;

        const data = await response.json();

        if (cancelled) return;

        const now = new Date();

        const visitedToday = (data.visits || []).some(
          (visit) => {
            const date = new Date(visit.visited_at);

            return (
              date.getFullYear() === now.getFullYear() &&
              date.getMonth() === now.getMonth() &&
              date.getDate() === now.getDate()
            );
          }
        );

        setHasVisitToday(visitedToday);
      } catch (error) {
        console.error("VISIT CHECK ERROR:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedPatient.id]);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:items-start">

      {/* MAIN COLUMN */}

      <div className="space-y-5">

        {hasLoadingError && (
          <p role="alert" className="rd-status rd-status--error">
            Could not load patients, doctors, or test catalog. Refresh and try again.
          </p>
        )}


        {/* PATIENT */}

        <section className="rd-panel relative z-20">

          <div className="border-b border-rd-hair p-4">
            <h2 className="text-lg font-semibold text-rd-title">Patient</h2>
            <p className="mt-0.5 text-sm text-rd-muted">
              Search the record this visit belongs to.
            </p>
          </div>

          <div className="space-y-4 p-4">

            {!hasSelectedPatient && (

            <div id="patient-search-container" className="relative">

              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-rd-placeholder"
              >
                <SearchIcon />
              </span>

              <input
                type="text"
                role="combobox"
                aria-expanded={showPatientDropdown}
                aria-controls="patient-listbox"
                aria-autocomplete="list"
                aria-label="Search patients by name or ID"
                value={patientSearch}
                onChange={handlePatientSearchChange}
                onFocus={() => setShowPatientDropdown(true)}
                onKeyDown={handlePatientKeyDown}
                placeholder="Search by name or patient ID…"
                className="rd-input pl-11"
              />

              {showPatientDropdown && (
                <ul
                  id="patient-listbox"
                  role="listbox"
                  aria-label="Patient records"
                  className="rd-scroll-thin absolute z-30 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-rd-hair-strong bg-rd-popover shadow-[var(--rd-card-shadow)]"
                >
                  {visiblePatients.length > 0 && (
                    <li className="border-b border-rd-hair px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                      {isShowingRecent
                        ? "Recently registered"
                        : `${filteredPatients.length} ${
                            filteredPatients.length === 1 ? "match" : "matches"
                          }`}
                    </li>
                  )}

                  {visiblePatients.map((patient, index) => (
                    <li key={patient.id} role="option" aria-selected={index === highlightedIndex}>
                      <button
                        type="button"
                        onClick={() => handleSelectPatient(patient)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`rd-focus flex min-h-11 w-full cursor-pointer flex-col justify-center px-4 py-2 text-left transition-colors ${
                          index === highlightedIndex ? "bg-rd-raised" : ""
                        }`}
                      >
                        <span className="truncate text-sm font-medium text-rd-title">
                          {[patient.fname, patient.mname, patient.lname, patient.suffix]
                            .filter(Boolean)
                            .join(" ")}
                        </span>
                        <span className="mt-0.5 truncate text-xs text-rd-muted">
                          ID #{patient.id}
                          {patient.birthdate ? ` · ${patient.birthdate}` : ""}
                        </span>
                      </button>
                    </li>
                  ))}

                  {visiblePatients.length === 0 && (
                    <li className="px-4 py-3 text-sm text-rd-muted">
                      No patient matches “{patientSearch.trim()}”.
                    </li>
                  )}

                  {!isShowingRecent &&
                    filteredPatients.length > visiblePatients.length && (
                      <li className="border-t border-rd-hair px-4 py-2 text-xs text-rd-muted">
                        Showing the first {visiblePatients.length} of{" "}
                        {filteredPatients.length} — keep typing to narrow it down.
                      </li>
                    )}
                </ul>
              )}

            </div>

            )}

            {hasSelectedPatient ? (

              <div className="rounded-xl border border-rd-cyan/45 bg-rd-cyan/8 p-4">

                <div className="flex flex-wrap items-center gap-4">

                  <Avatar name={patientFullName} className="size-12 text-sm" />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold text-rd-title">
                      {patientFullName}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-rd-muted">
                      {[
                        selectedPatient.id ? `ID #${selectedPatient.id}` : null,
                        selectedPatient.sex,
                        selectedPatient.birthdate,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleClearPatient}
                    className="rd-press rd-focus inline-flex min-h-11 flex-none cursor-pointer items-center gap-1.5 rounded-xl border border-rd-hair-strong bg-rd-card px-3.5 text-sm font-medium text-rd-label hover:border-rd-cyan/50 hover:text-rd-cyan"
                  >
                    Change patient
                  </button>

                </div>

                {hasVisitToday && (
                  <p className="mt-4 rounded-xl border border-amber-500/45 bg-amber-500/12 px-3.5 py-2.5 text-sm text-rd-label">
                    This patient already has a visit recorded today. Check before
                    creating another one.
                  </p>
                )}

                <dl className="mt-4 grid gap-x-8 gap-y-4 border-t border-rd-hair pt-4 sm:grid-cols-2">
                  <PatientDetail label="Civil status" value={selectedPatient.civilStatus} />
                  <PatientDetail label="Mobile number" value={selectedPatient.mobileNum} />
                  <PatientDetail label="Email" value={selectedPatient.email} />
                  <PatientDetail label="Address" value={selectedPatient.address} span />
                </dl>

              </div>

            ) : (

              <div className="rounded-xl border border-dashed border-rd-hair-strong bg-rd-sunken px-4 py-8 text-center">
                <p className="text-sm font-semibold text-rd-title">No patient selected</p>
                <p className="mt-1 text-sm text-rd-muted">
                  Search above to attach this visit to a patient record.
                </p>
              </div>

            )}

          </div>

        </section>


        {/* VISIT DETAILS */}

        <section className="rd-panel relative z-10">

          <div className="border-b border-rd-hair p-4">
            <h2 className="text-lg font-semibold text-rd-title">Visit details</h2>
            <p className="mt-0.5 text-sm text-rd-muted">
              When the patient is being seen, where, and who is handling them.
            </p>
          </div>

          <div className="space-y-4 p-4">

            <div className="grid gap-4 sm:grid-cols-2">

              <label className="block">
                <span className="rd-label">Visit date</span>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(event) => setVisitDate(event.target.value)}
                  className="rd-input"
                />
              </label>

              <label className="block">
                <span className="rd-label">Priority</span>
                <select
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                  className="rd-input"
                >
                  <option>Routine</option>
                  <option>Urgent</option>
                  <option>Emergency</option>
                </select>
              </label>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <label className="block">
                <span className="rd-label">Referring doctor</span>
                <select
                  value={referralType}
                  onChange={(event) => handleReferralTypeChange(event.target.value)}
                  className="rd-input"
                >
                  <option value="walk-in">Walk-in / none</option>
                  <option value="referred">Referred by an outside doctor</option>
                </select>
              </label>

              <label className="block">
                <span className="rd-label">Assigned doctor</span>
                <select
                  value={assignedDoctor}
                  onChange={(event) => setAssignedDoctor(event.target.value)}
                  data-empty={assignedDoctor ? "false" : "true"}
                  className="rd-input"
                >
                  <option value="">Unassigned</option>
                  {sortedDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.fname} {doctor.lname}
                    </option>
                  ))}
                </select>
              </label>

            </div>

            {isReferred && (
              <div className="grid gap-4 sm:grid-cols-2">

                <label className="block">
                  <span className="rd-label">Doctor name</span>
                  <input
                    type="text"
                    value={referringDoctor}
                    onChange={(event) => setReferringDoctor(event.target.value)}
                    placeholder="Dr. Juan Dela Cruz"
                    className="rd-input"
                  />
                </label>

                <label className="block">
                  <span className="rd-label">Clinic name</span>
                  <input
                    type="text"
                    value={clinic}
                    onChange={(event) => setClinic(event.target.value)}
                    placeholder="Clinic or hospital"
                    className="rd-input"
                  />
                </label>

              </div>
            )}

            <label className="block">
              <span className="rd-label">Notes (optional)</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                placeholder="Fasting status, symptoms, special instructions…"
                className="rd-input"
              />
            </label>

          </div>

        </section>


        {/* TESTS */}

        <section className="rd-panel">

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rd-hair p-4">

            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-semibold text-rd-title">Tests requested</h2>
                {selectedTests.length > 0 && (
                  <span
                    aria-label={selectedCountLabel}
                    className="grid min-w-6 place-items-center rounded-full bg-rd-cyan px-2 py-0.5 text-xs font-bold tabular-nums text-rd-on-cyan shadow-[0_0_0_3px_var(--rd-focus-ring)]"
                  >
                    {selectedTests.length}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-rd-muted">
                Tap a test to add it to this visit. Tap again to remove it.
              </p>
            </div>

            {selectedTests.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedTests([])}
                className="rd-press rd-focus inline-flex min-h-11 cursor-pointer items-center rounded-lg px-2 text-sm font-medium text-rd-muted hover:text-rd-danger"
              >
                Clear all
              </button>
            )}

          </div>

          <div className="space-y-4 p-4">

            <div className="relative">

              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-rd-placeholder"
              >
                <SearchIcon />
              </span>

              <input
                type="search"
                aria-label="Filter tests"
                value={testSearch}
                onChange={(e) => setTestSearch(e.target.value)}
                placeholder="Filter tests…"
                className="rd-input pl-11"
              />

            </div>

            {filteredTests.length === 0 ? (

              <div className="py-6 text-center">

                <p className="text-sm text-rd-muted">
                  {testCatalog.length === 0
                    ? "No tests available yet."
                    : "No tests match that filter."}
                </p>

                {testSearch !== "" && (
                  <button
                    type="button"
                    onClick={() => setTestSearch("")}
                    className="rd-press rd-focus mt-2 inline-flex min-h-11 cursor-pointer items-center rounded-lg px-3 text-sm font-medium text-rd-cyan hover:bg-rd-cyan/10"
                  >
                    Clear filter
                  </button>
                )}

              </div>

            ) : (

              <div className="rd-scroll-thin max-h-[24rem] overflow-y-auto pr-1">

                <ul className="grid gap-3 sm:grid-cols-2">

                  {filteredTests.map((test) => {

                    const isSelected = selectedTests.some(
                      (selectedTest) => selectedTest.id === test.id
                    );

                    return (
                      <li key={test.id}>
                        <button
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() =>
                            isSelected
                              ? handleRemoveTest(test.id)
                              : handleAddTest(test)
                          }
                          className={`rd-press rd-focus flex h-full w-full cursor-pointer flex-col justify-between gap-3 rounded-xl border p-3.5 text-left transition-colors ${
                            isSelected
                              ? "border-rd-cyan/60 bg-rd-cyan/12 shadow-[var(--rd-lift)]"
                              : "border-rd-hair bg-rd-sunken hover:border-rd-cyan/50 hover:bg-rd-raised"
                          }`}
                        >

                          <div className="flex items-start justify-between gap-2">

                            <span className="min-w-0 text-sm font-medium uppercase leading-snug text-rd-title">
                              {test.name}
                            </span>

                            <span
                              aria-hidden="true"
                              className={`grid size-5 flex-none place-items-center rounded-full border transition-colors ${
                                isSelected
                                  ? "border-rd-cyan bg-rd-cyan text-rd-on-cyan"
                                  : "border-rd-hair-strong"
                              }`}
                            >
                              {isSelected && <CheckIcon size={12} />}
                            </span>

                          </div>

                          <span
                            className={`text-sm font-semibold tabular-nums ${
                              isSelected ? "text-rd-cyan" : "text-rd-text"
                            }`}
                          >
                            ₱{Number(test.price || 0).toFixed(2)}
                          </span>

                        </button>
                      </li>
                    );

                  })}

                </ul>

              </div>

            )}

          </div>

        </section>

      </div>


      {/* SUMMARY RAIL */}

      <aside className="lg:sticky lg:top-4">

        <section className="rd-panel overflow-hidden">

          <div className="border-b border-rd-hair p-4">
            <h2 className="text-lg font-semibold text-rd-title">Visit summary</h2>
            <p className="mt-0.5 text-sm text-rd-muted">
              Check this before creating the visit.
            </p>
          </div>

          <dl className="space-y-4 p-4">
            <SummaryRow
              label="Patient"
              value={hasSelectedPatient ? patientFullName : null}
            />
            <SummaryRow label="Visit date" value={visitDate} />
            <SummaryRow label="Priority" value={priority} />
            <SummaryRow
              label="Referring doctor"
              value={referralSummary}
            />
            {isReferred && (
              <SummaryRow label="Referring clinic" value={clinic} />
            )}
            <SummaryRow
              label="Assigned doctor"
              value={assignedDoctorName || "Unassigned"}
            />
            <SummaryRow
              label="Tests"
              value={`${selectedTests.length} ${
                selectedTests.length === 1 ? "test" : "tests"
              }`}
            />

            {selectedTests.length > 0 && (
              <div className="border-t border-rd-hair pt-3">
                <ul className="space-y-1">
                  {selectedTests.map((test) => (
                    <li
                      key={test.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="min-w-0 flex-1 truncate text-rd-label">
                        {test.name}
                      </span>

                      <span className="flex-none tabular-nums text-rd-muted">
                        ₱{Number(test.price || 0).toFixed(2)}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveTest(test.id)}
                        aria-label={`Remove ${test.name}`}
                        className="rd-press rd-focus grid size-7 flex-none cursor-pointer place-items-center rounded-lg text-rd-muted hover:bg-rd-danger-bg hover:text-rd-danger"
                      >
                        <CloseIcon size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </dl>

          <div className="border-t border-rd-hair p-4">

            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-rd-muted">Estimated total</span>
              <span className="text-xl font-bold tabular-nums tracking-tight text-rd-title">
                ₱{totalCost.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsConfirmOpen(true)}
              disabled={isSubmitting || Boolean(validationMessage)}
              className="rd-btn rd-press rd-focus mt-4 w-full"
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  Creating…
                </>
              ) : (
                <>
                  <CheckIcon size={16} />
                  Create visit
                </>
              )}
            </button>

            {validationMessage && (
              <p className="mt-2 text-center text-xs text-rd-muted">
                {validationMessage}
              </p>
            )}

          </div>

        </section>

      </aside>

      <ConfirmDialog
        open={isConfirmOpen}
        title="Create this visit?"
        description={`${patientFullName} will be booked for ${
          selectedTests.length
        } ${
          selectedTests.length === 1 ? "test" : "tests"
        } on ${visitDate}, totalling ₱${totalCost.toFixed(2)}.`}
        confirmLabel="Create visit"
        cancelLabel="Go back"
        onConfirm={() => {
          setIsConfirmOpen(false);
          handleCreateVisit();
        }}
        onCancel={() => setIsConfirmOpen(false)}
      />

      <Toast
        status={toast}
        onDismiss={() => setToast(null)}
      />

    </div>
  );
}
