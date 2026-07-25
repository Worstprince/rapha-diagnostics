"use client";

import { useState } from "react";
import LabReportHeader from "./labReportHeader";

export default function SemenAnalysisForm({ patient, onSubmit }) {

const [result, setResult] = useState({

    appearance: "",
    volume: "",
    ph: "",
    viscosity: "",
    others: "",

    morphology: "",
    motility: "",
    wbc: "",
    rbc: "",

    m30mins: "",
    m1hr: "",
    m2hr: "",

    v30m: "",
    v1hr: "",
    v2hr: ""
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
                title="SEMENALYSIS"
            />

            <table className="w-full border-collapse border text-center">

                <thead>

                    <tr>

                        <th
                            colSpan="3"
                            className="border p-3 text-xl font-bold"
                        >
                            MACROSCOPIC
                        </th>

                        <th
                            colSpan="3"
                            className="border p-3 text-xl font-bold"
                        >
                            MICROSCOPIC
                        </th>

                    </tr>

                    <tr>

                        <th className="border p-2">
                            Examination
                        </th>

                        <th className="border p-2">
                            Result
                        </th>

                        <th className="border p-2">
                            Normal Value
                        </th>

                        <th className="border p-2">
                            Examination
                        </th>

                        <th className="border p-2">
                            Result
                        </th>

                        <th className="border p-2">
                            Normal Value
                        </th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td className="border p-2">
                            Appearance
                        </td>

                        <td className="border p-2">

                            <input
                                name="appearance"
                                value={result.appearance}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border p-2">
                            Cloudy White
                        </td>

                        <td className="border p-2">
                            Morphology
                        </td>

                        <td className="border p-2">

                            <input
                                name="morphology"
                                value={result.morphology}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border p-2">
                            94% normal looking sperm,
                            4% small headed sperm and
                            2% bent neck sperm
                        </td>

                    </tr>

                    <tr>

                        <td className="border p-2">
                            Volume
                        </td>

                        <td className="border p-2">

                            <input
                                name="volume"
                                value={result.volume}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border p-2">
                            2-5 mL
                        </td>

                        <td className="border p-2">
                            Motility
                        </td>

                        <td className="border p-2">

                            <input
                                name="motility"
                                value={result.motility}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border p-2">
                            3
                        </td>

                    </tr>

                    <tr>

                        <td className="border p-2">
                            pH
                        </td>

                        <td className="border p-2">

                            <input
                                name="ph"
                                value={result.ph}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border p-2">
                            7.2-8.0
                        </td>

                        <td className="border p-2">
                            WBC
                        </td>

                        <td className="border p-2">

                            <input
                                name="wbc"
                                value={result.wbc}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border p-2">
                            2-5 / HPF
                        </td>

                    </tr>

                    <tr>

                        <td className="border p-2">
                            Viscosity
                        </td>

                        <td className="border p-2">

                            <input
                                name="viscosity"
                                value={result.viscosity}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border p-2">
                            1-4
                        </td>

                        <td className="border p-2">
                            RBC
                        </td>

                        <td className="border p-2">

                            <input
                                name="rbc"
                                value={result.rbc}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border p-2">
                            0-2 / HPF
                        </td>

                    </tr>

                    <tr>

                        <td className="border p-2">
                            Others
                        </td>

                        <td className="border p-2">

                            <input
                                name="others"
                                value={result.others}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border p-2"></td>

                        <td
                            colSpan="3"
                            className="border p-2 font-bold"
                        >
                            VIABILITY
                        </td>

                    </tr>

                    <tr>

                        <td
                            colSpan="3"
                            className="border p-2"
                        ></td>

                        <td className="border p-2">
                            30 mins
                        </td>

                        <td className="border p-2">

                            <input
                                name="viability30min"
                                value={result.viability30min}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border p-2">
                            30 mins
                        </td>

                    </tr>

                    <tr>

                        <td
                            colSpan="3"
                            className="border p-2"
                        ></td>

                        <td className="border p-2">
                            1 Hour
                        </td>

                        <td className="border p-2">

                            <input
                                name="viability1hour"
                                value={result.viability1hour}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border p-2">
                            1 Hour
                        </td>

                    </tr>

                    <tr>

                        <td
                            colSpan="3"
                            className="border p-2"
                        ></td>

                        <td className="border p-2">
                            2 Hours
                        </td>

                        <td className="border p-2">

                            <input
                                name="viability2hours"
                                value={result.viability2hours}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border p-2">
                            2 Hours
                        </td>

                    </tr>

                </tbody>

            </table>

            <table className="w-full border-collapse border text-center">

                <thead>

                    <tr>

                        <th className="border p-2">
                            Examination
                        </th>

                        <th className="border p-2">
                            Result
                        </th>

                        <th className="border p-2">
                            Normal Value
                        </th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td className="border p-2">
                            Sperm Concentration/mL
                        </td>

                        <td className="border p-2">

                            <input
                                name="spermConcentration"
                                value={result.spermConcentration}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border p-2">
                            &gt;20 million/mL
                        </td>

                    </tr>

                    <tr>

                        <td className="border p-2">
                            Sperm Count/Ejaculate
                        </td>

                        <td className="border p-2">

                            <input
                                name="spermCount"
                                value={result.spermCount}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border p-2">
                            &gt;40 million/ejaculate
                        </td>

                    </tr>

                </tbody>

            </table>

            <table className="w-full border-collapse border text-center">

                <thead>

                    <tr>

                        <th className="border p-2">
                            Sperm Motility Grading
                        </th>

                        <th className="border p-2">
                            Result
                        </th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td className="border p-2 text-left">
                            A. Rapid, straight-line
                        </td>

                        <td className="border p-2">

                            <input
                                name="motilityRapid"
                                value={result.motilityRapid}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                    </tr>

                    <tr>

                        <td className="border p-2 text-left">
                            B. Slower speed, some lateral movement
                        </td>

                        <td className="border p-2">

                            <input
                                name="motilitySlow"
                                value={result.motilitySlow}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                    </tr>

                    <tr>

                        <td className="border p-2 text-left">
                            B.1 Slow forward progression
                        </td>

                        <td className="border p-2">

                            <input
                                name="motilitySlowForward"
                                value={result.motilitySlowForward}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                    </tr>

                    <tr>

                        <td className="border p-2 text-left">
                            C. No forward progression
                        </td>

                        <td className="border p-2">

                            <input
                                name="motilityNoForward"
                                value={result.motilityNoForward}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                    </tr>

                    <tr>

                        <td className="border p-2 text-left">
                            D. No movement
                        </td>

                        <td className="border p-2">

                            <input
                                name="motilityNoMovement"
                                value={result.motilityNoMovement}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

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