"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeftIcon,
  Avatar,
  CakeIcon,
  CalendarIcon,
  ChevronRightIcon,
  EmptyState,
  FlaskIcon,
  HeaderGlow,
  MapPinIcon,
  PhoneIcon,
  Pill,
  PriorityPill,
  UserIcon,
  backLink,
  rowAction,
  td,
  th,
} from "@/app/dashboard/_ui";

function Detail({ icon: Glyph, label, value }) {
  return (
    <div className="min-w-0 bg-rd-sunken px-6 py-5">
      <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
        <Glyph size={14} />
        {label}
      </dt>
      <dd title={value || undefined} className="mt-2 truncate text-base font-semibold text-rd-title">
        {value || <span className="text-rd-placeholder">Not recorded</span>}
      </dd>
    </div>
  );
}

export default function VisitationDetailPage({ basePath = "/dashboard/doctor", roleLabel = "Doctor" }) {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [tests, setTests] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchVisitation() {
      try {
        const response = await fetch(`/api/doctor/visitationDisplay/${id}`);
        const result = await response.json();

        if (!response.ok) {
          console.error(result.message || "Could not load this visitation.");
          setPatient(null);
          return;
        }

        setPatient(result.patient);
        setTests(Array.isArray(result.tests) ? result.tests : []);
      } catch (error) {
        console.error(error);
      }
    }

    fetchVisitation();
  }, [id]);

  const backToQueue = (
    <Link href={`${basePath}/visitation`} className={backLink}>
      <ArrowLeftIcon size={16} />
      Back to visitations
    </Link>
  );

  if (!patient) {
    return (
      <div className="mx-auto max-w-6xl space-y-5">
        {backToQueue}
        <div className="rd-panel h-32 animate-pulse motion-reduce:animate-none" />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rd-panel h-80 animate-pulse motion-reduce:animate-none" />
          <div className="rd-panel h-80 animate-pulse motion-reduce:animate-none lg:col-span-2" />
        </div>
      </div>
    );
  }

  const identitySummary = [
    patient.age ? `${patient.age} yrs` : null,
    patient.sex,
    `${tests.length} ${tests.length === 1 ? "test" : "tests"} requested`,
  ].filter(Boolean).join("  ·  ");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">
      <div className="flex-none">{backToQueue}</div>

      <header className="rd-panel relative flex-none overflow-hidden">
        <HeaderGlow />

        <div className="relative flex flex-wrap items-center justify-between gap-5 px-6 py-6">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar name={patient.name} className="size-14 text-base" />

            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">{roleLabel}</p>
              <h1 className="mt-1.5 truncate text-2xl font-bold tracking-tight text-rd-title">{patient.name}</h1>
              <p className="mt-1.5 truncate text-sm text-rd-muted">{identitySummary}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PriorityPill value={patient.priority} />
            <Pill value={patient.status} />
            <button type="button" onClick={() => setShowDetails((open) => !open)} aria-expanded={showDetails} aria-controls="patient-details" className={rowAction}>
              Details
              <ChevronRightIcon size={16} className={`transition-transform ${showDetails ? "rotate-90" : ""}`} />
            </button>
          </div>
        </div>

        {showDetails && (
          <dl id="patient-details" className="relative grid gap-px border-t border-rd-hair bg-rd-hair sm:grid-cols-2 lg:grid-cols-3">
            <Detail icon={UserIcon} label="Age" value={patient.age ? `${patient.age} yrs` : ""} />
            <Detail icon={UserIcon} label="Sex" value={patient.sex} />
            <Detail icon={CakeIcon} label="Birthdate" value={patient.birthdate} />
            <Detail icon={PhoneIcon} label="Mobile" value={patient.mobileNum} />
            <Detail icon={CalendarIcon} label="Visit Date" value={patient.visited_at} />
            <Detail icon={MapPinIcon} label="Address" value={patient.address} />
          </dl>
        )}
      </header>

      <section className="rd-panel flex min-h-0 flex-1 flex-col overflow-hidden max-lg:h-fit">
        <div className="flex flex-none flex-wrap items-center justify-between gap-3 border-b border-rd-hair p-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-rd-title">Requested Laboratory Tests</h2>
            <p className="mt-0.5 text-sm text-rd-muted">{tests.length} requested</p>
          </div>
        </div>

        {tests.length === 0 ? (
          <EmptyState title="No tests requested" hint="Laboratory tests requested for this visit will appear here." Icon={FlaskIcon} />
        ) : (
          <div className="rd-scroll-thin min-h-0 flex-1 overflow-auto">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="border-b border-rd-hair">
                  <th className={th}>Test</th>
                  <th className={th}>Status</th>
                  <th className={`${th} text-right`}>Action</th>
                </tr>
              </thead>

              <tbody>
                {tests.map((test) => (
                  <tr key={test.id} className="border-b border-rd-hair last:border-0 hover:bg-rd-raised">
                    <td className={td}>
                      <div className="min-w-0">
                        <p className="font-medium text-rd-title">{test.name}</p>
                        <p className="text-xs text-rd-muted">#{test.id}</p>
                      </div>
                    </td>
                    <td className={td}><Pill value={test.status} /></td>
                    <td className={`${td} text-right`}>
                      <Link href={`${basePath}/visitation/${id}`} className={rowAction}>
                        View
                        <ChevronRightIcon size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
