"use client";

import { useState } from "react";

export default function BloodTypeForm({ patient, onSubmit }) {

    const [result, setResult] = useState({
        bloodType: "",
        rhFactor: ""
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

            <div className="text-center">

                <h1 className="text-4xl font-bold tracking-wide">
                    RAPHA DIAGNOSTIC LABORATORY
                </h1>

                <p className="italic">
                    "Your Health, Our Priority"
                </p>

                <p>
                    Esperanza Building, Quezon Boulevard, Kidapawan City
                </p>

                <h2 className="mt-6 text-3xl font-bold text-red-300">
                    HEMATOLOGY
                </h2>

            </div>

            <div className="grid grid-cols-2 gap-6 border p-4">

                <div>
                    <b>Name:</b> {patient.name}
                </div>

                <div>
                    <b>Age:</b> {patient.age}
                </div>

                <div>
                    <b>Address:</b> {patient.address}
                </div>

                <div>
                    <b>Sex:</b> {patient.sex}
                </div>

                <div>
                    <b>Date:</b> {patient.date}
                </div>

                <div>
                    <b>Physician:</b> {patient.physician}
                </div>

            </div>

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
                                className="w-full rounded border bg-slate-800 p-2"
                            >

                                <option value="">
                                    Select
                                </option>

                                <option>A</option>
                                <option>B</option>
                                <option>AB</option>
                                <option>O</option>

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
                                className="w-full rounded border bg-slate-800 p-2"
                            >

                                <option value="">
                                    Select
                                </option>

                                <option>Positive</option>
                                <option>Negative</option>

                            </select>

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