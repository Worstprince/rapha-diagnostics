import PatientsList from "@/components/patient/patientList";

export default function ReceptionPatientsPage() {
    return (
        <PatientsList
            apiEndpoint="/api/doctor/patients"
            recordPath="/dashboard/reception/patients"
            roleLabel="Reception"
        />
    );
}