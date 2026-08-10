"use client";

import { useCurrentUser } from "@/lib/session";

export default function labSignatures({ doctorName = "" }) {
    const user = useCurrentUser();

    console.log("labSignatures user:", user);

    return (
        <div className="grid grid-cols-2 gap-20 pt-10">

            <div className="text-center">

                <div className="border-t border-current pt-2">
                    {user?.username || ""}
                </div>

                <p className="text-sm">
                    Medical Technologist
                </p>

            </div>

            <div className="text-center">

                <div className="border-t border-current pt-2">
                    {doctorName}
                </div>

                <p className="text-sm">
                    Pathologist
                </p>

            </div>

        </div>
    );
}