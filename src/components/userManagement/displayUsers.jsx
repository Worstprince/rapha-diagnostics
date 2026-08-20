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

        <Badge tone={archived ? "neutral" : "emerald"}>
            {archived ? "Archived" : "Active"}
        </Badge>

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

    const [page, setPage] = useState(1);

    const [limit] = useState(10);

    const [total, setTotal] = useState(0);

    const [totalPages, setTotalPages] = useState(0);


    const roles = [
        "Administrator",
        "Receptionist",
        "Medical Technologist",
        "Pathologist",
    ];


    useEffect(() => {

        let cancelled = false;

        async function fetchUsers() {

            setLoading(true);

            try {

                const params = new URLSearchParams();

                params.set("page", page);
                params.set("limit", limit);

                if (search.trim()) {
                    params.set(
                        "search",
                        search.trim()
                    );
                }

                if (roleFilter) {
                    params.set(
                        "role",
                        roleFilter
                    );
                }

                if (statusFilter) {
                    params.set(
                        "status",
                        statusFilter
                    );
                }

                if (sort) {
                    params.set(
                        "sort",
                        sort
                    );
                }

                const response = await fetch(
                    `/api/users/display?${params.toString()}`
                );

                const data = await response.json();

                if (cancelled) return;

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to fetch users."
                    );
                }

                setUsers(data.rows ?? []);

                setTotal(
                    Number(data.total) || 0
                );

                setTotalPages(
                    Number(data.totalPages) || 0
                );

            } catch (error) {

                console.error(error);

                if (!cancelled) {

                    setUsers([]);
                    setTotal(0);
                    setTotalPages(0);

                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        }

        fetchUsers();

        return () => {
            cancelled = true;
        };

    }, [
        page,
        limit,
        search,
        roleFilter,
        statusFilter,
        sort
    ]);


    function handleSearchChange(e) {

        setSearch(e.target.value);
        setPage(1);

    }


    function handleRoleChange(e) {

        setRoleFilter(e.target.value);
        setPage(1);

    }


    function handleStatusChange(e) {

        setStatusFilter(e.target.value);
        setPage(1);

    }


    function handleSortChange(e) {

        setSort(e.target.value);
        setPage(1);

    }


    function clearFilters() {

        setRoleFilter("");
        setStatusFilter("");
        setSort("");
        setPage(1);

    }


    function goToPage(newPage) {

        if (
            newPage < 1 ||
            newPage > totalPages ||
            newPage === page
        ) {
            return;
        }

        setPage(newPage);

    }


    const activeCount = [
        roleFilter,
        statusFilter,
        sort
    ].filter(Boolean).length;


    const pageStart =
        total === 0
            ? 0
            : (page - 1) * limit + 1;


    const pageEnd =
        Math.min(
            page * limit,
            total
        );


    const paginationPages = useMemo(() => {

        if (totalPages <= 1) {
            return [];
        }

        const pages = [];

        const start = Math.max(
            1,
            page - 2
        );

        const end = Math.min(
            totalPages,
            page + 2
        );

        for (
            let i = start;
            i <= end;
            i++
        ) {

            pages.push(i);

        }

        return pages;

    }, [
        page,
        totalPages
    ]);


    return (

        <section className="flex min-h-0 flex-1 flex-col gap-5">


            <div className="rd-panel flex-none overflow-hidden">


                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">


                    <SearchField
                        label="Search users"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search by name, role, or ID…"
                    />


                    <div className="flex items-center justify-between gap-3">

                        {!loading && (

                            <ResultCount
                                shown={users.length}
                                total={total}
                                noun="users"
                            />

                        )}


                        <FilterToggle
                            open={showFilters}
                            count={activeCount}
                            controls="user-filters"
                            onClick={() =>
                                setShowFilters(
                                    prev => !prev
                                )
                            }
                        />

                    </div>


                </div>


                {showFilters && (

                    <div
                        id="user-filters"
                        className="border-t border-rd-hair p-4"
                    >

                        <div className="grid gap-3 sm:grid-cols-3">


                            <FilterField
                                label="Role"
                                value={roleFilter}
                                onChange={handleRoleChange}
                            >

                                <option value="">
                                    All roles
                                </option>

                                {roles.map(role => (

                                    <option
                                        key={role}
                                        value={role}
                                    >
                                        {roleLabel(role)}
                                    </option>

                                ))}

                            </FilterField>


                            <FilterField
                                label="Status"
                                value={statusFilter}
                                onChange={handleStatusChange}
                            >

                                <option value="">
                                    All statuses
                                </option>

                                <option value="active">
                                    Active
                                </option>

                                <option value="archived">
                                    Archived
                                </option>

                            </FilterField>


                            <FilterField
                                label="Sort by"
                                value={sort}
                                onChange={handleSortChange}
                            >

                                <option value="">
                                    Default order
                                </option>

                                <option value="newest">
                                    Newest first
                                </option>

                                <option value="oldest">
                                    Oldest first
                                </option>

                                <option value="username-asc">
                                    Username A → Z
                                </option>

                                <option value="username-desc">
                                    Username Z → A
                                </option>

                            </FilterField>


                        </div>


                        <ClearFilters
                            count={activeCount}
                            onClear={clearFilters}
                        />


                    </div>

                )}

            </div>


            <div className="rd-panel flex min-h-0 flex-1 flex-col overflow-hidden max-lg:max-h-[70vh]">


                {loading && <RowSkeleton />}


                {!loading && users.length === 0 && (

                    <StateMessage
                        title="No users found"
                        hint={
                            search ||
                            activeCount > 0
                                ? "Nothing matches the current search and filters."
                                : "Accounts you add will be listed here."
                        }
                    />

                )}


                {!loading && users.length > 0 && (

                    <>


                        <div className="rd-scroll-thin min-h-0 flex-1 overflow-auto">


                            <table className="w-full min-w-[900px] border-collapse">


                                <thead>

                                    <tr className="border-b border-rd-hair">

                                        <th className={th}>
                                            ID
                                        </th>

                                        <th className={th}>
                                            Name
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

                                    {users.map(user => (

                                        <tr
                                            key={user.id}
                                            className="border-b border-rd-hair transition-colors last:border-0 hover:bg-rd-raised"
                                        >


                                            <td
                                                className={`${td} tabular-nums text-rd-muted`}
                                            >
                                                {user.id}
                                            </td>


                                            <td
                                                className={`${td} font-medium text-rd-title`}
                                            >

                                                {user.fname}

                                                {user.mname && (
                                                    ` ${user.mname}`
                                                )}

                                                {user.lname && (
                                                    ` ${user.lname}`
                                                )}

                                            </td>


                                            <td
                                                className={`${td} text-rd-label`}
                                            >
                                                {user.username}
                                            </td>


                                            <td className={td}>

                                                <Badge
                                                    tone={roleTone(user.role)}
                                                >
                                                    {roleLabel(user.role)}
                                                </Badge>

                                            </td>


                                            <td
                                                className={`${td} tabular-nums`}
                                            >
                                                {user.created_at}
                                            </td>


                                            <td className={td}>

                                                <StatusPill
                                                    archived={
                                                        Boolean(
                                                            user.archivestatus
                                                        )
                                                    }
                                                />

                                            </td>


                                            <td
                                                className={`${td} text-right`}
                                            >

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


                        <div className="flex flex-col gap-3 border-t border-rd-hair p-4 sm:flex-row sm:items-center sm:justify-between">


                            <p className="text-sm text-rd-muted">

                                Showing{" "}

                                <span className="font-medium text-rd-title">
                                    {pageStart}
                                </span>

                                {" "}–{" "}

                                <span className="font-medium text-rd-title">
                                    {pageEnd}
                                </span>

                                {" "}of{" "}

                                <span className="font-medium text-rd-title">
                                    {total}
                                </span>

                                {" "}users

                            </p>


                            <div className="flex items-center gap-2">


                                <button
                                    type="button"
                                    disabled={page === 1}
                                    onClick={() =>
                                        goToPage(page - 1)
                                    }
                                    className="rd-btn-ghost rd-press rd-focus disabled:pointer-events-none disabled:opacity-40"
                                >
                                    Previous
                                </button>
                                {/* The active chip was bg-rd-title with text-rd-bg. --rd-title is a
                                    text colour (#fff dark, near-black light), so using it as a
                                    background flipped it to a stark white block on the dark theme.
                                    And rd-bg is not a token at all, so the number fell back to the
                                    page text colour and came out invisible against it in both
                                    themes. The accent pair is built for exactly this: --rd-on-cyan
                                    is the text colour that goes on --rd-cyan. */}
                                {paginationPages.map(pageNumber => (
                                    <button
                                        key={pageNumber}
                                        type="button"
                                        aria-current={pageNumber === page ? "page" : undefined}
                                        onClick={() =>
                                            goToPage(
                                                pageNumber
                                            )
                                        }
                                        className={`rd-press rd-focus inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border px-3 text-sm transition-colors ${
                                            pageNumber === page
                                                ? "cursor-default border-transparent bg-rd-cyan font-semibold text-rd-on-cyan"
                                                : "border-transparent text-rd-muted hover:border-rd-hair-strong hover:bg-rd-raised hover:text-rd-title"
                                        }`}
                                    >

                                        {pageNumber}

                                    </button>

                                ))}


                                <button
                                    type="button"
                                    disabled={
                                        page === totalPages
                                    }
                                    onClick={() =>
                                        goToPage(page + 1)
                                    }
                                    className="rd-btn-ghost rd-press rd-focus disabled:pointer-events-none disabled:opacity-40"
                                >
                                    Next
                                </button>


                            </div>


                        </div>


                    </>

                )}

            </div>


        </section>

    );

}