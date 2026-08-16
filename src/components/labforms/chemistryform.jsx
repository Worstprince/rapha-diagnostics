"use client";

import { useState } from "react";
import LabReportHeader, { LabSignatures } from "./labReportHeader";

export default function ChemistryForm({
    patient,
    onSubmit,
    initialData = {},
    hasExistingResult = false,
    readOnly = false,
    doctorId,
    doctorName,
    medtechId,
    medtechName,
}) {

const [result, setResult] = useState({
    glucose: initialData?.glucose ?? "",
    creatinine: initialData?.creatinine ?? "",
    uricAcid: initialData?.uricAcid ?? "",
    totalCholesterol: initialData?.totalCholesterol ?? "",
    triglycerides: initialData?.triglycerides ?? "",
    hdlCholesterol: initialData?.hdlCholesterol ?? "",
    ldlCholesterol: initialData?.ldlCholesterol ?? "",
    sgot: initialData?.sgot ?? "",
    sgpt: initialData?.sgpt ?? "",
    totalBilirubin: initialData?.totalBilirubin ?? "",
    directBilirubin: initialData?.directBilirubin ?? "",
    indirectBilirubin: initialData?.indirectBilirubin ?? "",
    hba1c: initialData?.hba1c ?? "",
    bun: initialData?.bun ?? ""
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

    onSubmit(result, hasExistingResult);

}

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-8 rounded-2xl border border-rd-hair bg-rd-card p-8"
        >

            <LabReportHeader
                patient={patient}
                title="CLINICAL CHEMISTRY"
            />

<table className="w-full border border-collapse text-center">

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

            <td className="border p-2">Glucose</td>

            <td className="border p-2">
                <input
                    name="glucose"
                    value={result.glucose}
                    onChange={handleChange}
                    readOnly={readOnly} 
                    className="w-full rounded bg-rd-field p-2"
                />
            </td>

            <td className="border p-2">
                4.38 - 6.05 mmol/L
            </td>

            <td className="border p-2">SGOT</td>

            <td className="border p-2">
                <input
                    name="sgot"
                    value={result.sgot}
                    onChange={handleChange}
                    readOnly={readOnly}
                    className="w-full rounded bg-rd-field p-2"
                />
            </td>

            <td className="border p-2">
                M: up to 66.5 u/L<br />
                F: up to 41 u/L
            </td>

        </tr>

        <tr>

            <td className="border p-2">Creatinine</td>

            <td className="border p-2">
                <input
                    name="creatinine"
                    value={result.creatinine}
                    onChange={handleChange}
                    readOnly={readOnly}
                    className="w-full rounded bg-rd-field p-2"
                />
            </td>

            <td className="border p-2">
                F: 53-106 umol/L<br />
                M: 70-120 umol/L
            </td>

            <td className="border p-2">SGPT</td>

            <td className="border p-2">
                <input
                    name="sgpt"
                    value={result.sgpt}
                    onChange={handleChange}
                    readOnly={readOnly}
                    className="w-full rounded bg-rd-field p-2"
                />
            </td>

            <td className="border p-2">
                M: up to 55.1 u/L<br />
                F: up to 34 u/L
            </td>

        </tr>

        <tr>

            <td className="border p-2">Uric Acid</td>

            <td className="border p-2">
                <input
                    name="uricAcid"
                    value={result.uricAcid}
                    onChange={handleChange}
                    readOnly={readOnly}
                    className="w-full rounded bg-rd-field p-2"
                />
            </td>

            <td className="border p-2">
                M: 200-420 umol/L<br />
                F: 140-340 umol/L
            </td>

            <td className="border p-2">Total Bilirubin</td>

            <td className="border p-2">
                <input
                    name="totalBilirubin"
                    value={result.totalBilirubin}
                    onChange={handleChange}
                    readOnly={readOnly}
                    className="w-full rounded bg-rd-field p-2"
                />
            </td>

            <td className="border p-2">
                up to 16.6 umol/L
            </td>

        </tr>

        <tr>

            <td className="border p-2">Total Cholesterol</td>

            <td className="border p-2">
                <input
                    name="totalCholesterol"
                    value={result.totalCholesterol}
                    onChange={handleChange}
                    readOnly={readOnly}
                    className="w-full rounded bg-rd-field p-2"
                />
            </td>

            <td className="border p-2">
                Suspect over = 5.7 mmol/L<br />
                Elevated over = 6.7 mmol/L
            </td>

            <td className="border p-2">Direct Bilirubin</td>

            <td className="border p-2">
                <input
                    name="directBilirubin"
                    value={result.directBilirubin}
                    onChange={handleChange}
                    readOnly={readOnly}
                    className="w-full rounded bg-rd-field p-2"
                />
            </td>

            <td className="border p-2">
                up to 4.3 umol/L
            </td>

        </tr>

        <tr>

            <td className="border p-2">Triglycerides</td>

            <td className="border p-2">
                <input
                    name="triglycerides"
                    value={result.triglycerides}
                    onChange={handleChange}
                    readOnly={readOnly}
                    className="w-full rounded bg-rd-field p-2"
                />
            </td>

            <td className="border p-2">
                Suspect over = 1.71 mmol/L<br />
                Elevated over = 3.70 mmol/L
            </td>

            <td className="border p-2">Indirect Bilirubin</td>

            <td className="border p-2">
                <input
                    name="indirectBilirubin"
                    value={result.indirectBilirubin}
                    onChange={handleChange}
                    readOnly={readOnly}
                    className="w-full rounded bg-rd-field p-2"
                />
            </td>

            <td className="border p-2">
                0.2 - 0.8 mg/dL
            </td>

        </tr>

        <tr>

            <td className="border p-2">HDL Cholesterol</td>

            <td className="border p-2">
                <input
                    name="hdlCholesterol"
                    value={result.hdlCholesterol}
                    onChange={handleChange}
                    readOnly={readOnly}
                    className="w-full rounded bg-rd-field p-2"
                />
            </td>

            <td className="border p-2">
                M: 1.43 mmol/L<br />
                F: 1.69 mmol/L
            </td>

            <td className="border p-2">HBA1c</td>

            <td className="border p-2">
                <input
                    name="hba1c"
                    value={result.hba1c}
                    onChange={handleChange}
                    readOnly={readOnly}
                    className="w-full rounded bg-rd-field p-2"
                />
            </td>

            <td className="border p-2">
                &lt; 6.5 %
            </td>

        </tr>

        <tr>

            <td className="border p-2">LDL Cholesterol</td>

            <td className="border p-2">
                <input
                    name="ldlCholesterol"
                    value={result.ldlCholesterol}
                    onChange={handleChange}
                    readOnly={readOnly}
                    className="w-full rounded bg-rd-field p-2"
                />
            </td>

            <td className="border p-2">
                Suspect over = 3.8 mmol/L<br />
                Elevated over = 4.8 mmol/L
            </td>

            <td className="border p-2">BUN</td>

            <td className="border p-2">
                <input
                    name="bun"
                    value={result.bun}
                    onChange={handleChange}
                    readOnly={readOnly}
                    className="w-full rounded bg-rd-field p-2"
                />
            </td>

            <td className="border p-2">
                10-40 mg/dL
            </td>

        </tr>

    </tbody>

</table>

<LabSignatures
                        doctorId={doctorId}
                        doctorName={doctorName}
                        medtechId={medtechId}
                        medtechName={medtechName}
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