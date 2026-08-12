"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PatientTestChart from "@/components/patient/patientTestChart";

import {
    ArrowLeftIcon,
    Avatar,
    CalendarIcon,
    ChevronRightIcon,
    ClockIcon,
    EmptyState,
    FileTextIcon,
    FlaskIcon,
    HeaderGlow,
    TableSkeleton,
    backLink,
    rowAction,
    td,
    th,
} from "../../_ui";

export default function DoctorPatientPage() {

    const tests = [
        {
            id: 1,
            name: "Blood Type",
            fields: [
                { value: "bloodtype", label: "Blood Type" },
                { value: "rhFactor", label: "Rh Factor" }
            ]
        },

        {
            id: 2,
            name: "Chemistry",
            fields: [
                { value: "glucose", label: "Glucose" },
                { value: "creatinine", label: "Creatinine" },
                { value: "uricAcid", label: "Uric Acid" },
                { value: "totalCholesterol", label: "Total Cholesterol" },
                { value: "triglycerides", label: "Triglycerides" },
                { value: "hdlCholesterol", label: "HDL Cholesterol" },
                { value: "ldlCholesterol", label: "LDL Cholesterol" },
                { value: "sgot", label: "SGOT" },
                { value: "sgpt", label: "SGPT" },
                { value: "totalBilirubin", label: "Total Bilirubin" },
                { value: "directBilirubin", label: "Direct Bilirubin" },
                { value: "indirectBilirubin", label: "Indirect Bilirubin" },
                { value: "hba1c", label: "HbA1c" },
                { value: "bun", label: "BUN" }
            ]
        },

        {
            id: 3,
            name: "Dengue",
            fields: [
                { value: "igg", label: "IgG" },
                { value: "igm", label: "IgM" },
                { value: "ns1", label: "NS1" }
            ]
        },

        {
            id: 4,
            name: "FOBT",
            fields: [
                { value: "fobtResult", label: "FOBT Result" }
            ]
        },

        {
            id: 5,
            name: "Hepatitis",
            fields: [
                { value: "hbsagResult", label: "HBsAg Result" }
            ]
        },

        {
            id: 6,
            name: "Hematology",
            fields: [
                { value: "hemoglobinMass", label: "Hemoglobin Mass" },
                { value: "rbcNumConcentration", label: "RBC Number Concentration" },
                { value: "wbcNumConcentration", label: "WBC Number Concentration" },
                { value: "bleedingTime", label: "Bleeding Time" },
                { value: "clottingTime", label: "Clotting Time" },
                { value: "bloodGroup", label: "Blood Group" },
                { value: "plateletCount", label: "Platelet Count" },
                { value: "hematocrit", label: "Hematocrit" },
                { value: "segmenters", label: "Segmenters" },
                { value: "band", label: "Band" },
                { value: "juvenile", label: "Juvenile" },
                { value: "lymphocytes", label: "Lymphocytes" },
                { value: "monocytes", label: "Monocytes" },
                { value: "eosinophils", label: "Eosinophils" },
                { value: "basophils", label: "Basophils" },
                { value: "mcv", label: "MCV" },
                { value: "mch", label: "MCH" },
                { value: "mchc", label: "MCHC" },
                { value: "bsmp", label: "BSMP" },
                { value: "rdwCv", label: "RDW-CV" },
                { value: "other", label: "Other" }
            ]
        },

        {
            id: 7,
            name: "OGTT",
            fields: [
                { value: "fbs", label: "Fasting Blood Sugar" },
                { value: "firstHour", label: "1 Hour" },
                { value: "secondHour", label: "2 Hours" }
            ]
        },

        {
            id: 8,
            name: "Pregnancy Test",
            fields: [
                { value: "ptHCGSerum", label: "Pregnancy Result" }
            ]
        },

        {
            id: 9,
            name: "Semen Analysis",
            fields: [
                { value: "appearance", label: "Appearance" },
                { value: "volume", label: "Volume" },
                { value: "ph", label: "pH" },
                { value: "viscosity", label: "Viscosity" },
                { value: "others", label: "Others" },
                { value: "morphology", label: "Morphology" },
                { value: "motility", label: "Motility" },
                { value: "wbc", label: "WBC" },
                { value: "rbc", label: "RBC" },
                { value: "m30mins", label: "30 Minutes" },
                { value: "m1hr", label: "1 Hour" },
                { value: "m2hr", label: "2 Hours" },
                { value: "v30mins", label: "Volume at 30 Minutes" },
                { value: "v1hr", label: "Volume at 1 Hour" },
                { value: "v2hr", label: "Volume at 2 Hours" },
                { value: "spermConcentration", label: "Sperm Concentration" },
                { value: "spermCount", label: "Sperm Count" }
            ]
        },

        {
            id: 10,
            name: "Stool Exam",
            fields: [
                { value: "color", label: "Color" },
                { value: "parasiticOva", label: "Parasitic Ova" },
                { value: "pussCells", label: "Pus Cells" },
                { value: "rbc", label: "RBC" },
                { value: "occultBlood", label: "Occult Blood" },
                { value: "fecalysisNo", label: "Fecalysis No." },
                { value: "consistency", label: "Consistency" },
                { value: "bacteria", label: "Bacteria" },
                { value: "fatGlobules", label: "Fat Globules" },
                { value: "others", label: "Others" }
            ]
        },

        {
            id: 11,
            name: "Thyroid Examination",
            fields: [
                { value: "t4", label: "T4" },
                { value: "tsh", label: "TSH" }
            ]
        },

        {
            id: 12,
            name: "Urinalysis",
            fields: [
                { value: "color", label: "Color" },
                { value: "transparency", label: "Transparency" },
                { value: "reaction", label: "Reaction" },
                { value: "sugar", label: "Sugar" },
                { value: "albumin", label: "Albumin" },
                { value: "specificgravity", label: "Specific Gravity" },
                { value: "pregnancytest", label: "Pregnancy Test" },
                { value: "others", label: "Others" },
                { value: "epithelialcells", label: "Epithelial Cells" },
                { value: "mucustread", label: "Mucus Thread" },
                { value: "pus", label: "Pus" },
                { value: "rbc", label: "RBC" },
                { value: "cast", label: "Cast" },
                { value: "renalCells", label: "Renal Cells" },
                { value: "crystal", label: "Crystal" },
                { value: "bacteria", label: "Bacteria" }
            ]
        },

        {
            id: 13,
            name: "VDRL",
            fields: [
                { value: "vdrl", label: "VDRL Result" }
            ]
        }
    ];

    const { id } = useParams();

    const [patient, setPatient] = useState(null);
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);

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

        const response = await fetch(
            `/api/doctor/patients/${id}/chart?testId=${selectedTest.id}&field=${selectedField}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to load chart data."
            );
        }

        const formattedData = data
            .map(row => ({
                date: new Date(row.date).toLocaleDateString(),
                value: Number(row.value)
            }))
            .filter(row => !Number.isNaN(row.value));

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

            const response = await fetch(
                `/api/doctor/patients/${id}`
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message || "Failed to load patient."
                );

            }

            setPatient(data.patient);
            setVisits(data.visits || []);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }

    async function fetchHistory(testId, field) {

        setLoadingHistory(true);

        try {

            const response = await fetch(
                `/api/doctor/patients/${id}/trends?testId=${testId}&field=${field}`
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message || "Failed to load history."
                );

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

    const test = tests.find(
        test => test.id === testId
    );

    setSelectedTest(test);
    setSelectedField(null);
    setHistory([]);
    setChartData([]);
    setChartError(false);

}

function handleFieldChange(e) {

    const field = e.target.value;

    setSelectedField(field);
    setHistory([]);
    setChartData([]);
    setChartError(false);

    if (selectedTest) {
        fetchHistory(selectedTest.id, field);
    }

}

    const values = history
        .map(item => item.value)
        .filter(value =>
            value !== null &&
            value !== undefined &&
            value !== ""
        );

    const isNumeric =
        values.length > 0 &&
        values.every(
            value => !Number.isNaN(Number(value))
        );

    const backToPatients = (
        <Link href="/dashboard/doctor/patients" className={backLink}>
            <ArrowLeftIcon size={16} />
            Back to patients
        </Link>
    );

    if (loading) {

        return (
            <div className="mx-auto max-w-6xl space-y-5">

                {backToPatients}

                <div className="rd-panel h-28 animate-pulse motion-reduce:animate-none" />

                <div className="rd-panel h-72 animate-pulse motion-reduce:animate-none" />

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rd-panel h-36 animate-pulse motion-reduce:animate-none" />
                    <div className="rd-panel h-36 animate-pulse motion-reduce:animate-none" />
                    <div className="rd-panel h-36 animate-pulse motion-reduce:animate-none" />
                </div>

                <div className="rd-panel overflow-hidden">
                    <TableSkeleton rows={4} />
                </div>

                <div className="rd-panel h-44 animate-pulse motion-reduce:animate-none" />

            </div>
        );

    }

    if (!patient) {

        return (
            <div className="mx-auto max-w-6xl space-y-5">

                {backToPatients}

                <div className="rd-panel overflow-hidden">
                    <EmptyState
                        title="Patient not found"
                        hint="The requested patient could not be loaded."
                        Icon={FileTextIcon}
                    />
                </div>

            </div>
        );

    }

    return (

        <div className="mx-auto max-w-6xl space-y-5">

            {/* HEADER */}

            {backToPatients}

            <header className="rd-panel relative overflow-hidden p-6">

                <HeaderGlow />

                <div className="relative flex flex-wrap items-center gap-4">

                    <Avatar name={patient.name} className="size-14 text-base" />

                    <div className="min-w-0">

                        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">
                            Patient record
                        </p>

                        <h1 className="mt-1.5 truncate text-2xl font-bold tracking-tight text-rd-title">
                            {patient.name}
                        </h1>

                        <p className="mt-1 text-sm text-rd-muted">
                            {[
                                `ID #${patient.patientid}`,
                                patient.age ? `${patient.age} yrs` : null,
                                patient.sex,
                            ]
                                .filter(Boolean)
                                .join(" · ")}
                        </p>

                    </div>

                </div>

            </header>


            {/* PATIENT INFORMATION */}

            <section className="rd-panel overflow-hidden">

                <div className="border-b border-rd-hair p-4">

                    <h2 className="text-lg font-semibold text-rd-title">
                        Patient information
                    </h2>

                    <p className="mt-0.5 text-sm text-rd-muted">
                        Demographics and contact details on file.
                    </p>

                </div>

                <dl className="grid gap-x-10 gap-y-6 p-4 sm:grid-cols-2 lg:grid-cols-3">

                    {[
                        { label: "Full name", value: patient.name, strong: true },
                        {
                            label: "Birthdate",
                            value: patient.birthdate
                                ? new Date(patient.birthdate).toLocaleDateString()
                                : null,
                        },
                        { label: "Age", value: patient.age ? `${patient.age} years old` : null },
                        { label: "Sex", value: patient.sex },
                        { label: "Civil status", value: patient.civilStatus },
                        { label: "Mobile number", value: patient.mobilenum },
                        { label: "Email", value: patient.email, wrap: true },
                        { label: "Address", value: patient.address, span: true },
                    ].map(({ label, value, strong, wrap, span }) => (

                        <div key={label} className={span ? "sm:col-span-2" : undefined}>

                            <dt className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                                {label}
                            </dt>

                            <dd
                                className={`mt-1 text-sm ${
                                    strong ? "font-medium text-rd-title" : "text-rd-label"
                                } ${wrap ? "break-words" : ""}`}
                            >
                                {value || <span className="text-rd-muted">—</span>}
                            </dd>

                        </div>

                    ))}

                </dl>

            </section>



            {/* VISIT SUMMARY */}

            <section className="grid gap-4 sm:grid-cols-3">

                {[
                    {
                        label: "Total visits",
                        value: visits.length,
                        hint: "Recorded encounters",
                        Icon: CalendarIcon,
                        chip: "bg-cyan-500/12 text-cyan-600",
                    },
                    {
                        label: "Last visit",
                        value:
                            visits.length > 0
                                ? new Date(visits[0].visited_at).toLocaleDateString()
                                : "—",
                        hint: visits.length > 0 ? "Most recent encounter" : "No visits yet",
                        Icon: ClockIcon,
                        chip: "bg-amber-500/12 text-amber-600",
                    },
                    {
                        label: "Patient ID",
                        value: `#${patient.patientid}`,
                        hint: "Internal record number",
                        Icon: FlaskIcon,
                        chip: "bg-emerald-500/12 text-emerald-600",
                    },
                ].map(({ label, value, hint, Icon, chip }) => (

                    <article key={label} className="rd-panel p-5">

                        <div className="flex items-start justify-between gap-3">

                            <p className="text-sm font-medium text-rd-label">{label}</p>

                            <span className={`grid size-10 flex-none place-items-center rounded-xl ${chip}`}>
                                <Icon size={20} />
                            </span>

                        </div>

                        <p className="mt-4 truncate text-2xl font-bold tabular-nums tracking-tight text-rd-title">
                            {value}
                        </p>

                        <p className="mt-1 text-sm text-rd-muted">{hint}</p>

                    </article>

                ))}

            </section>


            {/* VISIT HISTORY */}

            <section className="rd-panel overflow-hidden">

                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rd-hair p-4">

                    <div>

                        <h2 className="text-lg font-semibold text-rd-title">
                            Visit history
                        </h2>

                        <p className="mt-0.5 text-sm text-rd-muted">
                            Previous visits and laboratory requests.
                        </p>

                    </div>

                    <span className="text-sm text-rd-muted">
                        {visits.length} visit{visits.length !== 1 ? "s" : ""}
                    </span>

                </div>


                {visits.length === 0 ? (

                    <EmptyState
                        title="No visit history"
                        hint="This patient has no recorded visits."
                        Icon={CalendarIcon}
                    />

                ) : (

                    <div className="rd-scroll-thin overflow-x-auto">

                        <table className="w-full min-w-[560px]">

                            <thead>

                                <tr className="border-b border-rd-hair">

                                    <th className={th}>Visit</th>

                                    <th className={th}>Date</th>

                                    <th className={th}>Time</th>

                                    <th className={`${th} text-right`}>Action</th>

                                </tr>

                            </thead>

                            <tbody>

                                {visits.map((visit, index) => {

                                    const date = new Date(
                                        visit.visited_at
                                    );

                                    return (

                                        <tr
                                            key={visit.visitid}
                                            className="border-b border-rd-hair last:border-0 transition-colors hover:bg-rd-raised"
                                        >

                                            <td className={`${td} font-medium text-rd-title`}>
                                                Visit #{visits.length - index}
                                            </td>

                                            <td className={`${td} tabular-nums`}>
                                                {date.toLocaleDateString()}
                                            </td>

                                            <td className={`${td} tabular-nums`}>
                                                {date.toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </td>

                                            <td className={`${td} text-right`}>

                                                <Link
                                                    href={`/dashboard/doctor/visitation/${visit.visitid}`}
                                                    aria-label={`View visit on ${date.toLocaleDateString()}`}
                                                    className={rowAction}
                                                >
                                                    View visit
                                                    <ChevronRightIcon size={16} />
                                                </Link>

                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

            {/* TEST HISTORY */}

            <section className="rd-panel overflow-hidden">

                <div className="border-b border-rd-hair p-4">

                    <h2 className="text-lg font-semibold text-rd-title">
                        Test history
                    </h2>

                    <p className="mt-0.5 text-sm text-rd-muted">
                        Pick a test and a value to trace it across every visit.
                    </p>

                </div>

                <div className="grid gap-4 p-4 sm:grid-cols-2">

                    <label className="block">

                        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                            Test
                        </span>

                        <select
                            value={selectedTest?.id ?? ""}
                            onChange={handleTestChange}
                            data-empty={!selectedTest}
                            className="rd-input"
                        >

                            <option value="" disabled hidden>
                                Select a test
                            </option>

                            {tests.map(test => (

                                <option
                                    key={test.id}
                                    value={test.id}
                                >
                                    {test.name}
                                </option>

                            ))}

                        </select>

                    </label>

                    <label className="block">

                        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                            Value
                        </span>

                        <select
                            value={selectedField ?? ""}
                            onChange={handleFieldChange}
                            disabled={!selectedTest}
                            data-empty={!selectedField}
                            className="rd-input"
                        >

                            <option value="" disabled hidden>
                                {selectedTest ? "Select a value" : "Choose a test first"}
                            </option>

                            {selectedTest?.fields.map(field => (

                                <option
                                    key={field.value}
                                    value={field.value}
                                >
                                    {field.label}
                                </option>

                            ))}

                        </select>

                    </label>

                </div>

            </section>


            {!selectedField ? (

                <section className="rd-panel">
                    <EmptyState
                        title="No value selected"
                        hint="Choose a test and a value above to plot its history."
                        Icon={FlaskIcon}
                    />
                </section>

            ) : loadingHistory || chartLoading ? (

                <section className="rd-panel overflow-hidden">
                    <div className="h-16 animate-pulse bg-rd-raised motion-reduce:animate-none" />
                    <div className="p-4">
                        <div className="h-64 animate-pulse rounded-xl bg-rd-raised motion-reduce:animate-none" />
                    </div>
                </section>

            ) : isNumeric && chartData.length > 0 ? (

                <PatientTestChart
                    data={chartData}
                    title={
                        selectedTest?.fields.find(
                            field => field.value === selectedField
                        )?.label
                    }
                />

            ) : (

                <section className="rd-panel overflow-hidden">

                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rd-hair p-4">

                        <h2 className="text-lg font-semibold text-rd-title">
                            {selectedTest?.fields.find(
                                field => field.value === selectedField
                            )?.label}
                        </h2>

                        <span className="text-sm text-rd-muted">
                            {history.length} {history.length === 1 ? "reading" : "readings"}
                        </span>

                    </div>

                    {chartError && (
                        <p className="rd-status rd-status--error m-4">
                            The trend chart could not be loaded. Showing the recorded readings instead.
                        </p>
                    )}

                    {history.length === 0 ? (

                        <EmptyState
                            title="No historical data"
                            hint="Results for this value appear here once they are recorded."
                            Icon={FlaskIcon}
                        />

                    ) : (

                        <div className="rd-scroll-thin overflow-x-auto">

                            <table className="w-full">

                                <thead>

                                    <tr className="border-b border-rd-hair">

                                        <th className={th}>Date</th>

                                        <th className={th}>Result</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {history.map((item, index) => (

                                        <tr
                                            key={index}
                                            className="border-b border-rd-hair transition-colors last:border-0 hover:bg-rd-raised"
                                        >

                                            <td className={`${td} tabular-nums`}>
                                                {new Date(item.date).toLocaleDateString()}
                                            </td>

                                            <td className={`${td} font-medium text-rd-title`}>
                                                {item.value || (
                                                    <span className="text-rd-muted">—</span>
                                                )}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            )}



        </div>

    );

}