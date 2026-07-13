const cards = [
  { title: "Patients", value: "1,284", hint: "Active records" },
  { title: "Pending tests", value: "38", hint: "Awaiting review" },
  { title: "Monthly revenue", value: "$84.2k", hint: "Billing summary" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Operations overview</h1>
        <p className="mt-2 text-sm text-slate-400">Monitor system health, staffing, and financial performance.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <article key={card.title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">{card.title}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
            <p className="mt-1 text-sm text-slate-500">{card.hint}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold text-white">Recent alerts</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-400">
          <li className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">Inventory threshold reached for sample collection kits.</li>
          <li className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">2 billing discrepancies require review.</li>
          <li className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">A doctor quack has requested a new report template.</li>
        </ul>
      </section>
    </div>
  );
}
