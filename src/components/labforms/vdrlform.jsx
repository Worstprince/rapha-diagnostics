"use client";

import { useEffect, useState } from "react";
import LabReportHeader from "./labReportHeader";

export default function SyphilisForm({
    patient,
    initialData,
    readOnly = false,
    hasExistingResult = false,
    onSubmit
}) {

    const [result, setResult] = useState({
        vdrl: ""
    });

    useEffect(() => {

        if (initialData) {

            setResult({
                vdrl: initialData?.vdrl ?? ""
            });

        }

    }, [initialData]);

    function handleChange(e) {

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
                title="IMMUNOLOGY/SEROLOGY"
            />

            <h2 className="text-center text-2xl font-bold">
                SYPHILIS
            </h2>

            <table className="mx-auto w-full max-w-xl border-collapse border border-current text-center">

                <thead>

                    <tr>

                        <th className="border border-current p-2">
                            TEST
                        </th>

                        <th className="border border-current p-2">
                            RESULT
                        </th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td className="border border-current p-4 font-bold">
                            VDRL
                        </td>

                        <td className="border border-current p-4">

                            <input
                                type="text"
                                name="vdrl"
                                value={result.vdrl}
                                onChange={handleChange}
                                readOnly={readOnly}
                                className="w-full rounded bg-rd-field p-2 text-center"
                            />

                        </td>

                    </tr>

                </tbody>

            </table>

            <div className="grid grid-cols-2 gap-20 pt-10">

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