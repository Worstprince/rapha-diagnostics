"use client";

import { useSignatureOnFile } from "@/lib/useSignatureOnFile";

const BAND_COLORS = {
  HEMATOLOGY: "#D99694",
  "CLINICAL CHEMISTRY": "#92D050",
  CHEMISTRY: "#92D050",
  "IMMUNOLOGY/SEROLOGY": "#92D050",
  "IMMUNOLOGY and SEROLOGY": "#92D050",
  "CLINICAL MICROSCOPY": "#FFFF00",
  "SEMEN ANALYSIS": "#FFFF00",
  "STOOL EXAM": "#FFFF00",
};

const DEFAULT_BAND = "#D99694";

function Field({ label, value, wide = false }) {

    return (

        <>

            <th
                scope="row"
                className="w-px whitespace-nowrap border border-rd-hair-strong px-2 text-left font-semibold"
            >
                {label}:
            </th>

            <td
                className={`border border-rd-hair-strong px-2 text-center ${wide ? "w-[38%]" : ""}`}
            >
                {value || "—"}
            </td>

        </>

    );

}

function SignatureBlock({ name, extension, license, role, signerId }) {
    const printedName = [name, extension].filter(Boolean).join(", ");

    /* Rendered only once the image is known to load. The shared placeholder
       that used to fill this slot is gone deliberately: printing somebody
       else's mark above a name is worse than printing none, and an unsigned
       report should look unsigned. */
    const onFile = useSignatureOnFile(signerId);

    return (
        <div className="text-center">

            <div className="flex h-12 items-end justify-center print:h-11">

                {/* The signer's own uploaded mark, painted through a mask so it
                    takes the theme's ink colour rather than being inverted. The
                    static placeholder is kept only as the fallback for a signer
                    with nothing on file yet.

                    A 404 from the signature route is expected and harmless: an
                    unresolvable mask paints nothing, so the space above the name
                    is simply empty instead of showing a broken image. */}
                {onFile === "present" && (
                    <span
                        aria-hidden="true"
                        className="rd-sign"
                        style={{ "--rd-sign-src": `url("/api/users/${signerId}/signature")` }}
                    />
                )}

            </div>

            <div className="font-semibold uppercase leading-tight print:text-[12px]">
                {printedName}
            </div>

            {license && (
                <div className="leading-tight tabular-nums print:text-[12px]">
                    License No. {license}
                </div>
            )}

            <div className="leading-tight text-rd-muted print:text-[12px]">
                {role}
            </div>

        </div>
    );
}

export function LabSignatures({
    doctorId,
    doctorName,
    doctorLicense,
    doctorExtension,
    medtechId,
    medtechName,
    medtechLicense,
    medtechExtension,
}) {
    const doctorLabel = doctorName || (doctorId ? `Dr. ID ${doctorId}` : "Unassigned");
    const medtechLabel = medtechName || (medtechId ? `MedTech ID ${medtechId}` : "Unassigned");

    return (
        <>

            <div className="grid grid-cols-2 items-end gap-6 pt-8 print:gap-2 print:pt-3">

                <SignatureBlock
                    name={doctorLabel}
                    extension={doctorExtension}
                    license={doctorLicense}
                    role="Pathologist"
                    signerId={doctorId}
                />

                <SignatureBlock
                    name={medtechLabel}
                    extension={medtechExtension}
                    license={medtechLicense}
                    role="Medical Technologist"
                    signerId={medtechId}
                />

            </div>

        </>
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

            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 print:gap-2">

                <img
                    src="/rapha-logo.png"
                    alt=""
                    className="rd-lab-logo h-16 w-16 flex-none object-contain sm:h-[4.5rem] sm:w-[4.5rem] print:h-[0.8in] print:w-[0.8in]"
                />

                <div className="min-w-0 text-center">

                    <h1 className="font-serif text-xl font-bold uppercase tracking-wide sm:text-3xl print:text-[19px] print:leading-tight">
                        RAPHA DIAGNOSTIC LABORATORY
                    </h1>

                    <p className="mt-1 font-serif text-xs italic sm:text-sm print:mt-0.5 print:text-[13px] print:leading-tight">
                        &quot;Your Health, Our Priority&quot;
                    </p>

                    <p className="font-serif text-xs sm:text-sm print:text-[13px] print:leading-tight">
                        Esperanza Building, Quezon Boulevard, Kidapawan City
                    </p>

                </div>

                <span
                    aria-hidden="true"
                    className="h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] print:h-[0.8in] print:w-[0.8in]"
                />

            </div>

            {title && (
                <h2 className="rd-report-band relative py-0.5 text-center font-serif text-xl font-bold uppercase tracking-[0.06em] sm:text-2xl print:py-0 print:text-[17px] print:leading-snug">

                    <svg
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full"
                        preserveAspectRatio="none"
                    >
                        <rect
                            className="rd-band-fill"
                            width="100%"
                            height="100%"
                            fill={BAND_COLORS[title] ?? DEFAULT_BAND}
                        />
                    </svg>

                    <span className="relative">{title}</span>

                </h2>
            )}

            <table className="w-full table-auto! border-collapse text-sm">

                <tbody>

                    <tr>
                        <Field label="Name" value={patient.name} wide />
                        <Field label="Age" value={patient.age} />
                        <Field label="Date" value={today} />
                    </tr>

                    <tr>
                        <Field label="Address" value={patient.address} wide />
                        <Field label="Sex" value={patient.sex} />
                        <Field label="Physician" value={patient.physician} />
                    </tr>

                </tbody>

            </table>

        </>

    );

}
