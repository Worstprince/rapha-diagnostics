import Link from "next/link";

const queueItems = [
  { name: "S. Ibrahim", note: "Blood sample collection pending" },
  { name: "T. Olu", note: "Results ready for pickup" },
  { name: "M. Adebayo", note: "Billing summary requested" },
];

const intakeActions = [
  {
    title: "Patient registration",
    description: "Create new visits, capture demographics, and prepare intake documents.",
    href: "/dashboard/reception/registration",
  },
  {
    title: "Patient visitation",
    description: "Track arrival status, visit history, and front-desk handoffs.",
    href: "/dashboard/reception/visitation",
  },
];

export default function ReceptionDashboardPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">Reception</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Patient intake workspace</h1>
        <p className="mt-2 text-sm text-slate-400">Keep patient registration and visitation workflows organized from one compact view.</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Primary intake functions</h2>
            <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium uppercase tracking-[0.25em] text-cyan-300">
              Priority
            </span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {intakeActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-cyan-500 hover:bg-slate-900"
              >
                <h3 className="text-sm font-semibold text-white">{action.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{action.description}</p>
              </Link>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold text-white">Today’s queue</h2>
          <div className="mt-4 space-y-3">
            {queueItems.map((item) => (
              <div key={item.name} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-sm font-medium text-white">{item.name}</p>
                <p className="mt-1 text-sm text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
