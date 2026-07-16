"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function VisitationDetailsPage() {

    const { id } = useParams();

    const [patient, setPatient] = useState(null);

    const [tests, setTests] = useState([]);

    const medtechs = [
        "John Smith",
        "Jane Cruz",
        "Michael Reyes"
    ];

    useEffect(() => {

        if (id) {
            fetchVisitation();
        }

    }, [id]);

    async function fetchVisitation() {

        try {

            const response = await fetch(`/api/doctor/visitationDisplay/${id}`);

            const result = await response.json();

            if (!response.ok) {
                alert(result.message);
                return;
            }

            setPatient(result.patient);
            setTests(result.tests);

        } catch (error) {

            console.error(error);

        }

    }

    function assignMedtech(testId, medtechId) {

        setTests(prev =>
            prev.map(test =>
                test.id === testId
                    ? {
                        ...test,
                        medtechid: medtechId
                    }
                    : test
            )
        );

    }

    async function handleSave() {

        console.log(tests);

        // POST to backend later

    }

    if (!patient) {

        return (
            <div className="p-6 text-white">
                Loading...
            </div>
        );

    }

    return (

        <div className="space-y-6">

            <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

                <h1 className="text-2xl font-bold text-white">
                    Patient Laboratory Request
                </h1>

                <p className="mt-2 text-slate-400">
                    Review patient information and assign laboratory tests.
                </p>

            </header>

            <div className="grid gap-6 lg:grid-cols-3">

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

                    <h2 className="mb-5 text-lg font-semibold text-white">
                        Patient Information
                    </h2>

                    <div className="space-y-3 text-slate-300">

                        <p><strong>Name:</strong> {patient.name}</p>

                        <p><strong>Age:</strong> {patient.age}</p>

                        <p><strong>Sex:</strong> {patient.sex}</p>

                        <p><strong>Birthdate:</strong> {patient.birthdate}</p>

                        <p><strong>Mobile:</strong> {patient.mobileNum}</p>

                        <p><strong>Address:</strong> {patient.address}</p>

                        <p><strong>Visit Date:</strong> {patient.visited_at}</p>

                        <p><strong>Priority:</strong> {patient.priority}</p>

                        <p><strong>Status:</strong> {patient.status}</p>

                    </div>

                </div>

                <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

                    <h2 className="mb-5 text-lg font-semibold text-white">
                        Requested Laboratory Tests
                    </h2>

                    <table className="w-full border-collapse">

                        <thead>

                            <tr className="border-b border-slate-700">

                                <th className="p-3 text-left text-slate-300">
                                    Test
                                </th>

                                <th className="p-3 text-left text-slate-300">
                                    Status
                                </th>

                                <th className="p-3 text-left text-slate-300">
                                    Assigned Medical Technologist
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {tests.map(test => (

                                <tr
                                    key={test.id}
                                    className="border-b border-slate-800"
                                >

                                    <td className="p-3 text-white">
                                        {test.name}
                                    </td>

                                    <td className="p-3 text-yellow-300">
                                        {test.status}
                                    </td>

                                    <td className="p-3">

                                        <select
                                            value={test.medtechid ?? ""}
                                            onChange={(e) =>
                                                assignMedtech(test.id, e.target.value)
                                            }
                                            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white"
                                        >

                                            <option value="">
                                                Select Medical Technologist
                                            </option>

                                            {medtechs.map(name => (

                                                <option
                                                    key={name}
                                                    value={name}
                                                >
                                                    {name}
                                                </option>

                                            ))}

                                        </select>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    <div className="mt-6 flex justify-end">

                        <button
                            onClick={handleSave}
                            className="rounded-lg bg-cyan-600 px-6 py-3 text-white hover:bg-cyan-500"
                        >
                            Assign Tests
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}