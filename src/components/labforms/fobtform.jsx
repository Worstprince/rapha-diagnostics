"use client";

import { useState } from "react";
import LabReportHeader from "./labReportHeader";

export default function FOBTForm({ patient, onSubmit }) {

    const [result, setResult] = useState({
        fobt: ""
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
                                className="w-full rounded bg-slate-800 p-2"
                            >

                                <option value="">
                                    Select
                                </option>

                                <option>POSITIVE</option>
                                <option>NEGATIVE</option>

                            </select>

                        </td>

                    </tr>

                </tbody>

            </table>

            <div className="grid grid-cols-2 gap-20 pt-16">

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