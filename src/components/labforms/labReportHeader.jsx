"use client";

function Field({ label, value }) {

    return (

        <div className="flex items-baseline gap-2">

            <span className="w-24 flex-none font-semibold">
                {label}:
            </span>

            <span className="min-w-0 flex-1 break-words">
                {value || "—"}
            </span>

        </div>

    );

}

export default function LabReportHeader({ patient, title }) {


    const today = new Date().toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });


    return (

        <>

            <div className="text-center">

                <h1 className="text-3xl font-bold uppercase tracking-wide">
                    RAPHA DIAGNOSTIC LABORATORY
                </h1>

                <p className="mt-1 text-sm italic">
                    &quot;Your Health, Our Priority&quot;
                </p>

                <p className="text-sm">
                    Esperanza Building, Quezon Boulevard, Kidapawan City
                </p>

                {title && (
                    <h2 className="mt-5 text-2xl font-bold uppercase tracking-[0.18em] text-rd-danger">
                        {title}
                    </h2>
                )}

            </div>

            <div className="grid grid-cols-1 gap-x-10 gap-y-2.5 border p-4 text-sm sm:grid-cols-2">

                <Field label="Name" value={patient.name} />

                <Field label="Age" value={patient.age} />

                <Field label="Address" value={patient.address} />

                <Field label="Sex" value={patient.sex} />

                <Field label="Date" value={today} />

                <Field label="Physician" value={patient.physician} />

            </div>

        </>

    );

}
