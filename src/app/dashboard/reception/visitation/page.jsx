import PatientVisit from "@/components/patient/VisitRegistrationForm";
export default function PatientVisitationPage() {
  return (
    <div className="space-y-6">
      <header className="rd-panel p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">Reception</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">Patient visitation</h1>
        <p className="mt-2 text-sm text-rd-muted">Track arrivals, visit status, and handoffs to clinicians or technicians.</p>
      </header>

      <section className="rd-panel p-6">
        <h2 className="text-lg font-semibold text-rd-title">Visit tracking</h2>
        <p className="mt-2 text-sm text-rd-muted">This view can host arrival logs, room assignment steps, and check-in completion states.</p>
      </section>

      <PatientVisit />
    </div>
  );
}
