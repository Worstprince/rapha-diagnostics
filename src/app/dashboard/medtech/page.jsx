const stationCards = [
  { title: "Instruments", value: "12 online", hint: "Connected devices" },
  { title: "Samples", value: "27 queued", hint: "Processing queue" },
  { title: "Completed", value: "94%", hint: "Today’s completion" },
];

export default function MedtechDashboardPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="rd-panel p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">Medtech</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">Lab workflow station</h1>
        <p className="mt-2 text-sm text-rd-muted">Tracks sample progress and equipment state without leaving the bench.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {stationCards.map((card) => (
          <article key={card.title} className="rd-panel p-5">
            <p className="text-sm font-medium text-rd-label">{card.title}</p>
            <p className="mt-3 text-3xl font-bold tabular-nums tracking-tight text-rd-title">{card.value}</p>
            <p className="mt-1 text-sm text-rd-muted">{card.hint}</p>
          </article>
        ))}
      </section>

      <section className="rd-panel p-6">
        <h2 className="text-lg font-semibold text-rd-title">Current assignments</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-rd-hair bg-rd-sunken p-3 text-sm text-rd-label">CBC — Sample 1024 prepared</div>
          <div className="rounded-xl border border-rd-hair bg-rd-sunken p-3 text-sm text-rd-label">Lipid panel — Awaiting analyzer calibration</div>
        </div>
      </section>
    </div>
  );
}
