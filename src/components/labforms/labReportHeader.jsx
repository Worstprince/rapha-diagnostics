"use client";

export default function LabReportHeader({ patient, title }) {


    const today = new Date().toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });


    return (

        <>

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
                    {title}
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
                    <b>Date:</b> {today}
                </div>

                <div>
                    <b>Physician:</b> {patient.physician}
                </div>

            </div>

        </>

    );

}