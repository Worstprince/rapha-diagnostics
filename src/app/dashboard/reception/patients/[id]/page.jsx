"use client";

import { useParams } from "next/navigation";
import PatientDetails from "@/components/patient/patientDetails";

export default function ReceptionPatientPage() {
    const { id } = useParams();

    return (
        <PatientDetails
            patientId={id}
            role="reception"
            basePath="/dashboard/reception"
        />
    );
}