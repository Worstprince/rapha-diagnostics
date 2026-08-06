const tasks = [
  { title: "Morning review", detail: "12 pending results" },
  { title: "Patient follow-up", detail: "3 appointments due" },
  { title: "Case notes", detail: "2 reports drafted" },
];

export default function DoctorDashboardPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-rd-hair bg-rd-card p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rd-cyan">Doctor</p>
        <h1 className="mt-2 text-3xl font-semibold text-rd-title">Today’s care queue</h1>
        <p className="mt-2 text-sm text-rd-muted">Review lab findings, notes, and follow-up tasks in one place.</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-2xl border border-rd-hair bg-rd-card p-6">
          <h2 className="text-lg font-semibold text-rd-title">Priority patients</h2>
          <ul className="mt-4 space-y-3 text-sm text-rd-label">
            <li className="rounded-xl border border-rd-hair bg-rd-sunken p-3">A. Mensah — urgent CBC review</li>
            <li className="rounded-xl border border-rd-hair bg-rd-sunken p-3">D. Okafor — pathology follow-up</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-rd-hair bg-rd-card p-6">
          <h2 className="text-lg font-semibold text-rd-title">Daily tasks</h2>
          <div className="mt-4 space-y-3">
            {tasks.map((task) => (
              <div key={task.title} className="rounded-xl border border-rd-hair bg-rd-sunken p-3">
                <p className="text-sm font-medium text-rd-title">{task.title}</p>
                <p className="mt-1 text-sm text-rd-muted">{task.detail}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
