import PatientRegistration from "@/components/patientRegistration";

export default function PatientRegistrationPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">Reception</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Patient registration</h1>
        <p className="mt-2 text-sm text-slate-400">Capture new patient details and prepare them for their visit.</p>
      </header>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <PatientRegistration />
      
      </section>
    </div> 
  );
}
