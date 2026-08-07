"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function VisitationDetailsPage() {

    const { id } = useParams();

    const [patient, setPatient] = useState(null);

    const [tests, setTests] = useState([]);

    const [medtechs, setMedtechs] = useState([]);

    useEffect(() => {

        if (!id) return;

        fetchVisitation();
        fetchMedtechs();

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

    async function fetchMedtechs() {
        try {
            const response = await fetch("/api/medtech/display");

            const data = await response.json();

            setMedtechs(data);

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

    const response = await fetch("/api/doctor/assignMedTech", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

body: JSON.stringify({
    tests
})

    });

    const result = await response.json();

    alert(result.message);

}

    if (!patient) {

        return (
            <div className="p-6 text-rd-muted">
                Loading...
            </div>
        );

    }

    return (

        <div className="space-y-6">

            <header className="rounded-2xl border border-rd-hair bg-rd-card p-6">

                <h1 className="text-2xl font-bold text-rd-title">
                    Patient Laboratory Request
                </h1>

                <p className="mt-2 text-rd-muted">
                    Review patient information and assign laboratory tests.
                </p>

            </header>

            <div className="grid gap-6 lg:grid-cols-3">

                <div className="rounded-2xl border border-rd-hair bg-rd-card p-6">

                    <h2 className="mb-5 text-lg font-semibold text-rd-title">
                        Patient Information
                    </h2>

                    {/* The <strong> labels inherit this colour, so the value beside them
                        needs to carry the weight — hence label muted, value titled. */}
                    <div className="space-y-3 text-rd-label [&_strong]:font-semibold [&_strong]:text-rd-title">

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

                <div className="lg:col-span-2 rounded-2xl border border-rd-hair bg-rd-card p-6">

                    <h2 className="mb-5 text-lg font-semibold text-rd-title">
                        Requested Laboratory Tests
                    </h2>

                    <table className="w-full border-collapse">

                        <thead>

                            <tr className="border-b border-rd-hair-strong">

                                <th className="p-3 text-left text-rd-label">
                                    Test
                                </th>

                                <th className="p-3 text-left text-rd-label">
                                    Status
                                </th>

                                <th className="p-3 text-left text-rd-label">
                                    Assigned Medical Technologist
                                </th>

                                <th className="p-3 text-left text-rd-label">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {tests.map(test => (

                                <tr
                                    key={test.id}
                                    className="border-b border-rd-hair"
                                >

                                    <td className="p-3 text-rd-title">
                                        {test.name}
                                    </td>

                                    <td className="p-3 text-rd-label">
                                        {test.status}
                                    </td>

                                    <td className="p-3">

                                        <select
                                            disabled={test.status === "Done"}
                                            value={test.medtechid ?? ""}
                                            onChange={(e) =>
                                                assignMedtech(test.id, e.target.value)
                                            }
                                            className="w-full rounded-lg border border-rd-hair-strong bg-rd-field p-2 text-rd-text"
                                        >

                                            <option value="">
                                                Select Medical Technologist
                                            </option>

                                            {medtechs.map(medtech => (

                                                <option
                                                    key={medtech.id}
                                                    value={medtech.id}
                                                >
                                                    {medtech.username}
                                                </option>

                                            ))}

                                        </select>

                                    </td>

                                    <td className="p-3">
                                        {(test.status === "Done" || test.status === "Approved") ? (
                                            <a
                                                href={`/dashboard/doctor/result/${test.id}`}
                                                className="rd-btn rd-press rd-focus"
                                            >
                                                View Result
                                            </a>
                                        ) : (
                                            <span className="text-rd-muted">-</span>
                                        )}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    <div className="mt-6 flex justify-end">

                        <button
                            onClick={handleSave}
                            className="rd-btn rd-press rd-focus"
                        >
                            Assign Tests
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}
