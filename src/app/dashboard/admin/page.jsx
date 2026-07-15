const cards = [
  { title: "Patients", value: "1,284", hint: "Active records" },
  { title: "Pending tests", value: "38", hint: "Awaiting review" },
  { title: "Monthly revenue", value: "$84.2k", hint: "Billing summary" },
];

const alerts = [
  { tone: "warn", text: "Inventory threshold reached for sample collection kits." },
  { tone: "warn", text: "2 billing discrepancies require review." },
  { tone: "info", text: "A doctor has requested a new report template." },
];

function AlertDot({ tone }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-1.5 size-1.5 flex-none rounded-full ${
        tone === "warn" ? "bg-rd-danger" : "bg-rd-cyan"
      }`}
    />
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="rd-panel p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">Admin</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-rd-title">
          Operations overview
        </h1>
        <p className="mt-2 text-sm text-rd-muted">
          Monitor system health, staffing, and financial performance.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article key={card.title} className="rd-panel p-5">
            <p className="text-sm text-rd-muted">{card.title}</p>
            {/* Tabular figures stop the digits from shifting width as values change. */}
            <p className="mt-3 text-3xl font-bold tabular-nums tracking-tight text-rd-title">
              {card.value}
            </p>
            <p className="mt-1 text-sm text-rd-muted">{card.hint}</p>
          </article>
        ))}
      </section>

      <section className="rd-panel p-6">
        <h2 className="text-lg font-semibold text-rd-title">Recent alerts</h2>
        <ul className="mt-4 space-y-2.5">
          {alerts.map((alert) => (
            <li
              key={alert.text}
              className="flex items-start gap-3 rounded-xl border border-rd-hair bg-rd-sunken p-3 text-sm text-rd-label"
            >
              <AlertDot tone={alert.tone} />
              <span>{alert.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
