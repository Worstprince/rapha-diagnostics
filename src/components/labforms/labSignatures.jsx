"use client";

export default function LabSignatures({
    medtechName = "",
    doctorName = ""
}) {
    return (
        <div className="grid grid-cols-2 gap-20 pt-10">

            <div className="text-center">

                <p className="mb-2 text-base font-semibold">
                    {medtechName}
                </p>

                <div className="border-t border-current pt-2">
                </div>

                <p className="text-sm">
                    Medical Technologist
                </p>

            </div>

            <div className="text-center">

                <p className="mb-2 text-base font-semibold">
                    {doctorName}
                </p>

                <div className="border-t border-current pt-2">
                </div>

                <p className="text-sm">
                    Physician
                </p>

            </div>

        </div>
    );
}