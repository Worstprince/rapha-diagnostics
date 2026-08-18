"use client";

import { useEffect, useState } from "react";
import LabReportHeader, { LabSignatures } from "./labReportHeader";

export default function HIVForm({
    patient,
    onSubmit,
    initialData = {},
    hasExistingResult = false,
    readOnly = false,
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
        hiv: initialData?.hiv ?? "",
    });

    useEffect(() => {

        if (initialData) {

            setResult({
                hiv: initialData?.hiv ?? "",
            });

        }

    }, [initialData]);

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

            <h2 className="text-center text-2xl font-bold">
                HIV 1/2 SCREENING
            </h2>

            <div className="overflow-x-auto">

                <table className="mx-auto w-full max-w-2xl border-collapse border border-rd-hair-strong text-center">

                    <thead>

                        <tr>

                            <th className="border border-rd-hair-strong p-3">
                                TEST NAME
                            </th>

                            <th className="border border-rd-hair-strong p-3">
                                RESULT
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td className="border border-rd-hair-strong p-4 font-semibold">
                                HIV 1/2 Screening
                            </td>

                            <td className="border border-rd-hair-strong p-4">

                                <select
                                    name="hiv"
                                    value={result.hiv}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded border border-rd-hair-strong bg-rd-field p-2 text-center font-semibold uppercase disabled:cursor-not-allowed disabled:opacity-100"
                                >

                                    <option value="">
                                        Select
                                    </option>

                                    <option value="Negative">
                                        Negative
                                    </option>

                                    <option value="Positive">
                                        Positive
                                    </option>

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
                        {hasExistingResult
                            ? "Update Result"
                            : "Save Result"}
                    </button>

                </div>

            )}

        </form>

    );

}