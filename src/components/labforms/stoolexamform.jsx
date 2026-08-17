"use client";

import { useState } from "react";
import LabReportHeader, { LabSignatures } from "./labReportHeader";

export default function StoolExamForm({
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
        color: initialData?.color ?? "",
        parasiticOva: initialData?.parasiticOva ?? "",
        consistency: initialData?.consistency ?? "",
        pussCells: initialData?.pussCells ?? "",
        bacteria: initialData?.bacteria ?? "",
        rbc: initialData?.rbc ?? "",
        fatGlobules: initialData?.fatGlobules ?? "",
        occultBlood: initialData?.occultBlood ?? "",
        others: initialData?.others ?? "",
        fecalysisNo: initialData?.fecalysisNo ?? ""
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
                title="STOOL EXAM"
            />

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-rd-hair-strong text-center">

                    <tbody>

                        {/* COLOR / CONSISTENCY */}

                        <tr>

                            <td className="w-[15%] border border-rd-hair-strong p-2 text-left">
                                Color:
                            </td>

                            <td className="w-[35%] border border-rd-hair-strong p-2">

                                <input
                                    type="text"
                                    name="color"
                                    value={result.color}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2 text-center disabled:cursor-not-allowed disabled:bg-rd-raised"
                                />

                            </td>

                            <td className="w-[15%] border border-rd-hair-strong p-2 text-left">
                                Consistency:
                            </td>

                            <td className="w-[35%] border border-rd-hair-strong p-2">

                                <input
                                    type="text"
                                    name="consistency"
                                    value={result.consistency}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2 text-center disabled:cursor-not-allowed disabled:bg-rd-raised"
                                />

                            </td>

                        </tr>

                        {/* PARASITIC OVA / BACTERIA */}

                        <tr>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                Parasitic Ova:
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <input
                                    type="text"
                                    name="parasiticOva"
                                    value={result.parasiticOva}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2 text-center disabled:cursor-not-allowed disabled:bg-rd-raised"
                                />

                            </td>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                Bacteria:
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <input
                                    type="text"
                                    name="bacteria"
                                    value={result.bacteria}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2 text-center disabled:cursor-not-allowed disabled:bg-rd-raised"
                                />

                            </td>

                        </tr>

                        {/* PUSS CELLS / FAT GLOBULES */}

                        <tr>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                Puss Cells:
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <input
                                    type="text"
                                    name="pussCells"
                                    value={result.pussCells}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:bg-rd-raised"
                                />

                            </td>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                Fat Globules:
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <input
                                    type="text"
                                    name="fatGlobules"
                                    value={result.fatGlobules}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:bg-rd-raised"
                                />

                            </td>

                        </tr>

                        {/* RBC / OTHERS */}

                        <tr>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                Rbc:
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

                            <td
                                rowSpan="3"
                                className="border border-rd-hair-strong p-2 text-left align-top"
                            >
                                Others:
                            </td>

                            <td
                                rowSpan="3"
                                className="border border-rd-hair-strong p-2 align-top"
                            >

                                <textarea
                                    name="others"
                                    value={result.others}
                                    onChange={handleChange}
                                    rows="6"
                                    disabled={readOnly}
                                    className="w-full resize-none rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:bg-rd-raised"
                                />

                            </td>

                        </tr>

                        {/* OCCULT BLOOD */}

                        <tr>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                Occult Blood:
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <input
                                    type="text"
                                    name="occultBlood"
                                    value={result.occultBlood}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:bg-rd-raised"
                                />

                            </td>

                        </tr>

                        {/* FECALYSIS NO. */}

                        <tr>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                Fecalysis No.:
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <input
                                    type="text"
                                    name="fecalysisNo"
                                    value={result.fecalysisNo}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:bg-rd-raised"
                                />

                            </td>

                        </tr>

                    </tbody>

                </table>
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