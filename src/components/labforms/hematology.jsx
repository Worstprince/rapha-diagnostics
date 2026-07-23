"use client";

import { useState } from "react";
import LabReportHeader from "./labReportHeader";

export default function HematologyResult({ patient, onSubmit }) {

    const [result, setResult] = useState({
        hemoglobin: "",
        rbc: "",
        wbc: "",
        bleedingTime: "",
        clottingTime: "",
        bloodGroup: "",
        platelet: "",
        hematocrit: "",
        bsmp: "",
        others: "",

        segmenters: "",
        band: "",
        juvenile: "",
        lymphocytes: "",
        monocytes: "",
        eosinophils: "",
        basophils: "",

        mcv: "",
        mch: "",
        mchc: "",
        rdw: ""
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

        <div className="space-y-6">

            <LabReportHeader
                patient={patient}
                title="HEMATOLOGY"
            />

            {/* Results */}

            <div className="grid lg:grid-cols-2 gap-6">

                {/* LEFT */}

                <div className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-slate-800">

                                <th className="p-3 text-left text-white">
                                    Test
                                </th>

                                <th className="text-white">
                                    Result
                                </th>

                                <th className="text-white">
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
                                    className="border-t border-slate-700"
                                >

                                    <td className="p-2 text-white">
                                        {item[1]}
                                    </td>

                                    <td className="p-2">

                                        <input
                                            name={item[0]}
                                            value={result[item[0]]}
                                            onChange={handleChange}
                                            className="w-full rounded bg-slate-800 p-2 text-white"
                                        />

                                    </td>

                                    <td className="p-2 text-slate-400 whitespace-pre-line">
                                        {item[2]}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                {/* RIGHT */}

                <div className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-slate-800">

                                <th className="p-3 text-left text-white">
                                    Leukocytes
                                </th>

                                <th className="text-white">
                                    Result
                                </th>

                                <th className="text-white">
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
                                    className="border-t border-slate-700"
                                >

                                    <td className="p-2 text-white">
                                        {item[1]}
                                    </td>

                                    <td className="p-2">

                                        <input
                                            name={item[0]}
                                            value={result[item[0]]}
                                            onChange={handleChange}
                                            className="w-full rounded bg-slate-800 p-2 text-white"
                                        />

                                    </td>

                                    <td className="p-2 text-slate-400">
                                        {item[2]}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* Signatures */}

            <div className="grid md:grid-cols-2 gap-8 rounded-xl border border-slate-700 bg-slate-900 p-6">

                <div>

                    <p className="border-t border-slate-600 pt-2 text-center text-white">
                        Pathologist
                    </p>

                </div>

                <div>

                    <p className="border-t border-slate-600 pt-2 text-center text-white">
                        Medical Technologist
                    </p>

                </div>

            </div>

            <div className="flex justify-end">

                <button
                    onClick={handleSubmit}
                    className="rounded-lg bg-cyan-600 px-6 py-3 text-white hover:bg-cyan-500"
                >
                    Save Result
                </button>

            </div>

        </div>

    );

}