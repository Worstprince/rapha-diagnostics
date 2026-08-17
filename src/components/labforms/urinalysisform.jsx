"use client";

import { useEffect, useState } from "react";
import LabReportHeader, { LabSignatures } from "./labReportHeader";

export default function UrinalysisForm({
    patient,
    initialData,
    readOnly = false,
    hasExistingResult = false,
    onSubmit,
    doctorId,
    doctorName,
    medtechId,
    medtechName,
}) {

    const [result, setResult] = useState({
        color: "",
        transparency: "",
        reaction: "",
        sugar: "",
        albumin: "",
        specificGravity: "",
        pregnancyTest: "",
        others: "",

        epithelialCells: "",
        mucusThread: "",
        pus: "",
        rbc: "",
        renalCells: "",
        cast: "",
        crystal: "",
        bacteria: ""
    });

    useEffect(() => {

        if (initialData) {

            setResult({
                color: initialData?.color ?? "",
                transparency: initialData?.transparency ?? "",
                reaction: initialData?.reaction ?? "",
                sugar: initialData?.sugar ?? "",
                albumin: initialData?.albumin ?? "",
                specificGravity: initialData?.specificgravity ?? "",
                pregnancyTest: initialData?.pregnancytest ?? "",
                others: initialData?.others ?? "",
                epithelialCells: initialData?.epithelialcells ?? "",
                mucusThread: initialData?.mucusthread ?? "",
                pus: initialData?.pus ?? "",
                rbc: initialData?.rbc ?? "",
                renalCells: initialData?.renalCells ?? "",
                cast: initialData?.cast ?? "",
                crystal: initialData?.crystal ?? "",
                bacteria: initialData?.bacteria ?? ""
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

        onSubmit(result, hasExistingResult);

    }

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-8 rounded-2xl border border-rd-hair bg-rd-card p-8"
        >

            <LabReportHeader
                patient={patient}
                title="CLINICAL MICROSCOPY"
            />

            <h2 className="text-center text-2xl font-bold">
                URINALYSIS
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-rd-hair-strong text-center">

                    <thead>

                        <tr>

                            <th
                                colSpan="2"
                                className="border border-rd-hair-strong p-2"
                            >
                                CHEMICAL AND MACROSCOPIC EXAMINATION
                            </th>

                            <th
                                colSpan="2"
                                className="border border-rd-hair-strong p-2"
                            >
                                MICROSCOPIC EXAMINATION
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                COLOR
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <select
                                    name="color"
                                    value={result.color}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2"
                                >

                                    <option value=""></option>
                                    <option value="Straw">Straw</option>
                                    <option value="Light yellow">Light yellow</option>
                                    <option value="Dark yellow">Dark yellow</option>
                                    <option value="yellow">yellow</option>
                                    <option value="red">red</option>
                                    <option value="amber">amber</option>

                                </select>

                            </td>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                EPITHELIAL CELLS /hpf
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <select
                                    name="epithelialCells"
                                    value={result.epithelialCells}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2"
                                >

                                    <option value=""></option>
                                    <option value="Rare">Rare</option>
                                    <option value="Few">Few</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="Many">Many</option>

                                </select>

                            </td>

                        </tr>

                        <tr>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                TRANSPARENCY
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <select
                                    name="transparency"
                                    value={result.transparency}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2"
                                >

                                    <option value=""></option>
                                    <option value="Clear">Clear</option>
                                    <option value="Slightly Hazy">
                                        Slightly Hazy
                                    </option>
                                    <option value="Hazy">Hazy</option>
                                    <option value="Cloudy">Cloudy</option>

                                </select>

                            </td>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                MUCUS THREAD /hpf
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <select
                                    name="mucusThread"
                                    value={result.mucusThread}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2"
                                >

                                    <option value=""></option>
                                    <option value="Rare">Rare</option>
                                    <option value="Few">Few</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="Many">Many</option>

                                </select>

                            </td>

                        </tr>

                        <tr>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                REACTION
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <select
                                    name="reaction"
                                    value={result.reaction}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2"
                                >

                                    <option value=""></option>
                                    <option value="Acidic">Acidic</option>
                                    <option value="Alkaline">Alkaline</option>

                                </select>

                            </td>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                PUS / hpf
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <input
                                    type="text"
                                    name="pus"
                                    value={result.pus}
                                    onChange={handleChange}
                                    readOnly={readOnly}
                                    className="w-full rounded bg-rd-field p-2"
                                />

                            </td>

                        </tr>

                        <tr>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                SUGAR
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <select
                                    name="sugar"
                                    value={result.sugar}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2"
                                >

                                    <option value=""></option>
                                    <option value="Negative">Negative</option>
                                    <option value="Trace">Trace</option>
                                    <option value="1+">1+</option>
                                    <option value="2+">2+</option>
                                    <option value="3+">3+</option>
                                    <option value="4+">4+</option>

                                </select>

                            </td>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                RBC / hpf
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <input
                                    type="text"
                                    name="rbc"
                                    value={result.rbc}
                                    onChange={handleChange}
                                    readOnly={readOnly}
                                    className="w-full rounded bg-rd-field p-2"
                                />

                            </td>

                        </tr>

                        <tr>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                ALBUMIN
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <select
                                    name="albumin"
                                    value={result.albumin}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2"
                                >

                                    <option value=""></option>
                                    <option value="Negative">Negative</option>
                                    <option value="Trace">Trace</option>
                                    <option value="1+">1+</option>
                                    <option value="2+">2+</option>
                                    <option value="3+">3+</option>
                                    <option value="4+">4+</option>

                                </select>

                            </td>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                RENAL CELLS / hpf
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <input
                                    type="text"
                                    name="renalCells"
                                    value={result.renalCells}
                                    onChange={handleChange}
                                    readOnly={readOnly}
                                    className="w-full rounded bg-rd-field p-2"
                                />

                            </td>

                        </tr>

                        <tr>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                SPECIFIC GRAVITY
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <select
                                    name="specificGravity"
                                    value={result.specificGravity}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded bg-rd-field p-2"
                                >

                                    <option value=""></option>
                                    <option value="1.000">1.000</option>
                                    <option value="1.005">1.005</option>
                                    <option value="1.010">1.010</option>
                                    <option value="1.015">1.015</option>
                                    <option value="1.020">1.020</option>
                                    <option value="1.025">1.025</option>
                                    <option value="1.030">1.030</option>

                                </select>

                            </td>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                CAST / lpf
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <input
                                    type="text"
                                    name="cast"
                                    value={result.cast}
                                    onChange={handleChange}
                                    readOnly={readOnly}
                                    className="w-full rounded bg-rd-field p-2"
                                />

                            </td>

                        </tr>

                        <tr>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                PREGNANCY TEST
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <input
                                    type="text"
                                    name="pregnancyTest"
                                    value={result.pregnancyTest}
                                    onChange={handleChange}
                                    readOnly={readOnly}
                                    className="w-full rounded bg-rd-field p-2"
                                />

                            </td>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                CRYSTAL / hpf
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <input
                                    type="text"
                                    name="crystal"
                                    value={result.crystal}
                                    onChange={handleChange}
                                    readOnly={readOnly}
                                    className="w-full rounded bg-rd-field p-2"
                                />

                            </td>

                        </tr>

                        <tr>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                OTHERS
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <input
                                    type="text"
                                    name="others"
                                    value={result.others}
                                    onChange={handleChange}
                                    readOnly={readOnly}
                                    className="w-full rounded bg-rd-field p-2"
                                />

                            </td>

                            <td className="border border-rd-hair-strong p-2 text-left">
                                BACTERIA / hpf
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <input
                                    type="text"
                                    name="bacteria"
                                    value={result.bacteria}
                                    onChange={handleChange}
                                    readOnly={readOnly}
                                    className="w-full rounded bg-rd-field p-2"
                                />

                            </td>

                        </tr>

                    </tbody>

                </table>
            </div>

<LabSignatures
                        doctorId={doctorId}
                        doctorName={doctorName}
                        medtechId={medtechId}
                        medtechName={medtechName}
                    />

            <div className="flex justify-end">

                <button
                    type="submit"
                    className="rd-btn rd-press rd-focus"
                >
                    {hasExistingResult  ? "Update Result" : "Save Result"}
                </button>

            </div>

        </form>

    );

}