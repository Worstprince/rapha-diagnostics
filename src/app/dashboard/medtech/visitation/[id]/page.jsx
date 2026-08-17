"use client";

import VisitationDetails from "@/components/visitations/visitdetails";

export default function DoctorVisitationPage() {

    return (
        <VisitationDetails
            apiPath="/api/doctor/visitationDisplay"
            dashboardPath="/dashboard/medtech"
        />
    );

}