"use client";

import { useState } from "react";
import LabReportHeader, { LabSignatures } from "./labReportHeader";

export default function HematologyResult({
    patient,
    onSubmit,
    initialData = {},
    readOnly = false,
    hasExistingResult = false,
    doctorId,
    doctorName,
    medtechId,
    medtechName,
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

        <div className="space-y-6">

            <LabReportHeader
                patient={patient}
                title="HEMATOLOGY"
            />

            {/* Results */}

            <div className="grid lg:grid-cols-2 gap-6">

                {/* LEFT */}

                <div className="rounded-xl border border-rd-hair-strong bg-rd-card overflow-hidden">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-rd-sunken">

                                <th className="p-3 text-left text-rd-title">
                                    Test
                                </th>

                                <th className="text-rd-title">
                                    Result
                                </th>

                                <th className="text-rd-title">
                                    Normal Value
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {[
                                ["hemoglobin","Hemoglobin Mass Concentration","M:140-170 g/L\nF:120-150 g/L"],
                                ["rbc","RBC no. Conc.","4.5-5.5 x10g/l"],
                                ["wbc","WBC no. Conc.","5.5-10.0 x10g/l"],
                                ["bleedingTime","Bleeding Time","1-3 mins"],
                                ["clottingTime","Clotting Time","2-6 mins"],
                                ["bloodGroup","Blood Group",""],
                                ["platelet","Platelet Count","150-450 x10g/l"],
                                ["hematocrit","Hematocrit",""],
                                ["bsmp","BSMP",""],
                                ["others","Others",""]
                            ].map(item => (

                                <tr
                                    key={item[0]}
                                    className="border-t border-rd-hair-strong"
                                >

                                    <td className="p-2 text-rd-title">
                                        {item[1]}
                                    </td>

                                    <td className="p-2">

                                        <input
                                            name={item[0]}
                                            value={result[item[0]]}
                                            onChange={handleChange}
                                            readOnly={readOnly}
                                            className="w-full rounded bg-rd-field p-2 text-rd-title"
                                        />

                                    </td>

                                    <td className="p-2 text-rd-muted whitespace-pre-line">
                                        {item[2]}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                {/* RIGHT */}

                <div className="rounded-xl border border-rd-hair-strong bg-rd-card overflow-hidden">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-rd-sunken">

                                <th className="p-3 text-left text-rd-title">
                                    Leukocytes
                                </th>

                                <th className="text-rd-title">
                                    Result
                                </th>

                                <th className="text-rd-title">
                                    Normal
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {[
                                ["segmenters","Segmenters","0.55-0.65"],
                                ["band","Band","0.02-0.04"],
                                ["juvenile","Juvenile","0.00-0.02"],
                                ["lymphocytes","Lymphocytes","0.25-0.35"],
                                ["monocytes","Monocytes","0.02-0.06"],
                                ["eosinophils","Eosinophils","0.02-0.04"],
                                ["basophils","Basophils","0.00-0.01"],
                                ["mcv","MCV","80-100 fl"],
                                ["mch","MCH","27-31 pg"],
                                ["mchc","MCHC","32-36 g/dL"],
                                ["rdw","RDW-CV","11-15 %"]
                            ].map(item => (

                                <tr
                                    key={item[0]}
                                    className="border-t border-rd-hair-strong"
                                >

                                    <td className="p-2 text-rd-title">
                                        {item[1]}
                                    </td>

                                    <td className="p-2">

                                        <input
                                            name={item[0]}
                                            value={result[item[0]]}
                                            onChange={handleChange}
                                            readOnly={readOnly}
                                            className="w-full rounded bg-rd-field p-2 text-rd-title"
                                        />

                                    </td>

                                    <td className="p-2 text-rd-muted">
                                        {item[2]}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* Signatures */}

            <LabSignatures
                doctorId={doctorId}
                doctorName={doctorName}
                medtechId={medtechId}
                medtechName={medtechName}
            />

            {!readOnly && (

                <div className="flex justify-end">

                    <button
                        onClick={handleSubmit}
                        className="rd-btn rd-press rd-focus"
                    >
                        {hasExistingResult  ? "Update Result" : "Save Result"}
                    </button>

                </div>

            )}

        </div>

    );

}