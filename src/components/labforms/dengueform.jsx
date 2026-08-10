"use client";

import { useState } from "react";
import LabReportHeader from "./labReportHeader";
import LabSignatures from "./labSignatures";

export default function DengueForm({
    patient,
    onSubmit,
    initialData = {},
    readOnly = false,
    hasExistingResult = false,
    medtechName = "",
    doctorName = ""
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

        onSubmit(result);

    }

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-8 rounded-2xl border border-rd-hair bg-rd-card p-8"
        >

            <LabReportHeader
                patient={patient}
                title="IMMUNOLOGY and SEROLOGY"
            />

            <h2 className="text-center text-3xl font-bold">
                DENGUE DUO
            </h2>

            <table className="mx-auto w-[360px] border-collapse border text-center">

                <tbody>

                    <tr>

                        <td className="border p-6 font-bold">
                            NS1
                        </td>

                        <td className="border p-6">

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

                        <td className="border p-6 font-bold">
                            IgG
                        </td>

                        <td className="border p-6">

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

                        <td className="border p-6 font-bold">
                            IgM
                        </td>

                        <td className="border p-6">

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