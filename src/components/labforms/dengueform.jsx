"use client";

import { useState } from "react";
import LabReportHeader, { LabSignatures } from "./labReportHeader";

export default function DengueForm({
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

        ns1: initialData?.ns1 ?? "",
        igg: initialData?.igg ?? "",
        igm: initialData?.igm ?? ""

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
                title="IMMUNOLOGY and SEROLOGY"
            />

            <h2 className="text-center text-3xl font-bold">
                DENGUE DUO
            </h2>

            <div className="overflow-x-auto">
                <table className="mx-auto w-[360px] border-collapse border border-rd-hair-strong text-center">

                    <tbody>

                        <tr>

                            <td className="border border-rd-hair-strong p-6 font-bold">
                                NS1
                            </td>

                            <td className="border border-rd-hair-strong p-6">

                                <select
                                    name="ns1"
                                    value={result.ns1}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:opacity-100"
                                >

                                    <option value="">Select</option>
                                    <option value="POSITIVE">POSITIVE</option>
                                    <option value="NEGATIVE">NEGATIVE</option>

                                </select>

                            </td>

                        </tr>

                        <tr>

                            <td className="border border-rd-hair-strong p-6 font-bold">
                                IgG
                            </td>

                            <td className="border border-rd-hair-strong p-6">

                                <select
                                    name="igg"
                                    value={result.igg}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:opacity-100"
                                >

                                    <option value="">Select</option>
                                    <option value="POSITIVE">POSITIVE</option>
                                    <option value="NEGATIVE">NEGATIVE</option>

                                </select>

                            </td>

                        </tr>

                        <tr>

                            <td className="border border-rd-hair-strong p-6 font-bold">
                                IgM
                            </td>

                            <td className="border border-rd-hair-strong p-6">

                                <select
                                    name="igm"
                                    value={result.igm}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:opacity-100"
                                >

                                    <option value="">Select</option>
                                    <option value="POSITIVE">POSITIVE</option>
                                    <option value="NEGATIVE">NEGATIVE</option>

                                </select>

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