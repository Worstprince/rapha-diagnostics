"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PatientTestChart from "@/components/patient/patientTestChart";

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

    async function fetchChartData() {

    setChartLoading(true);

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

}

function handleFieldChange(e) {

    const field = e.target.value;

    setSelectedField(field);
    setHistory([]);
    setChartData([]);

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

    if (loading) {

        return (
            <div className="mx-auto max-w-6xl space-y-5">

                <div className="rd-panel h-32 animate-pulse motion-reduce:animate-none" />

                <div className="rd-panel h-72 animate-pulse motion-reduce:animate-none" />

                <div className="rd-panel h-96 animate-pulse motion-reduce:animate-none" />

            </div>
        );

    }

    if (!patient) {

        return (
            <div className="mx-auto max-w-6xl">

                <div className="rd-panel p-10 text-center">

                    <p className="font-medium text-rd-title">
                        Patient not found
                    </p>

                    <p className="mt-1 text-sm text-rd-muted">
                        The requested patient could not be loaded.
                    </p>

                    <Link
                        href="/dashboard/doctor/patients"
                        className="rd-btn rd-press rd-focus mt-5 inline-flex"
                    >
                        Back to Patients
                    </Link>

                </div>

            </div>
        );

    }

    return (

        <div className="mx-auto max-w-6xl space-y-5">

            {/* HEADER */}

            <header className="rd-panel p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">
                            Doctor
                        </p>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">
                            {patient.name}
                        </h1>

                        <p className="mt-1 text-sm text-rd-muted">
                            Patient ID #{patient.patientid}
                        </p>

                    </div>

                    <Link
                        href="/dashboard/doctor/patients"
                        className="rd-press rd-focus inline-flex min-h-10 items-center justify-center rounded-xl border border-rd-hair-strong bg-rd-sunken px-4 text-sm font-medium text-rd-label hover:border-rd-cyan/50 hover:bg-rd-cyan/10 hover:text-rd-cyan"
                    >
                        Back to Patients
                    </Link>

                </div>

            </header>


            {/* PATIENT INFORMATION */}

            <section className="rd-panel overflow-hidden">

                <div className="border-b border-rd-hair bg-rd-sunken px-6 py-4">

                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-rd-cyan">
                        Patient Information
                    </h2>

                </div>

                <div className="grid gap-x-10 gap-y-6 p-6 sm:grid-cols-2 lg:grid-cols-3">

                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                            Full Name
                        </p>

                        <p className="mt-1 text-sm font-medium text-rd-title">
                            {patient.name}
                        </p>
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                            Birthdate
                        </p>

                        <p className="mt-1 text-sm text-rd-label">
                            {patient.birthdate
                                ? new Date(patient.birthdate).toLocaleDateString()
                                : "—"
                            }
                        </p>
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                            Age
                        </p>

                        <p className="mt-1 text-sm text-rd-label">
                            {patient.age} years old
                        </p>
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                            Sex
                        </p>

                        <p className="mt-1 text-sm text-rd-label">
                            {patient.sex || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                            Civil Status
                        </p>

                        <p className="mt-1 text-sm text-rd-label">
                            {patient.civilStatus || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                            Mobile Number
                        </p>

                        <p className="mt-1 text-sm text-rd-label">
                            {patient.mobilenum || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                            Email
                        </p>

                        <p className="mt-1 break-words text-sm text-rd-label">
                            {patient.email || "—"}
                        </p>
                    </div>

                    <div className="sm:col-span-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                            Address
                        </p>

                        <p className="mt-1 text-sm text-rd-label">
                            {patient.address || "—"}
                        </p>
                    </div>

                </div>

            </section>



            {/* VISIT SUMMARY */}

            <section className="grid gap-5 sm:grid-cols-3">

                <div className="rd-panel p-5">

                    <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                        Total Visits
                    </p>

                    <p className="mt-2 text-2xl font-bold tabular-nums text-rd-title">
                        {visits.length}
                    </p>

                </div>

                <div className="rd-panel p-5">

                    <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                        Last Visit
                    </p>

                    <p className="mt-2 text-sm font-medium text-rd-title">
                        {visits.length > 0
                            ? new Date(visits[0].visited_at).toLocaleDateString()
                            : "No visits"
                        }
                    </p>

                </div>

                <div className="rd-panel p-5">

                    <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                        Patient ID
                    </p>

                    <p className="mt-2 text-2xl font-bold tabular-nums text-rd-title">
                        #{patient.patientid}
                    </p>

                </div>

            </section>


            {/* VISIT HISTORY */}

            <section className="rd-panel overflow-hidden">

                <div className="flex flex-col gap-2 border-b border-rd-hair bg-rd-sunken px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-rd-cyan">
                            Visit History
                        </h2>

                        <p className="mt-1 text-xs text-rd-muted">
                            Previous visits and laboratory requests.
                        </p>

                    </div>

                    <span className="text-sm text-rd-muted">
                        {visits.length} visit{visits.length !== 1 ? "s" : ""}
                    </span>

                </div>


                {visits.length === 0 ? (

                    <div className="p-10 text-center">

                        <p className="text-sm font-medium text-rd-title">
                            No visit history
                        </p>

                        <p className="mt-1 text-sm text-rd-muted">
                            This patient has no recorded visits.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="border-b border-rd-hair">

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-rd-muted">
                                        Visit
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-rd-muted">
                                        Date
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-rd-muted">
                                        Time
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-rd-muted">
                                        Action
                                    </th>

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

                                            <td className="px-6 py-4 text-sm font-medium text-rd-title">
                                                Visit #{visits.length - index}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-rd-label">
                                                {date.toLocaleDateString()}
                                            </td>

                                            <td className="px-6 py-4 text-sm tabular-nums text-rd-label">
                                                {date.toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </td>

                                            <td className="px-6 py-4 text-right">

                                                <Link
                                                    href={`/dashboard/doctor/visitation/${visit.visitid}`}
                                                    className="rd-press rd-focus inline-flex min-h-10 items-center rounded-xl border border-rd-hair-strong bg-rd-sunken px-3.5 text-sm font-medium text-rd-label hover:border-rd-cyan/50 hover:bg-rd-cyan/10 hover:text-rd-cyan"
                                                >
                                                    View Visit
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

            <section className="rd-panel p-5">

                <h2 className="text-lg font-semibold text-rd-title">
                    Test History
                </h2>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">

                    <div>

                        <label className="text-sm font-medium text-rd-label">
                            Test
                        </label>

                        <select
                            value={selectedTest?.id ?? ""}
                            onChange={handleTestChange}
                            className="mt-1 w-full rounded-xl border border-rd-hair-strong bg-rd-field px-4 py-3"
                        >

                            <option value="">
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

                    </div>


                    <div>

                        <label className="text-sm font-medium text-rd-label">
                            Value
                        </label>

                        <select
                            value={selectedField ?? ""}
                            onChange={handleFieldChange}
                            disabled={!selectedTest}
                            className="mt-1 w-full rounded-xl border border-rd-hair-strong bg-rd-field px-4 py-3 disabled:opacity-50"
                        >

                            <option value="">
                                Select a value
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

                    </div>

                </div>


                {selectedField && (

                    <div className="mt-5">

                        {loadingHistory ? (

                            <p className="text-sm text-rd-muted">
                                Loading history...
                            </p>

                        ) : history.length === 0 ? (

                            <p className="text-sm text-rd-muted">
                                No historical data available.
                            </p>

) : isNumeric ? (

    chartLoading ? (

        <p className="text-sm text-rd-muted">
            Loading chart...
        </p>

    ) : chartData.length === 0 ? (

        <p className="text-sm text-rd-muted">
            No chart data available.
        </p>

    ) : (

        <PatientTestChart
            data={chartData}
            title={
                selectedTest?.fields.find(
                    field => field.value === selectedField
                )?.label
            }
        />

    )

) : (

                            <div className="space-y-2">

                                {history.map((item, index) => (

                                    <div
                                        key={index}
                                        className="flex items-center justify-between rounded-xl border border-rd-hair bg-rd-sunken p-4"
                                    >

                                        <span className="text-sm text-rd-muted">
                                            {new Date(item.date).toLocaleDateString()}
                                        </span>

                                        <span className="font-medium text-rd-title">
                                            {item.value}
                                        </span>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                )}

            </section>



        </div>

    );

}