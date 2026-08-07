"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const th =
    "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-rd-muted";

const td =
    "px-4 py-3 text-sm text-rd-label";


function StatusPill({ archived }) {

    return (

        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                archived
                    ? "border-rd-hair-strong bg-rd-raised text-rd-muted"
                    : "border-rd-ok-edge bg-rd-ok-bg text-rd-ok"
            }`}
        >

            <span
                aria-hidden="true"
                className={`size-1.5 rounded-full ${
                    archived ? "bg-rd-muted" : "bg-rd-cyan"
                }`}
            />

            {archived ? "Archived" : "Active"}

        </span>

    );

}


function PencilIcon() {

    return (

        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-4"
        >

            <path d="M12 20h9" />

            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />

        </svg>

    );

}


export default function DisplayUsers() {

    const router = useRouter();

    const [users, setUsers] = useState([]);

    const [sortBy, setSortBy] = useState("");

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [showFilters, setShowFilters] = useState(false);

    const [roleFilter, setRoleFilter] = useState("");

    const [statusFilter, setStatusFilter] = useState("");

    const [sortDate, setSortDate] = useState("");


    useEffect(() => {

        let cancelled = false;

        (async () => {

            try {

                const response = await fetch("/api/users/display");

                const data = await response.json();

                if (cancelled) return;

                setUsers(
                    Array.isArray(data)
                        ? data
                        : (data?.rows ?? [])
                );

            } catch (error) {

                console.error(error);

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        })();

        return () => {
            cancelled = true;
        };

    }, []);


    const roles = useMemo(() => {

        return [
            ...new Set(
                users
                    .map(user => user.role)
                    .filter(Boolean)
            )
        ];

    }, [users]);




    const filteredUsers = useMemo(() => {

        const searchValue = search.trim().toLowerCase();

        const filtered = users.filter(user => {

            const matchesSearch =
                !searchValue ||
                String(user.id).toLowerCase().includes(searchValue) ||
                String(user.username ?? "").toLowerCase().includes(searchValue) ||
                String(user.role ?? "").toLowerCase().includes(searchValue);

            const matchesRole =
                !roleFilter ||
                user.role === roleFilter;

            const isArchived =
                Boolean(user.archivestatus);

            const matchesStatus =
                !statusFilter ||
                (statusFilter === "active" && !isArchived) ||
                (statusFilter === "archived" && isArchived);

            return (
                matchesSearch &&
                matchesRole &&
                matchesStatus
            );

        });

        if (sortDate === "newest") {

            filtered.sort(
                (a, b) =>
                    new Date(b.created_at) - new Date(a.created_at)
            );

        }

        if (sortDate === "oldest") {

            filtered.sort(
                (a, b) =>
                    new Date(a.created_at) - new Date(b.created_at)
            );

        }

        if (sortBy === "username-asc") {

            filtered.sort((a, b) =>
                String(a.username ?? "").localeCompare(
                    String(b.username ?? "")
                )
            );

        }

        if (sortBy === "username-desc") {

            filtered.sort((a, b) =>
                String(b.username ?? "").localeCompare(
                    String(a.username ?? "")
                )
            );

        }

        return filtered;

    }, [
        users,
        search,
        roleFilter,
        statusFilter,
        sortDate,
        sortBy
    ]);
    function clearFilters() {

        setSearch("");
        setRoleFilter("");
        setStatusFilter("");
        setSortDate("");
        setSortBy("");

    }


    const filtersActive =
        roleFilter !== "" ||
        statusFilter !== "";


    return (

        <section className="space-y-4">

            {/* SEARCH + FILTER BAR */}

            <div className="flex flex-col gap-3 sm:flex-row">

                {/* SEARCH */}

                <div className="relative flex-1">

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users..."
                        className="w-full rounded-xl border border-rd-hair-strong bg-rd-sunken px-4 py-3 pl-10 text-sm text-rd-title outline-none placeholder:text-rd-muted focus:border-rd-cyan/50 focus:ring-1 focus:ring-rd-cyan/30"
                    />

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-rd-muted"
                    >

                        <circle
                            cx="11"
                            cy="11"
                            r="8"
                        />

                        <path d="m21 21-4.3-4.3" />

                    </svg>

                </div>


                {/* FILTER BUTTON */}

                <button
                    type="button"
                    onClick={() => setShowFilters(prev => !prev)}
                    className={`rd-press rd-focus inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-2 rounded-xl border px-5 text-sm font-medium transition-colors ${
                        showFilters || filtersActive
                            ? "border-rd-cyan/50 bg-rd-cyan/10 text-rd-cyan"
                            : "border-rd-hair-strong bg-rd-sunken text-rd-label hover:border-rd-cyan/50 hover:bg-rd-cyan/10 hover:text-rd-cyan"
                    }`}
                >

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="size-4"
                    >

                        <path d="M4 6h16" />
                        <path d="M7 12h10" />
                        <path d="M10 18h4" />

                    </svg>

                    Filters

                    {filtersActive && (
                        <span className="flex size-5 items-center justify-center rounded-full bg-rd-cyan text-xs font-bold text-slate-950">
                            !
                        </span>
                    )}

                </button>

            </div>


            {/* FILTER PANEL */}

            {showFilters && (

                <div className="rounded-xl border border-rd-hair-strong bg-rd-raised p-5">

                    <div className="grid gap-4 sm:grid-cols-2">

                        {/* ROLE */}

                        <div>

                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-rd-muted">
                                Role
                            </label>

                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full rounded-lg border border-rd-hair-strong bg-rd-sunken px-3 py-2.5 text-sm text-rd-label outline-none focus:border-rd-cyan/50"
                            >

                                <option value="">
                                    All Roles
                                </option>

                                {roles.map(role => (

                                    <option
                                        key={role}
                                        value={role}
                                    >
                                        {role}
                                    </option>

                                ))}

                            </select>

                        </div>
                        {/* STATUS */}
                        <div>

                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-rd-muted">
                                Status
                            </label>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full rounded-lg border border-rd-hair-strong bg-rd-sunken px-3 py-2.5 text-sm text-rd-label outline-none focus:border-rd-cyan/50"
                            >

                                <option value="">
                                    All Statuses
                                </option>

                                <option value="active">
                                    Active
                                </option>

                                <option value="archived">
                                    Archived
                                </option>

                            </select>

                        </div>

                        <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-rd-muted">
                        Sort by Date
                    </label>

                    <select
                        value={sortDate}
                        onChange={(e) => setSortDate(e.target.value)}
                        className="w-full rounded-lg border border-rd-hair-strong bg-rd-sunken px-3 py-2.5 text-sm text-rd-label outline-none focus:border-rd-cyan/50"
                    >

                        <option value="">
                            Default
                        </option>

                        <option value="newest">
                            Newest First
                        </option>

                        <option value="oldest">
                            Oldest First
                        </option>

                    </select>

                </div>

                <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-rd-muted">
                        Sort by Username
                    </label>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full rounded-lg border border-rd-hair-strong bg-rd-sunken px-3 py-2.5 text-sm text-rd-label outline-none focus:border-rd-cyan/50"
                    >

                        <option value="">
                            Default
                        </option>

                        <option value="username-asc">
                            A → Z
                        </option>

                        <option value="username-desc">
                            Z → A
                        </option>

                    </select>

                </div>
                    </div>
                    
                    

                    {/* CLEAR */}

                    {filtersActive && (

                        <div className="mt-4 flex justify-end">

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-sm text-rd-muted hover:text-rd-cyan"
                            >
                                Clear filters
                            </button>

                        </div>

                    )}

                </div>

            )}


            {/* RESULT COUNT */}

            <div className="text-sm text-rd-muted">

                Showing{" "}
                <span className="font-medium text-rd-label">
                    {filteredUsers.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-rd-label">
                    {users.length}
                </span>{" "}
                users

            </div>


            {/* TABLE */}

            <div className="overflow-x-auto rounded-xl border border-rd-hair">

                <table className="w-full min-w-[700px]">

                    <thead>

                        <tr className="border-b border-rd-hair">

                            <th className={th}>
                                ID
                            </th>

                            <th className={th}>
                                Username
                            </th>

                            <th className={th}>
                                Role
                            </th>

                            <th className={th}>
                                Created
                            </th>

                            <th className={th}>
                                Status
                            </th>

                            <th className={`${th} text-right`}>
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {filteredUsers.map((user) => (

                            <tr
                                key={user.id}
                                className="border-b border-rd-hair transition-colors last:border-0 hover:bg-rd-raised"
                            >

                                <td className={`${td} tabular-nums text-rd-muted`}>
                                    {user.id}
                                </td>

                                <td className={`${td} font-medium text-rd-title`}>
                                    {user.username}
                                </td>

                                <td className={td}>
                                    {user.role}
                                </td>

                                <td className={`${td} tabular-nums`}>
                                    {user.created_at}
                                </td>

                                <td className={td}>
                                    <StatusPill
                                        archived={Boolean(user.archivestatus)}
                                    />
                                </td>

                                <td className={`${td} text-right`}>

                                    <button
                                        type="button"
                                        aria-label={`Edit ${user.username}`}
                                        className="rd-press rd-focus group/edit inline-flex min-h-[36px] cursor-pointer items-center gap-2 rounded-lg border border-rd-hair-strong bg-rd-sunken px-3.5 text-sm font-medium text-rd-label hover:border-rd-cyan/50 hover:bg-rd-cyan/10 hover:text-rd-cyan hover:shadow-[0_0_18px_-6px_rgba(34,211,238,0.5)]"
                                        onClick={() =>
                                            router.push(
                                                `/dashboard/admin/editUsers?id=${user.id}`
                                            )
                                        }
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


            {/* EMPTY */}

            {!loading && filteredUsers.length === 0 && (

                <p className="px-4 py-10 text-center text-sm text-rd-muted">
                    No users found.
                </p>

            )}


            {/* LOADING */}

            {loading && (

                <p className="px-4 py-10 text-center text-sm text-rd-muted">
                    Loading users…
                </p>

            )}

        </section>

    );

}