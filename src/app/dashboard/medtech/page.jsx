const stationCards = [
  { title: "Instruments", value: "12 online", hint: "Connected devices" },
  { title: "Samples", value: "27 queued", hint: "Processing queue" },
  { title: "Completed", value: "94%", hint: "Today’s completion" },
];

export default function MedtechDashboardPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">Medtech</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Lab workflow station</h1>
        <p className="mt-2 text-sm text-slate-400">Track sample progress and equipment state without leaving the bench.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {stationCards.map((card) => (
          <article key={card.title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">{card.title}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
            <p className="mt-1 text-sm text-slate-500">{card.hint}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold text-white">Current assignments</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-400">CBC — Sample 1024 prepared</div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-400">Lipid panel — Awaiting analyzer calibration</div>
        </div>
      </section>
    </div>
  );
}
