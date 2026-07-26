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

        motility30min: "",
        motility1hr: "",
        motility2hr: "",

        viability30min: "",
        viability1hr: "",
        viability2hr: "",

        spermConcentration: "",
        spermCount: ""
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
                title="SEMEN ANALYSIS"
            />

            <table className="w-full border-collapse border border-white text-center">

                <thead>

                    {/* 5 COLUMNS ONLY */}

                    <tr>

                        <th
                            colSpan="3"
                            className="border border-white p-2 text-lg"
                        >
                            MACROSCOPIC
                        </th>

                        <th
                            colSpan="2"
                            className="border border-white p-2 text-lg"
                        >
                            MICROSCOPIC
                        </th>

                    </tr>

                    <tr>

                        <th className="border border-white p-2">
                            Examination
                        </th>

                        <th className="border border-white p-2">
                            Result
                        </th>

                        <th className="border border-white p-2">
                            NORMAL VALUE
                        </th>

                        <th className="border border-white p-2">
                            Examination
                        </th>

                        <th className="border border-white p-2">
                            Result
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {/* APPEARANCE / MORPHOLOGY */}

                    <tr>

                        <td className="border border-white p-2 text-left">
                            APPEARANCE
                        </td>

                        <td className="border border-white p-2">

                            <input
                                type="text"
                                name="appearance"
                                value={result.appearance}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border border-white p-2">
                            
                        </td>

                        <td className="border border-white p-2 text-left">
                            MORPHOLOGY
                        </td>

                        <td className="border border-white p-2">

                            <input
                                type="text"
                                name="morphology"
                                value={result.morphology}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                    </tr>

                    {/* VOLUME / MOTILITY */}

                    <tr>

                        <td className="border border-white p-2 text-left">
                            VOLUME
                        </td>

                        <td className="border border-white p-2">

                            <input
                                type="text"
                                name="volume"
                                value={result.volume}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border border-white p-2">
                            2-5mL
                        </td>

                        <td className="border border-white p-2 text-left">
                            MOTILITY
                        </td>

                        <td className="border border-white p-2">

                            <input
                                type="text"
                                name="motility"
                                value={result.motility}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                    </tr>

                    {/* pH / WBC */}

                    <tr>

                        <td className="border border-white p-2 text-left">
                            pH
                        </td>

                        <td className="border border-white p-2">

                            <input
                                type="text"
                                name="ph"
                                value={result.ph}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border border-white p-2">
                            7.2-8.0
                        </td>

                        <td className="border border-white p-2 text-left">
                            WBC
                        </td>

                        <td className="border border-white p-2">

                            <input
                                type="text"
                                name="wbc"
                                value={result.wbc}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                    </tr>

                    {/* VISCOSITY / RBC */}

                    <tr>

                        <td className="border border-white p-2 text-left">
                            VISCOSITY
                        </td>

                        <td className="border border-white p-2">

                            <input
                                type="text"
                                name="viscosity"
                                value={result.viscosity}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border border-white p-2">
                            1-4
                        </td>

                        <td className="border border-white p-2 text-left">
                            RBC
                        </td>

                        <td className="border border-white p-2">

                            <input
                                type="text"
                                name="rbc"
                                value={result.rbc}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                    </tr>

                    {/* OTHERS / MOTILITY + VIABILITY */}

                    <tr>

                        <td
                            rowSpan="4"
                            className="border border-white p-2 text-left align-top"
                        >
                            OTHERS:
                        </td>

                        <td
                            rowSpan="4"
                            colSpan="2"
                            className="border border-white p-2 align-top"
                        >

                            <textarea
                                name="others"
                                value={result.others}
                                onChange={handleChange}
                                rows="7"
                                className="w-full resize-none rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td
                            className="border border-white p-2 font-bold"
                        >
                            MOTILITY
                        </td>

                        <td
                            className="border border-white p-2 font-bold"
                        >
                            VIABILITY
                        </td>

                    </tr>

                    {/* 30 MINUTES */}

                    <tr>

                        <td className="border border-white p-2">

                            <div className="flex items-center gap-2">

                                <span>30mins</span>

                                <input
                                    type="text"
                                    name="motility30min"
                                    value={result.motility30min}
                                    onChange={handleChange}
                                    className="w-full rounded bg-slate-800 p-2"
                                />

                            </div>

                        </td>

                        <td className="border border-white p-2">

                            <div className="flex items-center gap-2">

                                <span>30mins</span>

                                <input
                                    type="text"
                                    name="viability30min"
                                    value={result.viability30min}
                                    onChange={handleChange}
                                    className="w-full rounded bg-slate-800 p-2"
                                />

                            </div>

                        </td>

                    </tr>

                    {/* 1 HOUR */}

                    <tr>

                        <td className="border border-white p-2">

                            <div className="flex items-center gap-2">

                                <span>1Hour</span>

                                <input
                                    type="text"
                                    name="motility1hr"
                                    value={result.motility1hr}
                                    onChange={handleChange}
                                    className="w-full rounded bg-slate-800 p-2"
                                />

                            </div>

                        </td>

                        <td className="border border-white p-2">

                            <div className="flex items-center gap-2">

                                <span>1Hour</span>

                                <input
                                    type="text"
                                    name="viability1hr"
                                    value={result.viability1hr}
                                    onChange={handleChange}
                                    className="w-full rounded bg-slate-800 p-2"
                                />

                            </div>

                        </td>

                    </tr>

                    {/* 2 HOURS */}

                    <tr>

                        <td className="border border-white p-2">

                            <div className="flex items-center gap-2">

                                <span>2hours</span>

                                <input
                                    type="text"
                                    name="motility2hr"
                                    value={result.motility2hr}
                                    onChange={handleChange}
                                    className="w-full rounded bg-slate-800 p-2"
                                />

                            </div>

                        </td>

                        <td className="border border-white p-2">

                            <div className="flex items-center gap-2">

                                <span>2hours</span>

                                <input
                                    type="text"
                                    name="viability2hr"
                                    value={result.viability2hr}
                                    onChange={handleChange}
                                    className="w-full rounded bg-slate-800 p-2"
                                />

                            </div>

                        </td>

                    </tr>

                </tbody>

            </table>

            {/* SPERM CONCENTRATION / COUNT */}

            <table className="w-full border-collapse border border-white text-center">

                <tbody>

                    <tr>

                        <td className="border border-white p-2 text-left">
                            SPERM CONCENTRATION/mL
                        </td>

                        <td className="border border-white p-2">

                            <input
                                type="text"
                                name="spermConcentration"
                                value={result.spermConcentration}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border border-white p-2">
                            &gt;20million/mL
                        </td>

                    </tr>

                    <tr>

                        <td className="border border-white p-2 text-left">
                            SPERM COUNT/EJACULATE
                        </td>

                        <td className="border border-white p-2">

                            <input
                                type="text"
                                name="spermCount"
                                value={result.spermCount}
                                onChange={handleChange}
                                className="w-full rounded bg-slate-800 p-2"
                            />

                        </td>

                        <td className="border border-white p-2">
                            &gt;40million/ejaculate
                        </td>

                    </tr>

                </tbody>

            </table>

            {/* SPERM MOTILITY GRADING */}

            <div className="text-sm">

                <p className="font-semibold">
                    SPERM MOTILITY GRADING
                </p>

                <p>
                    A. Rapid, straight-line movement — 4
                </p>

                <p>
                    B. Slower speed, some lateral movement — 3
                </p>

                <p>
                    B.1 Slow forward progression — 2
                </p>

                <p>
                    C. No forward progression — 1
                </p>

                <p>
                    D. No movement — 0
                </p>

            </div>

            {/* SIGNATURES */}

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

            {/* SAVE */}

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