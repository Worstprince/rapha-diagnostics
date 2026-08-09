import { FlaskIcon, PageHeader, UsersIcon, WalletIcon, toneChip } from "./_ui";

const cards = [
  { title: "Patients", value: "1,284", hint: "Active records", Icon: UsersIcon, tone: "cyan" },
  { title: "Pending tests", value: "38", hint: "Awaiting review", Icon: FlaskIcon, tone: "amber" },
  {
    title: "Monthly revenue",
    value: "$84.2k",
    hint: "Billing summary",
    Icon: WalletIcon,
    tone: "emerald",
  },
];

const alerts = [
  { tone: "warn", text: "Inventory threshold reached for sample collection kits." },
  { tone: "warn", text: "2 billing discrepancies require review." },
  { tone: "info", text: "A doctor has requested a new report template." },
];

const alertTone = {
  warn: "border-amber-500/45 bg-amber-500/12",
  info: "border-rd-hair bg-rd-sunken",
};

const alertDot = {
  warn: "bg-amber-500",
  info: "bg-cyan-500",
};

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <PageHeader
        title="Operations overview"
        description="Monitor system health, staffing, and financial performance."
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ title, value, hint, Icon, tone }) => (
          <article key={title} className="rd-panel p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-rd-label">{title}</p>
              <span
                className={`grid size-10 flex-none place-items-center rounded-xl ${toneChip[tone]}`}
              >
                <Icon size={20} />
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold tabular-nums tracking-tight text-rd-title">
              {value}
            </p>
            <p className="mt-1 text-sm text-rd-muted">{hint}</p>
          </article>
        ))}
      </section>

      <section className="rd-panel overflow-hidden">
        <div className="border-b border-rd-hair p-4">
          <h2 className="text-lg font-semibold text-rd-title">Recent alerts</h2>
        </div>

        <ul className="space-y-2.5 p-4">
          {alerts.map((alert) => (
            <li
              key={alert.text}
              className={`flex items-start gap-3 rounded-xl border p-3 text-sm text-rd-label ${alertTone[alert.tone]}`}
            >
              <span
                aria-hidden="true"
                className={`mt-1.5 size-1.5 flex-none rounded-full ${alertDot[alert.tone]}`}
              />
              <span>{alert.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
