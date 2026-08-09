"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
    Badge,
    ClearFilters,
    FilterField,
    FilterToggle,
    PencilIcon,
    ResultCount,
    RowSkeleton,
    SearchField,
    StateMessage,
    roleLabel,
    roleTone,
    rowAction,
    td,
    th,
} from "@/app/dashboard/admin/_ui";


function StatusPill({ archived }) {

    return (

        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                archived
                    ? "border-rd-hair-strong bg-rd-raised text-rd-label"
                    : "border-emerald-500/40 bg-emerald-500/12 text-rd-title"
            }`}
        >

            <span
                aria-hidden="true"
                className={`size-1.5 rounded-full ${
                    archived ? "bg-rd-muted" : "bg-emerald-500"
                }`}
            />

            {archived ? "Archived" : "Active"}

        </span>

    );

}


export default function DisplayUsers() {

    const router = useRouter();

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [showFilters, setShowFilters] = useState(false);

    const [roleFilter, setRoleFilter] = useState("");

    const [statusFilter, setStatusFilter] = useState("");

    const [sort, setSort] = useState("");


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
                String(user.role ?? "").toLowerCase().includes(searchValue) ||
                roleLabel(user.role).toLowerCase().includes(searchValue);

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

        if (sort === "newest") {

            filtered.sort(
                (a, b) =>
                    new Date(b.created_at) - new Date(a.created_at)
            );

        } else if (sort === "oldest") {

            filtered.sort(
                (a, b) =>
                    new Date(a.created_at) - new Date(b.created_at)
            );

        } else if (sort === "username-asc") {

            filtered.sort((a, b) =>
                String(a.username ?? "").localeCompare(
                    String(b.username ?? "")
                )
            );

        } else if (sort === "username-desc") {

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
        sort
    ]);


    function clearFilters() {

        setRoleFilter("");
        setStatusFilter("");
        setSort("");

    }


    const activeCount = [
        roleFilter,
        statusFilter,
        sort
    ].filter(Boolean).length;


    return (

        <section className="flex min-h-0 flex-1 flex-col gap-5">

            <div className="rd-panel flex-none overflow-hidden">

                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">

                    <SearchField
                        label="Search users"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, role, or ID…"
                    />

                    <div className="flex items-center justify-between gap-3">

                        {!loading && (
                            <ResultCount
                                shown={filteredUsers.length}
                                total={users.length}
                                noun="users"
                            />
                        )}

                        <FilterToggle
                            open={showFilters}
                            count={activeCount}
                            controls="user-filters"
                            onClick={() => setShowFilters(prev => !prev)}
                        />

                    </div>

                </div>

                {showFilters && (

                    <div id="user-filters" className="border-t border-rd-hair p-4">

                        <div className="grid gap-3 sm:grid-cols-3">

                            <FilterField
                                label="Role"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="">All roles</option>
                                {roles.map(role => (
                                    <option key={role} value={role}>
                                        {roleLabel(role)}
                                    </option>
                                ))}
                            </FilterField>

                            <FilterField
                                label="Status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All statuses</option>
                                <option value="active">Active</option>
                                <option value="archived">Archived</option>
                            </FilterField>

                            <FilterField
                                label="Sort by"
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <option value="">Default order</option>
                                <option value="newest">Newest first</option>
                                <option value="oldest">Oldest first</option>
                                <option value="username-asc">Username A → Z</option>
                                <option value="username-desc">Username Z → A</option>
                            </FilterField>

                        </div>

                        <ClearFilters count={activeCount} onClear={clearFilters} />

                    </div>

                )}

            </div>


            <div className="rd-panel flex min-h-0 flex-1 flex-col overflow-hidden max-lg:max-h-[70vh]">

                {loading && <RowSkeleton />}

                {!loading && filteredUsers.length === 0 && (
                    <StateMessage
                        title="No users found"
                        hint={
                            search || activeCount > 0
                                ? "Nothing matches the current search and filters."
                                : "Accounts you add will be listed here."
                        }
                    />
                )}

                {!loading && filteredUsers.length > 0 && (

                    <div className="rd-scroll-thin min-h-0 flex-1 overflow-auto">

                        <table className="w-full min-w-[720px] border-collapse">

                            <thead>

                                <tr className="border-b border-rd-hair">

                                    <th className={th}>ID</th>

                                    <th className={th}>Username</th>

                                    <th className={th}>Role</th>

                                    <th className={th}>Created</th>

                                    <th className={th}>Status</th>

                                    <th className={`${th} text-right`}>Actions</th>

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
                                            <Badge tone={roleTone(user.role)}>
                                                {roleLabel(user.role)}
                                            </Badge>
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
                                                className={rowAction}
                                                onClick={() =>
                                                    router.push(
                                                        `/dashboard/admin/editUsers?id=${user.id}`
                                                    )
                                                }
                                            >

                                                <PencilIcon size={16} />

                                                Edit

                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </section>

    );

}
