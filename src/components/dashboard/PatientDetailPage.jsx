"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PatientTestChart from "@/components/patient/patientTestChart";

import {
  ActivityIcon,
  ArrowLeftIcon,
  Avatar,
  CakeIcon,
  CalendarIcon,
  ChevronRightIcon,
  ClockIcon,
  EmptyState,
  FileTextIcon,
  FlaskIcon,
  HeaderGlow,
  HeartIcon,
  MailIcon,
  MapPinIcon,
  MinusIcon,
  PhoneIcon,
  TableSkeleton,
  TrendDownIcon,
  TrendUpIcon,
  UserIcon,
  backLink,
  td,
  th,
} from "@/app/dashboard/_ui";

const DAY = 24 * 60 * 60 * 1000;

function relativeLabel(date) {
  const days = Math.floor((Date.now() - date.getTime()) / DAY);

  if (days < 0) return "Scheduled";
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }

  const years = Math.floor(days / 365);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}

function recencyTone(date) {
  const days = Math.floor((Date.now() - date.getTime()) / DAY);

  if (days <= 7) return "text-rd-fresh";
  if (days <= 30) return "text-rd-text";

  return "text-rd-muted";
}

function titleCase(value) {
  if (!value) return value;

  return String(value)
    .toLowerCase()
    .replace(/\b[a-z]/g, (character) => character.toUpperCase());
}

function InfoCard({ title, caption, Icon: Glyph, tint, items }) {
  return (
    <div className="rd-panel flex flex-col overflow-hidden">
      <div className="flex flex-none items-center gap-3 border-b border-rd-hair p-4">
        <span className={`${tint} grid size-10 flex-none place-items-center rounded-xl`}>
          <Glyph size={18} />
        </span>

        <div className="min-w-0">
          <h2 className="text-base font-semibold text-rd-title">{title}</h2>
          <p className="mt-0.5 truncate text-xs text-rd-muted">{caption}</p>
        </div>
      </div>

      <dl className="grid h-full gap-px bg-rd-hair sm:grid-cols-2">
        {items.map(({ label, icon: FieldGlyph, value, href, span }) => {
          const missing = !value;

          return (
            <div
              key={label}
              className={`group/cell relative min-w-0 bg-rd-sunken px-5 py-4 transition-colors duration-200 ${
                href ? "hover:bg-rd-raised" : ""
              } ${span ? "sm:col-span-2" : ""}`}
            >
              <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                <FieldGlyph size={13} />
                {label}

                {href && !missing && (
                  <ChevronRightIcon
                    size={13}
                    className="ml-auto text-rd-cyan opacity-0 transition-opacity duration-200 group-hover/cell:opacity-100"
                  />
                )}
              </dt>

              <dd title={value || undefined} className="mt-1.5 truncate text-base font-semibold">
                {missing ? (
                  <span className="font-normal italic text-rd-placeholder">Not recorded</span>
                ) : href ? (
                  <a href={href} className="rd-focus text-rd-cyan after:absolute after:inset-0 after:rounded-none">
                    {value}
                  </a>
                ) : (
                  <span className="text-rd-title">{value}</span>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

export default function PatientDetailPage({ basePath = "/dashboard/doctor", roleLabel = "Doctor" }) {
  const tests = [
    { id: 1, name: "Blood Type", fields: [{ value: "bloodtype", label: "Blood Type" }, { value: "rhFactor", label: "Rh Factor" }] },
    { id: 2, name: "Chemistry", fields: [{ value: "glucose", label: "Glucose" }, { value: "creatinine", label: "Creatinine" }, { value: "uricAcid", label: "Uric Acid" }, { value: "totalCholesterol", label: "Total Cholesterol" }, { value: "triglycerides", label: "Triglycerides" }, { value: "hdlCholesterol", label: "HDL Cholesterol" }, { value: "ldlCholesterol", label: "LDL Cholesterol" }, { value: "sgot", label: "SGOT" }, { value: "sgpt", label: "SGPT" }, { value: "totalBilirubin", label: "Total Bilirubin" }, { value: "directBilirubin", label: "Direct Bilirubin" }, { value: "indirectBilirubin", label: "Indirect Bilirubin" }, { value: "hba1c", label: "HbA1c" }, { value: "bun", label: "BUN" }] },
    { id: 3, name: "Dengue", fields: [{ value: "igg", label: "IgG" }, { value: "igm", label: "IgM" }, { value: "ns1", label: "NS1" }] },
    { id: 4, name: "FOBT", fields: [{ value: "fobtResult", label: "FOBT Result" }] },
    { id: 5, name: "Hepatitis", fields: [{ value: "hbsagResult", label: "HBsAg Result" }] },
    { id: 6, name: "Hematology", fields: [{ value: "hemoglobinMass", label: "Hemoglobin Mass" }, { value: "rbcNumConcentration", label: "RBC Number Concentration" }, { value: "wbcNumConcentration", label: "WBC Number Concentration" }, { value: "bleedingTime", label: "Bleeding Time" }, { value: "clottingTime", label: "Clotting Time" }, { value: "bloodGroup", label: "Blood Group" }, { value: "plateletCount", label: "Platelet Count" }, { value: "hematocrit", label: "Hematocrit" }, { value: "segmenters", label: "Segmenters" }, { value: "band", label: "Band" }, { value: "juvenile", label: "Juvenile" }, { value: "lymphocytes", label: "Lymphocytes" }, { value: "monocytes", label: "Monocytes" }, { value: "eosinophils", label: "Eosinophils" }, { value: "basophils", label: "Basophils" }, { value: "mcv", label: "MCV" }, { value: "mch", label: "MCH" }, { value: "mchc", label: "MCHC" }, { value: "bsmp", label: "BSMP" }, { value: "rdwCv", label: "RDW-CV" }, { value: "other", label: "Other" }] },
    { id: 7, name: "OGTT", fields: [{ value: "fbs", label: "Fasting Blood Sugar" }, { value: "firstHour", label: "1 Hour" }, { value: "secondHour", label: "2 Hours" }] },
    { id: 8, name: "Pregnancy Test", fields: [{ value: "ptHCGSerum", label: "Pregnancy Result" }] },
    { id: 9, name: "Semen Analysis", fields: [{ value: "appearance", label: "Appearance" }, { value: "volume", label: "Volume" }, { value: "ph", label: "pH" }, { value: "viscosity", label: "Viscosity" }, { value: "others", label: "Others" }, { value: "morphology", label: "Morphology" }, { value: "motility", label: "Motility" }, { value: "wbc", label: "WBC" }, { value: "rbc", label: "RBC" }, { value: "m30mins", label: "30 Minutes" }, { value: "m1hr", label: "1 Hour" }, { value: "m2hr", label: "2 Hours" }, { value: "v30mins", label: "Volume at 30 Minutes" }, { value: "v1hr", label: "Volume at 1 Hour" }, { value: "v2hr", label: "Volume at 2 Hours" }, { value: "spermConcentration", label: "Sperm Concentration" }, { value: "spermCount", label: "Sperm Count" }] },
    { id: 10, name: "Stool Exam", fields: [{ value: "color", label: "Color" }, { value: "parasiticOva", label: "Parasitic Ova" }, { value: "pussCells", label: "Pus Cells" }, { value: "rbc", label: "RBC" }, { value: "occultBlood", label: "Occult Blood" }, { value: "fecalysisNo", label: "Fecalysis No." }, { value: "consistency", label: "Consistency" }, { value: "bacteria", label: "Bacteria" }, { value: "fatGlobules", label: "Fat Globules" }, { value: "others", label: "Others" }] },
    { id: 11, name: "Thyroid Examination", fields: [{ value: "t4", label: "T4" }, { value: "tsh", label: "TSH" }] },
    { id: 12, name: "Urinalysis", fields: [{ value: "color", label: "Color" }, { value: "transparency", label: "Transparency" }, { value: "reaction", label: "Reaction" }, { value: "sugar", label: "Sugar" }, { value: "albumin", label: "Albumin" }, { value: "specificgravity", label: "Specific Gravity" }, { value: "pregnancytest", label: "Pregnancy Test" }, { value: "others", label: "Others" }, { value: "epithelialcells", label: "Epithelial Cells" }, { value: "mucustread", label: "Mucus Thread" }, { value: "pus", label: "Pus" }, { value: "rbc", label: "RBC" }, { value: "cast", label: "Cast" }, { value: "renalCells", label: "Renal Cells" }, { value: "crystal", label: "Crystal" }, { value: "bacteria", label: "Bacteria" }] },
    { id: 13, name: "VDRL", fields: [{ value: "vdrl", label: "VDRL Result" }] },
  ];

  const TABS = [
    { id: "overview", label: "Overview", Icon: FileTextIcon },
    { id: "visits", label: "Visits", Icon: CalendarIcon },
    { id: "trends", label: "Trends", Icon: ActivityIcon },
  ];

  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(false);

  async function fetchChartData() {
    setChartLoading(true);
    setChartError(false);

    try {
      const response = await fetch(`/api/doctor/patients/${id}/chart?testId=${selectedTest.id}&field=${selectedField}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load chart data.");
      }

      const formattedData = data
        .map((row) => ({ date: new Date(row.date).toLocaleDateString(), value: Number(row.value) }))
        .filter((row) => !Number.isNaN(row.value));

      setChartData(formattedData);
    } catch (error) {
      console.error(error);
      setChartData([]);
      setChartError(true);
    } finally {
      setChartLoading(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    fetchPatient();
  }, [id]);

  useEffect(() => {
    if (!id || !selectedTest || !selectedField) return;
    fetchChartData();
  }, [id, selectedTest, selectedField]);

  async function fetchPatient() {
    try {
      const response = await fetch(`/api/doctor/patients/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load patient.");
      }

      setPatient(data.patient);
      setVisits(data.visits || []);
      setLoadError("");
    } catch (error) {
      console.error(error);
      setLoadError(error.message === "Patient not found." ? "notfound" : "failed");
    } finally {
      setLoading(false);
    }
  }

  async function fetchHistory(testId, field) {
    setLoadingHistory(true);

    try {
      const response = await fetch(`/api/doctor/patients/${id}/trends?testId=${testId}&field=${field}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load history.");
      }

      setHistory(data);
    } catch (error) {
      console.error(error);
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  }

  function handleTestChange(e) {
    const testId = Number(e.target.value);
    const test = tests.find((value) => value.id === testId);

    setSelectedTest(test);
    setSelectedField(null);
    setHistory([]);
    setChartData([]);
    setChartError(false);
  }

  function handleFieldChange(e) {
    const field = e.target.value;

    setSelectedField(field || null);
    setHistory([]);
    setChartData([]);
    setChartError(false);

    if (selectedTest && field) {
      fetchHistory(selectedTest.id, field);
    }
  }

  const values = history.map((item) => item.value).filter((value) => value !== null && value !== undefined && value !== "");
  const isNumeric = values.length > 0 && values.every((value) => !Number.isNaN(Number(value)));
  const latestReading = chartData.at(-1) ?? null;
  const readingDelta = chartData.length >= 2 ? chartData.at(-1).value - chartData.at(-2).value : null;
  const lastVisitLabel = visits.length > 0 ? `last seen ${relativeLabel(new Date(visits[0].visited_at)).toLowerCase()}` : "no visits yet";

  const backToPatients = (
    <Link href={`${basePath}/patients`} className={backLink}>
      <ArrowLeftIcon size={16} />
      Back to patients
    </Link>
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-5">
        {backToPatients}
        <div className="rd-panel h-[8.5rem] animate-pulse motion-reduce:animate-none" />
        <div className="rd-panel overflow-hidden"><TableSkeleton rows={5} /></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="mx-auto max-w-7xl space-y-5">
        {backToPatients}

        <div className="rd-panel overflow-hidden">
          <EmptyState
            title={loadError === "failed" ? "Could not load this record" : "Patient not found"}
            hint={
              loadError === "failed"
                ? "Something went wrong reaching the server. Refresh the page to try again."
                : "No patient exists with this record number."
            }
            Icon={FileTextIcon}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {backToPatients}

      <header className="rd-panel relative overflow-hidden">
        <HeaderGlow />
        <div className="relative flex flex-wrap items-center justify-between gap-5 p-6">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar name={patient.name} className="size-14 text-base" />

            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">{roleLabel}</p>
              <h1 className="mt-1.5 truncate text-2xl font-bold tracking-tight text-rd-title">{patient.name}</h1>
              <p className="mt-1.5 text-sm text-rd-muted">
                {[`ID #${patient.patientid}`, patient.age ? `${patient.age} yrs` : null, patient.sex, `${visits.length} ${visits.length === 1 ? "visit" : "visits"}`, lastVisitLabel]
                  .filter(Boolean)
                  .join("  ·  ")}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div role="tablist" aria-label="Patient record sections" className="flex w-full gap-1 rounded-2xl border border-rd-hair bg-rd-sunken p-1">
        {TABS.map(({ id: tabId, label, Icon }) => {
          const active = activeTab === tabId;

          return (
            <button
              key={tabId}
              type="button"
              role="tab"
              id={`tab-${tabId}`}
              aria-selected={active}
              aria-controls={`panel-${tabId}`}
              onClick={() => setActiveTab(tabId)}
              className={`rd-press rd-focus inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition duration-200 ${
                active ? "bg-rd-card text-rd-title shadow-[var(--rd-lift)]" : "text-rd-muted hover:text-rd-title"
              }`}
            >
              <Icon size={16} className={active ? "text-rd-cyan" : undefined} />
              {label}
              {tabId === "visits" && visits.length > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${active ? "rd-tint-cyan" : "bg-rd-raised text-rd-muted"}`}>
                  {visits.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeTab === "overview" && (
        <section id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <InfoCard
            title="Demographics"
            caption="Identity as recorded at registration"
            Icon={UserIcon}
            tint="rd-tint-cyan"
            items={[
              { label: "Full name", icon: UserIcon, value: patient.name },
              { label: "Record number", icon: FileTextIcon, value: `#${patient.patientid}` },
              { label: "Birthdate", icon: CakeIcon, value: patient.birthdate ? new Date(patient.birthdate).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) : null },
              { label: "Age", icon: ClockIcon, value: patient.age ? `${patient.age} years old` : null },
              { label: "Sex", icon: UserIcon, value: titleCase(patient.sex) },
              { label: "Civil status", icon: HeartIcon, value: titleCase(patient.civilStatus) },
            ]}
          />

          <InfoCard
            title="Contact"
            caption="How the clinic reaches this patient"
            Icon={PhoneIcon}
            tint="rd-tint-green"
            items={[
              { label: "Mobile number", icon: PhoneIcon, value: patient.mobilenum, href: patient.mobilenum ? `tel:${String(patient.mobilenum).replace(/[^\d+]/g, "")}` : null },
              { label: "Email", icon: MailIcon, value: patient.email, href: patient.email ? `mailto:${patient.email}` : null },
              { label: "Address", icon: MapPinIcon, value: patient.address, span: true },
            ]}
          />
        </section>
      )}

      {activeTab === "visits" && (
        <section id="panel-visits" role="tabpanel" aria-labelledby="tab-visits" className="rd-panel overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rd-hair p-4">
            <div>
              <h2 className="text-lg font-semibold text-rd-title">Visit history</h2>
              <p className="mt-0.5 text-sm text-rd-muted">Previous visits and laboratory requests.</p>
            </div>
            <span className="text-sm text-rd-muted">{visits.length} visit{visits.length !== 1 ? "s" : ""}</span>
          </div>

          {visits.length === 0 ? (
            <EmptyState title="No visit history" hint="This patient has no recorded visits." Icon={CalendarIcon} />
          ) : (
            <ol className="relative p-4 sm:p-6">
              <span aria-hidden="true" className="absolute bottom-10 left-[2.4rem] top-10 w-px bg-gradient-to-b from-rd-cyan/40 via-rd-hair-strong to-transparent sm:left-[3.4rem]" />

              {visits.map((visit, index) => {
                const date = new Date(visit.visited_at);
                const isLatest = index === 0;

                return (
                  <li key={visit.visitid} className="group relative flex gap-4 pb-5 last:pb-0 sm:gap-5">
                    <span aria-hidden="true" className={`relative z-10 grid size-11 flex-none place-items-center rounded-2xl border text-xs font-bold tabular-nums transition duration-200 ${isLatest ? "border-transparent bg-rd-cyan text-rd-on-cyan shadow-[0_10px_24px_-10px_var(--rd-accent-shadow)]" : "border-rd-hair-strong bg-rd-card text-rd-muted group-hover:border-rd-cyan/60 group-hover:text-rd-cyan"}`}>
                      {isLatest ? <CalendarIcon size={18} /> : visits.length - index}
                    </span>

                    <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-2xl border border-rd-hair bg-rd-sunken p-4 transition duration-200 group-hover:border-rd-cyan/45 group-hover:shadow-[var(--rd-lift)]">
                      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-10 gap-y-4">
                        <div className="min-w-[7rem]">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">Visit</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <p className="text-base font-bold text-rd-title">#{visits.length - index}</p>
                            {isLatest && <span className="rd-tint-cyan rounded-full px-2 py-0.5 text-[11px] font-bold">Latest</span>}
                          </div>
                        </div>

                        <div className="min-w-[8rem]">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">When</p>
                          <p className={`mt-1 text-base font-semibold ${recencyTone(date)}`}>{relativeLabel(date)}</p>
                        </div>

                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">Recorded</p>
                          <p className="mt-1 truncate text-base font-medium tabular-nums text-rd-label">
                            {date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                            {" · "}
                            {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>

                      <Link href={`${basePath}/visitation/${visit.visitid}`} aria-label={`Open the visit on ${date.toLocaleDateString()}`} className="rd-press rd-focus inline-flex min-h-11 flex-none cursor-pointer items-center gap-1.5 rounded-xl border border-rd-cyan/35 bg-rd-cyan/10 px-4 text-sm font-semibold text-rd-cyan transition duration-200 hover:border-transparent hover:bg-rd-cyan hover:text-rd-on-cyan hover:shadow-[0_10px_24px_-10px_var(--rd-accent-shadow)]">
                        Open visit
                        <ChevronRightIcon size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      )}

      {activeTab === "trends" && (
        <>
          <section id="panel-trends" role="tabpanel" aria-labelledby="tab-trends" className="rd-panel overflow-hidden">
            <div className="border-b border-rd-hair p-4">
              <h2 className="text-lg font-semibold text-rd-title">Test history</h2>
              <p className="mt-0.5 text-sm text-rd-muted">Pick a test and a value to trace it across every visit.</p>
            </div>

            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-rd-muted">Test</span>
                <select value={selectedTest?.id ?? ""} onChange={handleTestChange} data-empty={!selectedTest} className="rd-input">
                  <option value="">Select a test</option>
                  {tests.map((test) => (
                    <option key={test.id} value={test.id}>{test.name}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-rd-muted">Value</span>
                <select value={selectedField ?? ""} onChange={handleFieldChange} disabled={!selectedTest} data-empty={!selectedField} className="rd-input">
                  <option value="">{selectedTest ? "Select a value" : "Choose a test first"}</option>
                  {selectedTest?.fields.map((field) => (
                    <option key={field.value} value={field.value}>{field.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          {!selectedField ? (
            <section className="rd-panel">
              <EmptyState title="No value selected" hint="Choose a test and a value above to plot its history." Icon={FlaskIcon} />
            </section>
          ) : loadingHistory || chartLoading ? (
            <section className="rd-panel overflow-hidden">
              <div className="h-16 animate-pulse bg-rd-raised motion-reduce:animate-none" />
              <div className="p-4">
                <div className="h-64 animate-pulse rounded-xl bg-rd-raised motion-reduce:animate-none" />
              </div>
            </section>
          ) : isNumeric && chartData.length > 0 ? (
            <>
              <section className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Latest reading", value: latestReading?.value ?? "—", hint: latestReading?.date ?? "No readings", tint: "rd-tint-cyan", Icon: FlaskIcon },
                  { label: "Change since previous", value: readingDelta === null ? "—" : `${readingDelta > 0 ? "+" : ""}${readingDelta.toFixed(2)}`, hint: readingDelta === null ? "Needs two readings" : readingDelta === 0 ? "Holding steady" : readingDelta > 0 ? "Higher than last time" : "Lower than last time", tint: readingDelta === null || readingDelta === 0 ? "rd-tint-cyan" : "rd-tint-amber", Icon: readingDelta === null || readingDelta === 0 ? MinusIcon : readingDelta > 0 ? TrendUpIcon : TrendDownIcon },
                  { label: "Readings on file", value: chartData.length, hint: "Across all visits", tint: "rd-tint-green", Icon: CalendarIcon },
                ].map(({ label, value, hint, tint, Icon }) => (
                  <article key={label} className="rd-panel relative overflow-hidden p-5">
                    <span aria-hidden="true" className={`${tint} absolute inset-x-0 top-0 h-1`} />

                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-rd-label">{label}</p>
                      <span className={`${tint} grid size-10 flex-none place-items-center rounded-xl`}>
                        <Icon size={20} />
                      </span>
                    </div>

                    <p className="mt-4 truncate text-3xl font-bold tabular-nums tracking-tight text-rd-title">{value}</p>
                    <p className="mt-1 text-sm text-rd-muted">{hint}</p>
                  </article>
                ))}
              </section>

              <PatientTestChart data={chartData} title={selectedTest?.fields.find((field) => field.value === selectedField)?.label} />
            </>
          ) : (
            <section className="rd-panel overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rd-hair p-4">
                <h2 className="text-lg font-semibold text-rd-title">{selectedTest?.fields.find((field) => field.value === selectedField)?.label}</h2>
              </div>

              <div className="p-4 text-sm text-rd-muted">
                {chartError ? "The chart could not be generated from the selected data." : "No usable numbers are available for this field."}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
