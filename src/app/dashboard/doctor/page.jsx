const tasks = [
  { title: "Morning review", detail: "12 pending results" },
  { title: "Patient follow-up", detail: "3 appointments due" },
  { title: "Case notes", detail: "2 reports drafted" },
];

export default function DoctorDashboardPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">Doctor</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Today’s care queue</h1>
        <p className="mt-2 text-sm text-slate-400">Review lab findings, notes, and follow-up tasks in one place.</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold text-white">Priority patients</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">A. Mensah — urgent CBC review</li>
            <li className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">D. Okafor — pathology follow-up</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold text-white">Daily tasks</h2>
          <div className="mt-4 space-y-3">
            {tasks.map((task) => (
              <div key={task.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-sm font-medium text-white">{task.title}</p>
                <p className="mt-1 text-sm text-slate-500">{task.detail}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
