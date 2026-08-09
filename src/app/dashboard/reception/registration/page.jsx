import PatientRegistration from "@/components/patient/patientRegistration";

export default function PatientRegistrationPage() {
  return (
    <div className="space-y-6">
      <header className="rd-panel p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">Reception</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">Patient registration</h1>
        <p className="mt-2 text-sm text-rd-muted">Capture new patient details and prepare them for their visit.</p>
      </header>

      <section className="rd-panel p-6">
        <PatientRegistration />

      </section>
    </div>
  );
}
