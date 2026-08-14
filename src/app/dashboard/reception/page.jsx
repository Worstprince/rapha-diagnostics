import Link from "next/link";

import {
    Avatar,
    CalendarCheckIcon,
    ChevronRightIcon,
    ClipboardIcon,
    PageHeader,
    toneBar,
} from "./_ui";

const queueItems = [
    { name: "S. Ibrahim", note: "Blood sample collection pending", tone: "warn" },
    { name: "T. Olu", note: "Results ready for pickup", tone: "ok" },
    { name: "M. Adebayo", note: "Billing summary requested", tone: "info" },
];

const intakeActions = [
    {
        title: "Patient registration",
        description: "Capture demographics and prepare intake documents for a new patient.",
        href: "/dashboard/reception/registration",
        Icon: ClipboardIcon,
        chip: "bg-cyan-500/12 text-cyan-600",
    },
    {
        title: "Patient visitation",
        description: "Register a visit, choose tests, and hand off to the laboratory.",
        href: "/dashboard/reception/visitation",
        Icon: CalendarCheckIcon,
        chip: "bg-emerald-500/12 text-emerald-600",
    },
];

export default function ReceptionDashboardPage() {
    return (
        <div className="mx-auto max-w-5xl space-y-5">

            <PageHeader
                title="Patient intake workspace"
                description="Keep patient registration and visitation workflows organised from one compact view."
            />

            <section className="grid gap-4 sm:grid-cols-2">

                {intakeActions.map(({ title, description, href, Icon, chip }) => (

                    <Link
                        key={title}
                        href={href}
                        className="rd-panel rd-press rd-focus group flex flex-col p-5 transition-colors hover:border-rd-cyan/40"
                    >

                        <div className="flex items-start justify-between gap-3">

                            <span className={`grid size-10 flex-none place-items-center rounded-xl ${chip}`}>
                                <Icon size={20} />
                            </span>

                            <ChevronRightIcon
                                size={18}
                                className="text-rd-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-rd-cyan motion-reduce:transition-none"
                            />

                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-rd-title">
                            {title}
                        </h2>

                        <p className="mt-1 text-sm text-rd-muted">
                            {description}
                        </p>

                    </Link>

                ))}

            </section>

            <section className="rd-panel overflow-hidden">

                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rd-hair p-4">

                    <div>

                        <h2 className="text-lg font-semibold text-rd-title">Today’s queue</h2>

                        <p className="mt-0.5 text-sm text-rd-muted">
                            Front-desk items waiting on an action.
                        </p>

                    </div>

                    <span className="text-sm text-rd-muted">
                        {queueItems.length} {queueItems.length === 1 ? "item" : "items"}
                    </span>

                </div>

                <ul className="space-y-3 p-4">

                    {queueItems.map((item) => (

                        <li
                            key={item.name}
                            className="relative flex flex-wrap items-center gap-x-4 gap-y-2 overflow-hidden rounded-xl border border-rd-hair bg-rd-sunken py-4 pl-6 pr-4 transition-colors hover:border-rd-hair-strong hover:bg-rd-raised"
                        >

                            <span
                                aria-hidden="true"
                                className={`absolute inset-y-0 left-0 w-1 ${toneBar[item.tone]}`}
                            />

                            <Avatar name={item.name} className="size-10 text-sm" />

                            <div className="min-w-0 flex-1">

                                <p className="truncate text-[15px] font-semibold text-rd-title">
                                    {item.name}
                                </p>

                                <p className="mt-0.5 truncate text-sm text-rd-muted">
                                    {item.note}
                                </p>

                            </div>

                        </li>

                    ))}

                </ul>

            </section>

        </div>
    );
}
