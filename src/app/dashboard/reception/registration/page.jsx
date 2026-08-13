import Link from "next/link";

import PatientRegistration from "@/components/patient/patientRegistration";

import { ArrowLeftIcon, PageHeader, backLink } from "../_ui";

export default function PatientRegistrationPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-5">

      <Link href="/dashboard/reception" className={backLink}>
        <ArrowLeftIcon size={16} />
        Back to intake
      </Link>

      <PageHeader
        title="Patient registration"
        description="Capture new patient details and prepare them for their visit."
      />

      <PatientRegistration />

    </div>
  );
}
