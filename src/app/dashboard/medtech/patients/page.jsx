import PatientsList from "@/components/patient/patientList";

export default function MedtechPatientsPage() {

    return (
        <PatientsList
            apiEndpoint="/api/doctor/patients"
            recordPath="/dashboard/medtech/patients"
            roleLabel="Medtech"
        />
    );

}