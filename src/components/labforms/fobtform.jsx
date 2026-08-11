"use client";

import { useState } from "react";
import LabReportHeader from "./labReportHeader";

export default function FOBTForm({
    patient,
    onSubmit,
    initialData = {},
    readOnly = false,
    hasExistingResult = false
}) {

    const [result, setResult] = useState({
        fobt: initialData?.fobtResult ?? ""
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
            className="space-y-8 rounded-2xl border border-rd-hair bg-rd-card p-8"
        >

            <LabReportHeader
                patient={patient}
                title=""
            />

            <h2 className="text-center text-3xl font-bold">
                FECAL OCCULT BLOOD TEST
            </h2>

            <table className="mx-auto w-[500px] border-collapse border text-center">

                <thead>

                    <tr>

                        <th className="border p-4">
                            TEST
                        </th>

                        <th className="border p-4">
                            RESULT
                        </th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td className="border p-8 font-bold">
                            FOBT
                        </td>

                        <td className="border p-8">

                            <select
                                name="fobt"
                                value={result.fobt}
                                onChange={handleChange}
                                disabled={readOnly}
                                className="w-full rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:opacity-100"
                            >

                                <option value="">
                                    Select
                                </option>

                                <option value="POSITIVE">
                                    POSITIVE
                                </option>

                                <option value="NEGATIVE">
                                    NEGATIVE
                                </option>

                            </select>

                        </td>

                    </tr>

                </tbody>

            </table>

            <div className="grid grid-cols-2 gap-20 pt-16">

                <div className="text-center">

                    <div className="border-t border-current pt-2">
                        Pathologist
                    </div>

                </div>

                <div className="text-center">

                    <div className="border-t border-current pt-2">
                        Medical Technologist
                    </div>

                </div>

            </div>

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