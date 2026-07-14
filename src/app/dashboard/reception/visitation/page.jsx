import PatientVisit from "@/components/VisitRegistrationForm";
export default function PatientVisitationPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">Reception</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Patient visitation</h1>
        <p className="mt-2 text-sm text-slate-400">Track arrivals, visit status, and handoffs to clinicians or technicians.</p>
      </header>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold text-white">Visit tracking</h2>
        <p className="mt-2 text-sm text-slate-400">This view can host arrival logs, room assignment steps, and check-in completion states.</p>
      </section>

      <PatientVisit />
    </div>
  );
}
