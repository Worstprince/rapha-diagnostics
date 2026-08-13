import Link from "next/link";

import PatientVisit from "@/components/patient/VisitRegistrationForm";

import { ArrowLeftIcon, PageHeader, backLink } from "../_ui";

export default function PatientVisitationPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-5">

      <Link href="/dashboard/reception" className={backLink}>
        <ArrowLeftIcon size={16} />
        Back to intake
      </Link>

      <PageHeader
        title="Patient visitation"
        description="Register a visit, select the requested tests, and hand off to the laboratory."
      />

      <PatientVisit />

    </div>
  );
}
