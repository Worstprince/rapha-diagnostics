"use client";

import { useState } from "react";
import LabReportHeader, { LabSignatures } from "./labReportHeader";

export default function BloodTypeForm({
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
        bloodType: initialData?.bloodType ?? "",
        rhFactor: initialData?.rhFactor ?? ""
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
                title="HEMATOLOGY"
            />

            <div className="overflow-x-auto">
                <table className="w-full border border-rd-hair-strong border-collapse text-center">

                    <thead>

                        <tr>

                            <th className="border border-rd-hair-strong p-3">
                                Blood Grouping
                            </th>

                            <th className="border border-rd-hair-strong p-3">
                                Result
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td className="border border-rd-hair-strong p-4">
                                Blood Type
                            </td>

                            <td className="border border-rd-hair-strong p-4">

                                <select
                                    name="bloodType"
                                    value={result.bloodType}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded border border-rd-hair-strong bg-rd-field p-2 disabled:cursor-not-allowed disabled:opacity-100"
                                >

                                    <option value="">
                                        Select
                                    </option>

                                    <option value="A">
                                        A
                                    </option>

                                    <option value="B">
                                        B
                                    </option>

                                    <option value="AB">
                                        AB
                                    </option>

                                    <option value="O">
                                        O
                                    </option>

                                </select>

                            </td>

                        </tr>

                        <tr>

                            <td className="border border-rd-hair-strong p-4">
                                RH Factor
                            </td>

                            <td className="border border-rd-hair-strong p-4">

                                <select
                                    name="rhFactor"
                                    value={result.rhFactor}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded border border-rd-hair-strong bg-rd-field p-2 disabled:cursor-not-allowed disabled:opacity-100"
                                >

                                    <option value="">
                                        Select
                                    </option>

                                    <option value="Positive">
                                        Positive
                                    </option>

                                    <option value="Negative">
                                        Negative
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
                        {hasExistingResult  ? "Update Result" : "Save Result"}
                    </button>

                </div>

            )}

        </form>

    );

}