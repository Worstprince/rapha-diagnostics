"use client";

import PatientListPage from "@/components/dashboard/PatientListPage";

export default function DoctorPatientsPage() {
  return <PatientListPage basePath="/dashboard/doctor" roleLabel="Doctor" />;
}
