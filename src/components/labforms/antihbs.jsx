"use client";

import { useEffect, useState } from "react";
import LabReportHeader, { LabSignatures } from "./labReportHeader";

export default function AntiHBSForm({
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
        antiHBS: initialData?.antiHBS ?? "",
        value: initialData?.value ?? "",
    });

    useEffect(() => {

        if (initialData) {

            setResult({
                antiHBS: initialData?.antiHBS ?? "",
                value: initialData?.value ?? "",
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
                ANTI-HBs
            </h2>

            <div className="overflow-x-auto">

                <table className="mx-auto w-full max-w-2xl border-collapse border border-rd-hair-strong text-center">

                    <thead>

                        <tr>

                            <th className="border border-rd-hair-strong p-3">
                                EXAMINATION
                            </th>

                            <th className="border border-rd-hair-strong p-3">
                                RESULT
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td className="border border-rd-hair-strong p-4 font-semibold">
                                Anti-HBs
                            </td>

<td className="border border-rd-hair-strong p-0">

    <div className="grid grid-cols-2">

        {/* Anti-HBs result */}
        <div className="border-r border-rd-hair-strong p-4">

            <select
                name="antiHBS"
                value={result.antiHBS}
                onChange={handleChange}
                disabled={readOnly}
                className="w-full rounded border border-rd-hair-strong bg-rd-field p-2 text-center disabled:cursor-not-allowed disabled:opacity-100"
            >
                <option value="">
                    Select
                </option>

                <option value="Reactive">
                    Reactive
                </option>

                <option value="Non-Reactive">
                    Non-Reactive
                </option>
            </select>

        </div>

        {/* Numeric value + unit */}
        <div className="flex items-center justify-center gap-1 p-4">

            <input
                type="text"
                name="value"
                value={result.value}
                onChange={handleChange}
                readOnly={readOnly}
                placeholder="0.00"
                className="w-full rounded bg-rd-field p-2 text-center"
            />

            <span className="whitespace-nowrap text-sm text-rd-muted">
                mIU/mL
            </span>

        </div>

    </div>

</td>

                        </tr>

                    </tbody>

                </table>

            </div>

            <div className="mx-auto w-full max-w-2xl">

                <h3 className="font-semibold text-rd-title">
                    Reference Range:
                </h3>

                <div className="mt-2 space-y-1 text-sm text-rd-muted">

                    <p>
                        <span className="font-medium text-rd-title">
                            NON REACTIVE
                        </span>
                        {" : <10.0 mIU/mL"}
                    </p>

                    <p>
                        <span className="font-medium text-rd-title">
                            REACTIVE
                        </span>
                        {" : ≥10.0 mIU/mL"}
                    </p>

                </div>

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