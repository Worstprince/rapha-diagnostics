"use client";

import VisitationQueue from "@/components/visitations/visitqueue";

export default function MedtechVisitationPage() {
    return (
        <VisitationQueue
            role="medtech"
            title="Patient Visitations"
            subtitle="Review visitations that still require test processing."
        />
    );
}