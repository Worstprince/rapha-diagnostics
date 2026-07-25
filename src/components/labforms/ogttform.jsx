"use client";

import { useState } from "react";
import LabReportHeader from "./labReportHeader";

export default function OGTTForm({ patient, onSubmit }) {

    const [result, setResult] = useState({
        fbs: "",
        firstHour: "",
        secondHour: ""
    });

    function handleChange(e) {

        const { name, value } = e.target;

        setResult(prev => ({
            ...prev,
            [name]: value
        }));

    }

    function handleSubmit(e) {

        e.preventDefault();

        onSubmit(result);

    }

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-8 rounded-2xl border border-slate-800 bg-slate-900 p-8"
        >

            <LabReportHeader
                patient={patient}
                title="CLINICAL CHEMISTRY"
            />

            <h2 className="text-center text-3xl font-bold">
                ORAL GLUCOSE TOLERANCE TEST
            </h2>

            <table className="w-full border border-collapse text-center">

                <thead>

                    <tr>

                        <th className="border p-3">
                            Test
                        </th>

                        <th className="border p-3">
                            Result
                        </th>

                        <th className="border p-3">
                            Normal Values
                        </th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td className="border p-3 font-semibold">
                            FBS
                        </td>

                        <td className="border p-3">

                            <input
                                name="fbs"
                                value={result.fbs}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border p-3">
                            3.89 - 5.83 mmol/L
                        </td>

                    </tr>

                    <tr>

                        <td className="border p-3 font-semibold">
                            1st Hour
                        </td>

                        <td className="border p-3">

                            <input
                                name="firstHour"
                                value={result.firstHour}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border p-3">
                            Less than 11.1 mmol/L
                        </td>

                    </tr>

                    <tr>

                        <td className="border p-3 font-semibold">
                            2nd Hour
                        </td>

                        <td className="border p-3">

                            <input
                                name="secondHour"
                                value={result.secondHour}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border p-3">
                            Less than 7.8 mmol/L
                        </td>

                    </tr>

                </tbody>

            </table>

            <div className="grid grid-cols-2 gap-20 pt-10">

                <div className="text-center">

                    <div className="border-t border-white pt-2">
                        Pathologist
                    </div>

                </div>

                <div className="text-center">

                    <div className="border-t border-white pt-2">
                        Medical Technologist
                    </div>

                </div>

            </div>

            <div className="flex justify-end">

                <button
                    type="submit"
                    className="rounded-lg bg-cyan-600 px-6 py-3"
                >
                    Save Result
                </button>

            </div>

        </form>

    );

}