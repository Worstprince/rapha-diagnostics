"use client";

import { useState } from "react";
import LabReportHeader from "./labReportHeader";
import LabSignatures from "./labSignatures";

export default function BloodTypeForm({
    patient,
    onSubmit,
    initialData = {},
    hasExistingResult = false,
    readOnly = false,
    medtechName = "",
    doctorName = ""
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

        onSubmit(result);

    }

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-8 rounded-2xl border border-rd-hair bg-rd-card p-8"
        >

            <LabReportHeader
                patient={patient}
                title="HEMATOLOGY"
            />

            <table className="w-full border border-collapse text-center">

                <thead>

                    <tr>

                        <th className="border p-3">
                            Blood Grouping
                        </th>

                        <th className="border p-3">
                            Result
                        </th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td className="border p-4">
                            Blood Type
                        </td>

                        <td className="border p-4">

                            <select
                                name="bloodType"
                                value={result.bloodType}
                                onChange={handleChange}
                                disabled={readOnly}
                                className="w-full rounded border bg-rd-field p-2 disabled:cursor-not-allowed disabled:opacity-100"
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

                        <td className="border p-4">
                            RH Factor
                        </td>

                        <td className="border p-4">

                            <select
                                name="rhFactor"
                                value={result.rhFactor}
                                onChange={handleChange}
                                disabled={readOnly}
                                className="w-full rounded border bg-rd-field p-2 disabled:cursor-not-allowed disabled:opacity-100"
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

            <LabSignatures
    medtechName={medtechName}
    doctorName={doctorName}
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