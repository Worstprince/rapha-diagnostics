"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const th = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-rd-muted";
const td = "px-4 py-3 text-sm text-rd-label";

function StatusPill({ archived }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
        archived
          ? "border-rd-hair-strong bg-rd-raised text-rd-muted"
          : "border-rd-ok-edge bg-rd-ok-bg text-rd-ok"
      }`}
    >
      {/* The dot is decorative — the label carries the meaning, so status never
          depends on colour alone. */}
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${archived ? "bg-rd-muted" : "bg-rd-cyan"}`}
      />
      {archived ? "Archived" : "Active"}
    </span>
  );
}

function PencilIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="transition-transform duration-200 ease-out group-hover/edit:-translate-y-px"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

export default function DisplayUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch("/api/users/display");
        const data = await response.json();
        if (cancelled) return;
        setUsers(Array.isArray(data) ? data : (data?.rows ?? []));
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="rd-panel overflow-hidden">
      {/* Only this wrapper scrolls, so a wide table never pushes the page sideways. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="border-b border-rd-hair">
              <th className={th}>ID</th>
              <th className={th}>Username</th>
              <th className={th}>Role</th>
              <th className={th}>Created</th>
              <th className={th}>Status</th>
              <th className={`${th} text-right`}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-rd-hair transition-colors last:border-0 hover:bg-rd-raised"
              >
                <td className={`${td} tabular-nums text-rd-muted`}>{user.id}</td>
                <td className={`${td} font-medium text-rd-title`}>{user.username}</td>
                <td className={td}>{user.role}</td>
                <td className={`${td} tabular-nums`}>{user.created_at}</td>
                <td className={td}>
                  <StatusPill archived={Boolean(user.archivestatus)} />
                </td>
                <td className={`${td} text-right`}>
                  <button
                    type="button"
                    aria-label={`Edit ${user.username}`}
                    className="rd-press rd-focus group/edit inline-flex min-h-[36px] cursor-pointer items-center gap-2 rounded-lg border border-rd-hair-strong bg-rd-sunken px-3.5 text-sm font-medium text-rd-label hover:border-rd-cyan/50 hover:bg-rd-cyan/10 hover:text-rd-cyan hover:shadow-[0_0_18px_-6px_rgba(34,211,238,0.5)]"
                    onClick={() => router.push(`/dashboard/admin/editUsers?id=${user.id}`)}
                  >
                    <PencilIcon />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && users.length === 0 && (
        <p className="px-4 py-10 text-center text-sm text-rd-muted">No users found.</p>
      )}
      {loading && (
        <p className="px-4 py-10 text-center text-sm text-rd-muted">Loading users…</p>
      )}
    </section>
  );
}
