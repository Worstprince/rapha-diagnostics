"use client";

import { useState } from "react";
import { REFERENCE_RANGES } from "./referenceRanges";
import LabReportHeader, { LabSignatures } from "./labReportHeader";
import ResultField from "./ResultField";

const RANGES = REFERENCE_RANGES.semenalysis;

export default function SemenAnalysisForm({
    patient,
    onSubmit,
    initialData = {},
    readOnly = false,
    hasExistingResult = false,
    doctorId,
    doctorName,
    doctorLicense,
    doctorExtension,
    medtechId,
    medtechName,
    medtechLicense,
    medtechExtension,
}) {

    const [result, setResult] = useState({
        appearance: initialData?.appearance ?? "",
        volume: initialData?.volume ?? "",
        ph: initialData?.pH ?? "",
        viscosity: initialData?.viscosity ?? "",
        others: initialData?.others ?? "",
        morphology: initialData?.morphology ?? "",
        motility: initialData?.motility ?? "",
        wbc: initialData?.wbc ?? "",
        rbc: initialData?.rbc ?? "",

        motility30min: initialData?.m30mins ?? "",
        motility1hr: initialData?.m1hr ?? "",
        motility2hr: initialData?.m2hr ?? "",

        viability30min: initialData?.v30mins ?? "",
        viability1hr: initialData?.v1hr ?? "",
        viability2hr: initialData?.v2hr ?? "",

        spermConcentration: initialData?.spermConcentration ?? "",
        spermCount: initialData?.spermCount ?? ""
    });

    function handleChange(e) {

        if (readOnly) return;

        const { name, value } = e.target;

        setResult(prev => ({
            ...prev,
            [name]: value
        }));

    }

    function handleSubmit(e) {

        e.preventDefault();

        if (readOnly) return;

        onSubmit(result, hasExistingResult);

    }

    return (

        <form
            onSubmit={handleSubmit}
            className="print-result space-y-8 rounded-2xl border border-rd-hair bg-rd-card p-8"
        >

            <LabReportHeader
                patient={patient}
                title="SEMEN ANALYSIS"
            />

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-rd-hair-strong text-center">

                    <thead>

                        <tr>

                            <th
                                colSpan="3"
                                className="border border-rd-hair-strong p-2 text-lg"
                            >
                                MACROSCOPIC
                            </th>

                            <th
                                colSpan="2"
                                className="border border-rd-hair-strong p-2 text-lg"
                            >
                                MICROSCOPIC
                            </th>

                        </tr>

                        <tr>

                            <th className="border border-rd-hair-strong p-2">
                                Examination
                            </th>

                            <th className="border border-rd-hair-strong p-2">
                                Result
                            </th>

                            <th className="border border-rd-hair-strong p-2">
                                NORMAL VALUE
                            </th>

                            <th className="border border-rd-hair-strong p-2">
                                Examination
                            </th>

                            <th className="border border-rd-hair-strong p-2">
                                Result
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                APPEARANCE
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <input
                                    type="text"
                                    name="appearance"
                                    value={result.appearance}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:bg-rd-raised"
                                />

                            </td>

                            <td className="border border-rd-hair-strong p-2">
                                Grayish-white
                            </td>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                MORPHOLOGY
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <input
                                    type="text"
                                    name="morphology"
                                    value={result.morphology}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:bg-rd-raised"
                                />

                            </td>

                        </tr>

                        <tr>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                VOLUME
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <ResultField
                                    name="volume"
                                    value={result.volume}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    range={RANGES.volume}
                                    sex={patient?.sex}
                                />

                            </td>

                            <td className="border border-rd-hair-strong p-2">
                                2-5mL
                            </td>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                MOTILITY
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <input
                                    type="text"
                                    name="motility"
                                    value={result.motility}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:bg-rd-raised"
                                />

                            </td>

                        </tr>

                        <tr>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                pH
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <ResultField
                                    name="ph"
                                    value={result.ph}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    range={RANGES.ph}
                                    sex={patient?.sex}
                                />

                            </td>

                            <td className="border border-rd-hair-strong p-2">
                                7.2-8.0
                            </td>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                WBC
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <input
                                    type="text"
                                    name="wbc"
                                    value={result.wbc}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:bg-rd-raised"
                                />

                            </td>

                        </tr>
                        {/* VISCOSITY / RBC */}

                        <tr>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                VISCOSITY
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <ResultField
                                    name="viscosity"
                                    value={result.viscosity}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    range={RANGES.viscosity}
                                    sex={patient?.sex}
                                />

                            </td>

                            <td className="border border-rd-hair-strong p-2">
                                1-4
                            </td>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                RBC
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <input
                                    type="text"
                                    name="rbc"
                                    value={result.rbc}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:bg-rd-raised"
                                />

                            </td>

                        </tr>

                        {/* OTHERS / MOTILITY + VIABILITY */}

                        <tr>

                            <td
                                rowSpan="4"
                                className="border border-rd-hair-strong p-2 text-left align-top"
                            >
                                OTHERS:
                            </td>

                            <td
                                rowSpan="4"
                                colSpan="2"
                                className="border border-rd-hair-strong p-2 align-top"
                            >

                                <textarea
                                    name="others"
                                    value={result.others}
                                    onChange={handleChange}
                                    rows="7"
                                    disabled={readOnly}
                                    className="w-full resize-none rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:bg-rd-raised"
                                />

                            </td>

                            <td className="border border-rd-hair-strong p-2 font-bold">
                                MOTILITY
                            </td>

                            <td className="border border-rd-hair-strong p-2 font-bold">
                                VIABILITY
                            </td>

                        </tr>

                        {/* 30 MINUTES */}

                        <tr>

                            <td className="border border-rd-hair-strong p-2">

                                <div className="flex items-center gap-2">

                                    <span>30mins</span>

                                    <input
                                        type="text"
                                        name="motility30min"
                                        value={result.motility30min}
                                        onChange={handleChange}
                                        disabled={readOnly}
                                        className="w-full rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:bg-rd-raised"
                                    />

                                </div>

                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <div className="flex items-center gap-2">

                                    <span>30mins</span>

                                    <input
                                        type="text"
                                        name="viability30min"
                                        value={result.viability30min}
                                        onChange={handleChange}
                                        disabled={readOnly}
                                        className="w-full rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:bg-rd-raised"
                                    />

                                </div>

                            </td>

                        </tr>

                        {/* 1 HOUR */}

                        <tr>

                            <td className="border border-rd-hair-strong p-2">

                                <div className="flex items-center gap-2">

                                    <span>1Hour</span>

                                    <input
                                        type="text"
                                        name="motility1hr"
                                        value={result.motility1hr}
                                        onChange={handleChange}
                                        disabled={readOnly}
                                        className="w-full rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:bg-rd-raised"
                                    />

                                </div>

                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <div className="flex items-center gap-2">

                                    <span>1Hour</span>

                                    <input
                                        type="text"
                                        name="viability1hr"
                                        value={result.viability1hr}
                                        onChange={handleChange}
                                        disabled={readOnly}
                                        className="w-full rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:bg-rd-raised"
                                    />

                                </div>

                            </td>

                        </tr>

                        {/* 2 HOURS */}

                        <tr>

                            <td className="border border-rd-hair-strong p-2">

                                <div className="flex items-center gap-2">

                                    <span>2hours</span>

                                    <input
                                        type="text"
                                        name="motility2hr"
                                        value={result.motility2hr}
                                        onChange={handleChange}
                                        disabled={readOnly}
                                        className="w-full rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:bg-rd-raised"
                                    />

                                </div>

                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <div className="flex items-center gap-2">

                                    <span>2hours</span>

                                    <input
                                        type="text"
                                        name="viability2hr"
                                        value={result.viability2hr}
                                        onChange={handleChange}
                                        disabled={readOnly}
                                        className="w-full rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:bg-rd-raised"
                                    />

                                </div>

                            </td>

                        </tr>

                    </tbody>

                </table>
            </div>

            {/* SPERM CONCENTRATION / COUNT */}

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-rd-hair-strong text-center">

                    <tbody>

                        <tr>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                SPERM CONCENTRATION/mL
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <ResultField
                                    name="spermConcentration"
                                    value={result.spermConcentration}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    range={RANGES.spermConcentration}
                                    sex={patient?.sex}
                                />

                            </td>

                            <td className="border border-rd-hair-strong p-2">
                                &gt;20million/mL
                            </td>

                        </tr>

                        <tr>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                SPERM COUNT/EJACULATE
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <ResultField
                                    name="spermCount"
                                    value={result.spermCount}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    range={RANGES.spermCount}
                                    sex={patient?.sex}
                                />

                            </td>

                            <td className="border border-rd-hair-strong p-2">
                                &gt;40million/ejaculate
                            </td>

                        </tr>

                    </tbody>

                </table>
            </div>

            {/* SPERM MOTILITY GRADING */}

            <div className="text-sm">

                <p className="font-semibold">
                    SPERM MOTILITY GRADING
                </p>

                <p>
                    A. Rapid, straight-line movement — 4
                </p>

                <p>
                    B. Slower speed, some lateral movement — 3
                </p>

                <p>
                    B.1 Slow forward progression — 2
                </p>

                <p>
                    C. No forward progression — 1
                </p>

                <p>
                    D. No movement — 0
                </p>

            </div>

<LabSignatures
                        doctorId={doctorId}
                        doctorName={doctorName}
                        doctorLicense={doctorLicense}
                        doctorExtension={doctorExtension}
                        medtechId={medtechId}
                        medtechName={medtechName}
                        medtechLicense={medtechLicense}
                        medtechExtension={medtechExtension}
                    />

            {!readOnly && (

                <div className="flex justify-end">

                    <button
                        type="submit"
                        className="rd-btn rd-press rd-focus"
                    >
                        {hasExistingResult  ? "Update Result" : "Save Result"}
                    </button>

                </div>

            )}

        </form>

    );

}