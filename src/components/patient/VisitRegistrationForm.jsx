"use client";

import { useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/lib/session";

const today = new Date().toISOString().slice(0, 10);

export default function VisitRegistrationForm() {
  const currentUser = useCurrentUser();

  const [patientSearch, setPatientSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  const [visitDate, setVisitDate] = useState(today);
  const [priority, setPriority] = useState("Routine");

  const [referringDoctor, setReferringDoctor] =
    useState("Walk-in / none");

  const [doctorSearch, setDoctorSearch] = useState("");
  const [showDoctorDropdown, setShowDoctorDropdown] =
    useState(false);

  const [notes, setNotes] = useState("");

  const [selectedTests, setSelectedTests] = useState([]);
  const [testCatalog, setTestCatalog] = useState([]);
  const [testSearch, setTestSearch] = useState("");
  const [showTestDropdown, setShowTestDropdown] =
    useState(false);

  const [doctors, setDoctors] = useState([]);

  const [hasLoadingError, setHasLoadingError] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

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
    const term = patientSearch.trim().toLowerCase();

    if (term === "") {
      return patients;
    }

    return patients.filter((patient) => {
      const fullName = [
        patient.fname,
        patient.mname,
        patient.lname,
        patient.suffix,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const patientId =
        String(patient.id || "").toLowerCase();

      return (
        fullName.includes(term) ||
        patientId.includes(term)
      );
    });
  }, [patients, patientSearch]);


  /*
   * DOCTORS
   */

  const filteredDoctors = useMemo(() => {
    const term = doctorSearch.trim().toLowerCase();

    if (term === "") {
      return doctors;
    }

    return doctors.filter((doctor) =>
      `${doctor.fname} ${doctor.lname}`
        .toLowerCase()
        .includes(term)
    );
  }, [doctors, doctorSearch]);


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
   * DOCTOR SEARCH
   */

  function handleDoctorSearchChange(e) {
    setDoctorSearch(e.target.value);
    setShowDoctorDropdown(true);
  }


  /*
   * SELECT DOCTOR
   */

  function handleSelectDoctor(doctor) {
    setReferringDoctor(doctor.id);

    setDoctorSearch(
      `Dr. ${doctor.fname} ${doctor.lname}`
    );

    setShowDoctorDropdown(false);
  }


  /*
   * SELECT WALK-IN
   */

  function handleSelectWalkIn() {
    setReferringDoctor("Walk-in / none");
    setDoctorSearch("Walk-in / none");
    setShowDoctorDropdown(false);
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

    setTestSearch("");
    setShowTestDropdown(false);
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
    setSubmitError("");

    if (!selectedPatient.id) {
      setSubmitError(
        "Please select a patient first."
      );
      return;
    }

    if (selectedTests.length === 0) {
      setSubmitError(
        "Please select at least one test."
      );
      return;
    }

    if (!currentUser?.id) {
      setSubmitError(
        "Unable to determine the current user."
      );
      return;
    }

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
              referringDoctor,

            visitDate,

            priority,

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

      setReferringDoctor(
        "Walk-in / none"
      );

      setDoctorSearch("");

      setShowDoctorDropdown(false);

      setPriority("Routine");

      setNotes("");

      setSelectedTests([]);

      setTestSearch("");

      setShowTestDropdown(false);

    } catch (error) {
      console.error(error);

      setSubmitError(
        error.message ||
          "Failed to create visit."
      );
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

      if (
        !e.target.closest(
          "#doctor-search-container"
        )
      ) {
        setShowDoctorDropdown(false);
      }

      if (
        !e.target.closest(
          "#test-search-container"
        )
      ) {
        setShowTestDropdown(false);
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


  return (
    <section className="rounded-[2rem] border border-rd-hair bg-rd-sunken p-8 shadow-[var(--rd-card-shadow)]">

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div className="space-y-3">

          <h1 className="text-3xl font-semibold tracking-tight text-rd-title">
            Register Visit
          </h1>

          <p className="max-w-2xl text-sm leading-6 text-rd-muted">
            Find the patient, then select the tests requested for this visit.
          </p>

        </div>

      </div>


      {hasLoadingError && (
        <div className="mb-8 rounded-3xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
          Could not load patients, doctors, or test catalog. Refresh and try again.
        </div>
      )}


      <div className="space-y-8">


        {/* PATIENT */}

        <div className="space-y-4">

          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rd-muted">
            Patient
          </p>


          <div
            id="patient-search-container"
            className="relative"
          >

            <input
              type="text"
              value={patientSearch}
              onChange={
                handlePatientSearchChange
              }
              onFocus={() =>
                setShowPatientDropdown(true)
              }
              placeholder="Search by name or patient ID..."
              className="w-full rounded-3xl border border-rd-hair bg-rd-field px-4 py-3 text-rd-text placeholder:text-rd-placeholder focus:border-rd-cyan focus:outline-none focus:ring-2 focus:ring-rd-cyan/20"
            />


            {showPatientDropdown && (

              <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-2xl border border-rd-hair bg-rd-popover shadow-lg">

                {filteredPatients.map(
                  (patient) => (

                    <li
                      key={patient.id}
                      onClick={() =>
                        handleSelectPatient(
                          patient
                        )
                      }
                      className="cursor-pointer px-4 py-2 text-sm text-rd-text hover:bg-rd-raised"
                    >

                      <div>
                        {[
                          patient.fname,
                          patient.mname,
                          patient.lname,
                          patient.suffix,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      </div>

                      <div className="mt-1 text-xs text-rd-muted">
                        ID: {patient.id}
                        {patient.birthdate
                          ? ` • ${patient.birthdate}`
                          : ""}
                      </div>

                    </li>

                  )
                )}


                {filteredPatients.length ===
                  0 && (

                    <li className="px-4 py-3 text-sm text-rd-muted">
                      No patients found.
                    </li>

                  )}

              </ul>

            )}

          </div>


          {/* SELECTED PATIENT */}

          <div className="space-y-4 rounded-[1.75rem] border border-rd-hair bg-rd-sunken p-6">

            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rd-muted">
              Selected patient
            </p>


            <div className="grid gap-4 lg:grid-cols-3">


              <label className="space-y-2">

                <span className="text-sm font-medium text-rd-label">
                  First name
                </span>

                <input
                  type="text"
                  value={
                    selectedPatient.fname
                  }
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-rd-hair bg-rd-sunken px-4 py-3 text-rd-muted"
                />

              </label>


              <label className="space-y-2">

                <span className="text-sm font-medium text-rd-label">
                  Middle name
                </span>

                <input
                  type="text"
                  value={
                    selectedPatient.mname
                  }
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-rd-hair bg-rd-sunken px-4 py-3 text-rd-muted"
                />

              </label>


              <label className="space-y-2">

                <span className="text-sm font-medium text-rd-label">
                  Last name
                </span>

                <input
                  type="text"
                  value={
                    selectedPatient.lname
                  }
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-rd-hair bg-rd-sunken px-4 py-3 text-rd-muted"
                />

              </label>


              <label className="space-y-2">

                <span className="text-sm font-medium text-rd-label">
                  Suffix
                </span>

                <input
                  type="text"
                  value={
                    selectedPatient.suffix
                  }
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-rd-hair bg-rd-sunken px-4 py-3 text-rd-muted"
                />

              </label>


              <label className="space-y-2">

                <span className="text-sm font-medium text-rd-label">
                  Birthdate
                </span>

                <input
                  type="text"
                  value={
                    selectedPatient.birthdate
                  }
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-rd-hair bg-rd-sunken px-4 py-3 text-rd-muted"
                />

              </label>


              <label className="space-y-2">

                <span className="text-sm font-medium text-rd-label">
                  Sex
                </span>

                <input
                  type="text"
                  value={
                    selectedPatient.sex
                  }
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-rd-hair bg-rd-sunken px-4 py-3 text-rd-muted"
                />

              </label>


              <label className="space-y-2">

                <span className="text-sm font-medium text-rd-label">
                  Civil status
                </span>

                <input
                  type="text"
                  value={
                    selectedPatient.civilStatus
                  }
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-rd-hair bg-rd-sunken px-4 py-3 text-rd-muted"
                />

              </label>


              <label className="space-y-2">

                <span className="text-sm font-medium text-rd-label">
                  Mobile number
                </span>

                <input
                  type="text"
                  value={
                    selectedPatient.mobileNum
                  }
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-rd-hair bg-rd-sunken px-4 py-3 text-rd-muted"
                />

              </label>


              <label className="space-y-2">

                <span className="text-sm font-medium text-rd-label">
                  Email
                </span>

                <input
                  type="text"
                  value={
                    selectedPatient.email
                  }
                  disabled
                  readOnly
                  className="w-full cursor-not-allowed rounded-3xl border border-rd-hair bg-rd-sunken px-4 py-3 text-rd-muted"
                />

              </label>

            </div>


            <label className="block space-y-2">

              <span className="text-sm font-medium text-rd-label">
                Address
              </span>

              <input
                type="text"
                value={
                  selectedPatient.address
                }
                disabled
                readOnly
                className="w-full rounded-3xl border border-rd-hair bg-rd-sunken px-4 py-3 text-rd-muted"
              />

            </label>

          </div>

        </div>


        {/* VISIT DETAILS */}

        <div className="space-y-6 rounded-[1.75rem] border border-rd-hair bg-rd-sunken p-6">

          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rd-muted">
            Visit details
          </p>


          <div className="grid gap-4 lg:grid-cols-3">


            <label className="space-y-2">

              <span className="text-sm font-medium text-rd-label">
                Visit date
              </span>

              <input
                type="date"
                value={visitDate}
                onChange={(event) =>
                  setVisitDate(
                    event.target.value
                  )
                }
                className="w-full rounded-3xl border border-rd-hair bg-rd-field px-4 py-3 text-rd-text focus:border-rd-cyan focus:outline-none focus:ring-2 focus:ring-rd-cyan/20"
              />

            </label>


            <label className="space-y-2">

              <span className="text-sm font-medium text-rd-label">
                Priority
              </span>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target.value
                  )
                }
                className="w-full rounded-3xl border border-rd-hair bg-rd-field px-4 py-3 text-rd-text focus:border-rd-cyan focus:outline-none focus:ring-2 focus:ring-rd-cyan/20"
              >

                <option>
                  Routine
                </option>

                <option>
                  Urgent
                </option>

                <option>
                  Emergency
                </option>

              </select>

            </label>


            <label className="space-y-2">

              <span className="text-sm font-medium text-rd-label">
                Referring doctor
              </span>

              <div
                id="doctor-search-container"
                className="relative"
              >

                <input
                  type="text"
                  value={doctorSearch}
                  onChange={
                    handleDoctorSearchChange
                  }
                  onFocus={() =>
                    setShowDoctorDropdown(
                      true
                    )
                  }
                  placeholder="Search doctor by name..."
                  className="w-full rounded-3xl border border-rd-hair bg-rd-field px-4 py-3 text-rd-text focus:border-rd-cyan focus:outline-none focus:ring-2 focus:ring-rd-cyan/20"
                />


                {showDoctorDropdown && (

                  <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">

                    <li
                      onClick={
                        handleSelectWalkIn
                      }
                      className="cursor-pointer px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                    >
                      Walk-in / none
                    </li>


                    {filteredDoctors.map(
                      (doctor) => (

                        <li
                          key={doctor.id}
                          onClick={() =>
                            handleSelectDoctor(
                              doctor
                            )
                          }
                          className="cursor-pointer px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                        >
                          Dr.{" "}
                          {doctor.fname}{" "}
                          {doctor.lname}
                        </li>

                      )
                    )}


                    {filteredDoctors.length ===
                      0 && (

                        <li className="px-4 py-2 text-sm text-slate-500">
                          No doctors found.
                        </li>

                      )}

                  </ul>

                )}

              </div>

            </label>

          </div>


          <label className="block space-y-2">

            <span className="text-sm font-medium text-rd-label">
              Notes (optional)
            </span>

            <textarea
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value
                )
              }
              rows={4}
              placeholder="Fasting status, symptoms, special instructions..."
              className="w-full rounded-3xl border border-rd-hair bg-rd-field px-4 py-3 text-rd-text placeholder:text-rd-placeholder focus:border-rd-cyan focus:outline-none focus:ring-2 focus:ring-rd-cyan/20"
            />

          </label>

        </div>


        {/* TESTS */}

        <div className="rounded-[1.75rem] border border-rd-hair bg-rd-sunken p-6">

          <div className="flex items-center justify-between gap-4">

            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rd-muted">
              Tests requested
            </p>

            <span className="text-sm text-rd-muted">
              {selectedCountLabel}
            </span>

          </div>


          <div
            id="test-search-container"
            className="relative mt-4"
          >

            <input
              type="text"
              value={testSearch}
              onChange={(e) => {
                setTestSearch(
                  e.target.value
                );

                setShowTestDropdown(
                  true
                );
              }}
              onFocus={() =>
                setShowTestDropdown(
                  true
                )
              }
              placeholder="Search tests to add..."
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            />


            {showTestDropdown && (

              <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">

                {filteredTests.map(
                  (test) => (

                    <li
                      key={test.id}
                      onClick={() =>
                        handleAddTest(test)
                      }
                      className="flex cursor-pointer items-center justify-between px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                    >

                      <span className="uppercase">
                        {test.name}
                      </span>

                      <span className="text-rd-muted">
                        ₱
                        {Number(
                          test.price || 0
                        ).toFixed(2)}
                      </span>

                    </li>

                  )
                )}


                {filteredTests.length ===
                  0 && (

                    <li className="px-4 py-2 text-sm text-slate-500">
                      No tests found.
                    </li>

                  )}

              </ul>

            )}

          </div>


          <div className="mt-6 rounded-3xl border border-dashed border-rd-hair-strong bg-rd-sunken p-6 text-sm text-rd-muted">

            {selectedTests.length ===
            0 ? (

              "No tests selected yet. Select a test from the catalog to assign it to this visit."

            ) : (

              <div className="space-y-2">

                {selectedTests.map(
                  (test) => (

                    <div
                      key={test.id}
                      className="flex items-center justify-between rounded-2xl bg-slate-900/70 px-4 py-3 text-slate-200"
                    >

                      <div>

                        <p className="font-medium uppercase">
                          {test.name}
                        </p>

                        <p className="mt-1 text-xs text-rd-muted">
                          ₱
                          {Number(
                            test.price || 0
                          ).toFixed(2)}
                        </p>

                      </div>


                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveTest(
                            test.id
                          )
                        }
                        className="text-slate-500 hover:text-rose-400"
                      >
                        Remove
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </div>


          <div className="mt-4 flex items-center justify-between rounded-3xl border border-rd-hair bg-rd-raised px-6 py-4">

            <span className="text-sm font-medium text-rd-label">
              Total Cost
            </span>

            <span className="text-2xl font-semibold tabular-nums text-rd-title">
              ₱
              {totalCost.toFixed(2)}
            </span>

          </div>

        </div>


        {/* ERROR */}

        {submitError && (

          <p className="mb-3 text-right text-sm text-rose-400">
            {submitError}
          </p>

        )}


        {/* SUBMIT */}

        <div className="flex justify-end">

          <button
            type="button"
            onClick={
              handleCreateVisit
            }
            disabled={isSubmitting}
            className="rd-btn rd-press rd-focus"
          >
            {isSubmitting
              ? "Creating..."
              : "Create Visit"}
          </button>

        </div>

      </div>

    </section>
  );
}