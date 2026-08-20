"use client";

import { useState } from "react";
import { REFERENCE_RANGES } from "./referenceRanges";
import LabReportHeader, { LabSignatures } from "./labReportHeader";
import ResultField from "./ResultField";

const RANGES = REFERENCE_RANGES.hematology;

export default function HematologyResult({
    patient,
    onSubmit,
    initialData = {},
    readOnly = false,
    hasExistingResult = false,
    doctorId,
    doctorName,
    doctorLicense,
    doctorExtension,
    medtechId,
    medtechName,
    medtechLicense,
    medtechExtension,
}) {

const [result, setResult] = useState({
    hemoglobin: initialData?.hemoglobinMass ?? "",
    rbc: initialData?.rbcNumConcentration ?? "",
    wbc: initialData?.wbcNumConcentration ?? "",
    bleedingTime: initialData?.bleedingTime ?? "",
    clottingTime: initialData?.clottingTime ?? "",
    bloodGroup: initialData?.bloodGroup ?? "",
    platelet: initialData?.plateletCount ?? "",
    hematocrit: initialData?.hematoCrit ?? "",
    bsmp: initialData?.bsmp ?? "",
    others: initialData?.other ?? "",

    segmenters: initialData?.segmenters ?? "",
    band: initialData?.band ?? "",
    juvenile: initialData?.juvenile ?? "",
    lymphocytes: initialData?.lymphocytes ?? "",
    monocytes: initialData?.monocytes ?? "",
    eosinophils: initialData?.eosinophils ?? "",
    basophils: initialData?.basophils ?? "",

    mcv: initialData?.mcv ?? "",
    mch: initialData?.mch ?? "",
    mchc: initialData?.mchc ?? "",
    rdw: initialData?.rdwCv ?? ""
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
            className="print-result space-y-8 rounded-2xl border border-rd-hair bg-rd-card p-8"
        >

            <LabReportHeader
                patient={patient}
                title="HEMATOLOGY"
            />

            {/* Results */}

            <div className="grid gap-6 lg:grid-cols-2 print:grid-cols-2 print:gap-2">

                {/* LEFT */}

                <div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-rd-hair-strong">

                            <thead>

                                <tr className="bg-rd-sunken">

                                    <th className="border border-rd-hair-strong p-2 text-left text-rd-title">
                                        Test
                                    </th>

                                    <th className="border border-rd-hair-strong p-2 text-rd-title">
                                        Result
                                    </th>

                                    <th className="border border-rd-hair-strong p-2 text-rd-title">
                                        Normal Value
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {[
                                    ["hemoglobin", "Hemoglobin Mass Concentration", "M:140-170 g/L\nF:120-150 g/L", "number"],
                                    ["rbc", "RBC no. Conc.", "4.5-5.5 x10g/l", "number"],
                                    ["wbc", "WBC no. Conc.", "5.5-10.0 x10g/l", "number"],
                                    ["bleedingTime", "Bleeding Time", "1-3 mins", "number"],
                                    ["clottingTime", "Clotting Time", "2-6 mins", "number"],
                                    ["bloodGroup", "Blood Group", "A / B / AB / O", "text"],
                                    ["platelet", "Platelet Count", "150-450 x10g/l", "number"],
                                    ["hematocrit", "Hematocrit", "M:0.40-0.54\nF:0.36-0.48", "number"],
                                    ["bsmp", "BSMP", "Negative", "text"],
                                    ["others", "Others", "—", "text"]
                                ].map(item => (

                                    <tr
                                        key={item[0]}
                                    >

                                        <td className="border border-rd-hair-strong p-2 text-rd-title">
                                            {item[1]}
                                        </td>

                                        <td className="border border-rd-hair-strong p-2">

                                            <ResultField
                                                name={item[0]}
                                                value={result[item[0]]}
                                                onChange={handleChange}
                                                readOnly={readOnly}
                                                range={RANGES[item[0]]}
                                                sex={patient?.sex}
                                                type={item[3]}
                                            />

                                        </td>

                                        <td className="border border-rd-hair-strong p-2 text-rd-muted whitespace-pre-line">
                                            {item[2]}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>
                    </div>

                </div>

                {/* RIGHT */}

                <div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-rd-hair-strong">

                            <thead>

                                <tr className="bg-rd-sunken">

                                    <th className="border border-rd-hair-strong p-2 text-left text-rd-title">
                                        Leukocytes
                                    </th>

                                    <th className="border border-rd-hair-strong p-2 text-rd-title">
                                        Result
                                    </th>

                                    <th className="border border-rd-hair-strong p-2 text-rd-title">
                                        Normal
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {[
                                    ["segmenters", "Segmenters", "0.55-0.65", "number"],
                                    ["band", "Band", "0.02-0.04", "number"],
                                    ["juvenile", "Juvenile", "0.00-0.02", "number"],
                                    ["lymphocytes", "Lymphocytes", "0.25-0.35", "number"],
                                    ["monocytes", "Monocytes", "0.02-0.06", "number"],
                                    ["eosinophils", "Eosinophils", "0.02-0.04", "number"],
                                    ["basophils", "Basophils", "0.00-0.01", "number"],
                                    ["mcv", "MCV", "80-100 fl", "number"],
                                    ["mch", "MCH", "27-31 pg", "number"],
                                    ["mchc", "MCHC", "32-36 g/dL", "number"],
                                    ["rdw", "RDW-CV", "11-15 %", "number"]
                                ].map(item => (

                                    <tr
                                        key={item[0]}
                                    >

                                        <td className="border border-rd-hair-strong p-2 text-rd-title">
                                            {item[1]}
                                        </td>

                                        <td className="border border-rd-hair-strong p-2">

                                            <ResultField
                                                name={item[0]}
                                                value={result[item[0]]}
                                                onChange={handleChange}
                                                readOnly={readOnly}
                                                range={RANGES[item[0]]}
                                                sex={patient?.sex}
                                                type={item[3]}
                                            />

                                        </td>

                                        <td className="border border-rd-hair-strong p-2 text-rd-muted">
                                            {item[2]}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>
                    </div>

                </div>

            </div>

            {/* Signatures */}

            <LabSignatures
                doctorId={doctorId}
                doctorName={doctorName}
                doctorLicense={doctorLicense}
                doctorExtension={doctorExtension}
                medtechId={medtechId}
                medtechName={medtechName}
                medtechLicense={medtechLicense}
                medtechExtension={medtechExtension}
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