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
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="rd-panel p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">Reception</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">Patient intake workspace</h1>
        <p className="mt-2 text-sm text-rd-muted">Keep patient registration and visitation workflows organized from one compact view.</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rd-panel p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-rd-title">Primary intake functions</h2>
            <span className="rounded-full border border-rd-cyan/40 bg-rd-cyan/10 px-2.5 py-1 text-xs font-medium uppercase tracking-[0.2em] text-rd-cyan">
              Priority
            </span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {intakeActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="rd-press rd-focus rounded-xl border border-rd-hair bg-rd-sunken p-4 transition hover:border-rd-cyan/50 hover:bg-rd-raised"
              >
                <h3 className="text-sm font-semibold text-rd-title">{action.title}</h3>
                <p className="mt-2 text-sm text-rd-muted">{action.description}</p>
              </Link>
            ))}
          </div>
        </article>

        <article className="rd-panel p-6">
          <h2 className="text-lg font-semibold text-rd-title">Today’s queue</h2>
          <div className="mt-4 space-y-3">
            {queueItems.map((item) => (
              <div key={item.name} className="rounded-xl border border-rd-hair bg-rd-sunken p-3">
                <p className="text-sm font-medium text-rd-title">{item.name}</p>
                <p className="mt-1 text-sm text-rd-muted">{item.note}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
