"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import ConfirmDialog from "@/components/ConfirmDialog";
import { useCurrentUser } from "@/lib/session";
import { formatDate, formatFull, formatTime } from "@/lib/datetime";

import Toast from "../../_toast";
import {
    ArchiveIcon,
    Avatar,
    BackLink,
    Badge,
    HeaderGlow,
    RestoreIcon,
    STAFF_ROLES,
    Spinner,
    StateMessage,
    WarningIcon,
    roleLabel,
    roleTone,
    toneDot,
} from "../../_ui";
import {
    EMAIL,
    Field,
    MIN_USERNAME,
    PASSWORD_RULES,
    PasswordField,
    Requirement,
    SectionHeader,
    field,
    firstPasswordProblem,
    passwordChecks,
} from "../../_form";


const BLANK = {
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    role: "",
    archivestatus: false,
};


function fullName(record) {

    if (!record) return "";

    return [record.fname, record.mname, record.lname]
        .filter(part => part && String(part).trim() && String(part).trim() !== "Null")
        .join(" ");

}


function diff(current, baseline) {

    if (!baseline) return [];

    const out = [];

    if (current.username !== baseline.username) {
        out.push({
            key: "username",
            label: "Username",
            from: baseline.username,
            to: current.username
        });
    }

    if (current.email !== baseline.email) {
        out.push({
            key: "email",
            label: "Email",
            from: baseline.email,
            to: current.email
        });
    }

    if (current.role !== baseline.role) {
        out.push({
            key: "role",
            label: "Role",
            from: roleLabel(baseline.role),
            to: roleLabel(current.role)
        });
    }

    if (current.archivestatus !== baseline.archivestatus) {
        out.push({
            key: "archivestatus",
            label: "Status",
            from: baseline.archivestatus ? "Archived" : "Active",
            to: current.archivestatus ? "Archived" : "Active"
        });
    }

    if (current.password) {
        out.push({
            key: "password",
            label: "Password",
            from: "Current password",
            to: "Replaced on save"
        });
    }

    return out;

}


function ChangeRow({ label, from, to }) {

    return (

        <li className="py-2.5">

            <p className="text-xs font-semibold uppercase tracking-wider text-rd-muted">
                {label}
            </p>

            <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm">

                <span className="min-w-0 truncate text-rd-muted line-through decoration-rd-muted/50">
                    {from || "Not set"}
                </span>

                <span aria-hidden="true" className="text-rd-muted">
                    →
                </span>

                <span className="min-w-0 truncate font-medium text-rd-title">
                    {to || "Not set"}
                </span>

            </div>

        </li>

    );

}


function RoleOption({ role, checked, onSelect, disabled }) {

    const tone = roleTone(role);

    return (

        <label
            className={`rd-press relative flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                checked
                    ? "border-rd-cyan/50 bg-rd-cyan/10 text-rd-title"
                    : "border-rd-hair-strong bg-rd-sunken text-rd-label hover:border-rd-hair-strong hover:bg-rd-raised hover:text-rd-title"
            } ${disabled ? "pointer-events-none opacity-60" : ""}`}
        >

            <input
                type="radio"
                name="role"
                value={role}
                checked={checked}
                onChange={() => onSelect(role)}
                disabled={disabled}
                className="sr-only"
            />

            <span
                aria-hidden="true"
                className={`size-2 flex-none rounded-full ${toneDot[tone] ?? toneDot.neutral}`}
            />

            <span className="min-w-0 truncate font-medium">
                {roleLabel(role)}
            </span>

        </label>

    );

}


export default function EditUserPage() {

    const params = useParams();
    const router = useRouter();
    const currentUser = useCurrentUser();

    const userId = String(params.id ?? "");

    const [record, setRecord] = useState(null);
    const [baseline, setBaseline] = useState(null);
    const [user, setUser] = useState(BLANK);

    const [loaded, setLoaded] = useState(null);

    const loading = !loaded || loaded.id !== userId;
    const loadError = loaded && loaded.id === userId ? loaded.error : null;

    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [saveOpen, setSaveOpen] = useState(false);
    const [archiveOpen, setArchiveOpen] = useState(false);
    const [discardTo, setDiscardTo] = useState(null);

    const [people, setPeople] = useState([]);


    useEffect(() => {

        if (!userId) return undefined;

        let cancelled = false;

        async function run() {

            if (currentUser?.id && String(userId) === String(currentUser.id)) {
                setLoaded({
                    id: userId,
                    error: "You can't edit or archive your own account from here."
                });
                return;
            }

            try {

                const response = await fetch(`/api/users/${userId}`);
                const result = await response.json();

                if (cancelled) return;

                if (!response.ok) {
                    setLoaded({
                        id: userId,
                        error: result.message || "Could not load that user."
                    });
                    return;
                }

                const next = {
                    username: result.data.username ?? "",
                    password: "",
                    confirmPassword: "",
                    email: result.data.email ?? "",
                    role: result.data.role ?? "",
                    archivestatus: Boolean(result.data.archivestatus),
                };

                setRecord(result.data);
                setUser(next);

                setBaseline(next);
                setErrors({});
                setLoaded({ id: userId, error: null });

            } catch {

                if (!cancelled) {
                    setLoaded({
                        id: userId,
                        error: "Unable to reach the server. Please try again."
                    });
                }

            }

        }

        run();

        return () => {
            cancelled = true;
        };

    }, [userId, currentUser?.id]);


    useEffect(() => {

        let cancelled = false;

        async function fetchPeople() {

            try {

                const response = await fetch("/api/users/display?limit=200");
                const data = await response.json();

                if (cancelled) return;

                const list = Array.isArray(data) ? data : (data?.rows ?? []);

                setPeople(
                    currentUser?.id
                        ? list.filter(entry => String(entry.id) !== String(currentUser.id))
                        : list
                );

            } catch {

                if (!cancelled) setPeople([]);

            }

        }

        fetchPeople();

        return () => {
            cancelled = true;
        };

    }, [currentUser?.id]);


    function handleChange(e) {

        const { name, value } = e.target;

        setUser(prev => ({ ...prev, [name]: value }));

        setErrors(prev => {

            if (!prev[name]) return prev;

            const next = { ...prev };
            delete next[name];

            return next;

        });

    }


    function chooseRole(role) {

        setUser(prev => ({ ...prev, role }));

        setErrors(prev => {

            if (!prev.role) return prev;

            const next = { ...prev };
            delete next.role;

            return next;

        });

    }


    function validate() {

        const found = {};

        if (!user.username.trim()) {
            found.username = "Username is required.";
        } else if (user.username.trim().length < MIN_USERNAME) {
            found.username = `Username must be at least ${MIN_USERNAME} characters.`;
        }

        if (!user.email.trim()) {
            found.email = "Email is required.";
        } else if (!EMAIL.test(user.email)) {
            found.email = "Enter a valid email address.";
        }

        if (!user.role) {
            found.role = "Please select a role.";
        }

        if (user.password) {

            const problem = firstPasswordProblem(user.password);

            if (problem) {
                found.password = problem;
            }

            if (!user.confirmPassword) {
                found.confirmPassword = "Please confirm the new password.";
            } else if (user.password !== user.confirmPassword) {
                found.confirmPassword = "Passwords do not match.";
            }

        }

        setErrors(found);

        return Object.keys(found).length === 0;

    }


    function handleSubmit(e) {

        e.preventDefault();

        if (submitting) return;

        setStatus(null);

        if (!validate()) return;

        setSaveOpen(true);

    }


    async function saveChanges() {

        setSaveOpen(false);
        setSubmitting(true);

        try {

            const { confirmPassword, ...userData } = user;

            const response = await fetch(`/api/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...userData, userId: currentUser?.id }),
            });

            const result = await response.json();

            setStatus({
                tone: response.ok ? "success" : "error",
                text:
                    result.message ||
                    (response.ok ? "Changes saved." : "Could not save changes."),
            });

            if (response.ok) {

                const saved = { ...user, password: "", confirmPassword: "" };

                setUser(saved);
                setBaseline(saved);
                setRecord(prev => (prev ? { ...prev, ...saved } : prev));

            }

        } catch {

            setStatus({
                tone: "error",
                text: "Unable to reach the server. Please try again.",
            });

        } finally {

            setSubmitting(false);

        }

    }


    const changes = useMemo(() => diff(user, baseline), [user, baseline]);
    const dirty = changes.length > 0;

    const checks = passwordChecks(user.password);

    const name = fullName(record);
    const displayName = name || user.username || "this account";


    function goTo(href) {

        if (dirty) {
            setDiscardTo(href);
            return;
        }

        router.push(href);

    }


    if (loading) {

        return (
            <div className="mx-auto max-w-6xl">
                <section className="rd-panel p-6">
                    <p className="flex items-center justify-center gap-2 py-16 text-sm text-rd-muted">
                        <Spinner />
                        Loading account…
                    </p>
                </section>
            </div>
        );

    }


    if (loadError) {

        return (
            <div className="mx-auto max-w-6xl space-y-5">

                <section className="rd-panel p-6">

                    <StateMessage
                        title="Could not open that account"
                        hint={loadError}
                        Icon={WarningIcon}
                    />

                    <div className="flex justify-center">
                        <Link
                            href="/dashboard/admin/viewUsers"
                            className="rd-btn-ghost rd-press rd-focus min-h-11 py-0"
                        >
                            Back to all users
                        </Link>
                    </div>

                </section>

            </div>
        );

    }


    return (

        <>

            <div className="mx-auto max-w-6xl space-y-5">

                <header className="rd-panel relative flex-none overflow-hidden p-6">

                    <HeaderGlow />

                    <div className="relative">

                        <BackLink
                            href="/dashboard/admin/viewUsers"
                            onNavigate={goTo}
                        />


                        <div className="mt-4 flex flex-wrap items-center gap-4">

                            <Avatar
                                name={name || user.username}
                                className="size-14 text-lg"
                            />

                            <div className="min-w-0">

                                <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">
                                    Edit user
                                </p>

                                <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-rd-title">
                                    {displayName}
                                </h1>

                                <p className="mt-0.5 truncate text-sm text-rd-muted">
                                    @{baseline?.username}
                                    <span aria-hidden="true"> · </span>
                                    ID {userId}
                                </p>

                            </div>


                            <div className="ml-auto flex flex-wrap items-center gap-3">

                                <Badge tone={user.archivestatus ? "neutral" : "emerald"}>
                                    {user.archivestatus ? "Archived" : "Active"}
                                </Badge>

                                {people.length > 0 && (

                                    <label className="flex items-center gap-2">

                                        <span className="sr-only">
                                            Switch to another account
                                        </span>

                                        <select
                                            value={userId}
                                            onChange={(e) =>
                                                goTo(`/dashboard/admin/editUsers/${e.target.value}`)
                                            }
                                            className="rd-input min-w-[11rem] py-2.5 text-sm"
                                        >
                                            {people.map(entry => (
                                                <option
                                                    key={entry.id}
                                                    value={entry.id}
                                                >
                                                    {entry.username}
                                                </option>
                                            ))}
                                        </select>

                                    </label>

                                )}

                            </div>

                        </div>

                    </div>

                </header>


                <form onSubmit={handleSubmit} noValidate>

                    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start">

                        <div className="space-y-5">

                            <section className="rd-panel">

                                <SectionHeader
                                    title="Account"
                                    description="How this person signs in and where system mail reaches them."
                                />

                                <div className="grid gap-4 p-4 sm:grid-cols-2">

                                    <Field
                                        id="editUsername"
                                        label="Username"
                                        required
                                        error={errors.username}
                                    >
                                        <input
                                            id="editUsername"
                                            name="username"
                                            autoComplete="off"
                                            value={user.username}
                                            onChange={handleChange}
                                            aria-invalid={errors.username ? true : undefined}
                                            aria-describedby={
                                                errors.username ? "editUsername-error" : undefined
                                            }
                                            className={field(errors.username)}
                                        />
                                    </Field>

                                    <Field
                                        id="editEmail"
                                        label="Email"
                                        required
                                        error={errors.email}
                                    >
                                        <input
                                            id="editEmail"
                                            type="email"
                                            name="email"
                                            autoComplete="off"
                                            value={user.email}
                                            onChange={handleChange}
                                            aria-invalid={errors.email ? true : undefined}
                                            aria-describedby={
                                                errors.email ? "editEmail-error" : undefined
                                            }
                                            className={field(errors.email)}
                                        />
                                    </Field>

                                </div>

                            </section>


                            <section className="rd-panel">

                                <SectionHeader
                                    title="Role"
                                    description="Decides which dashboard they land on and what they can reach."
                                />

                                <div className="p-4">

                                    <fieldset>

                                        <legend className="sr-only">Role</legend>

                                        <div className="grid gap-2.5 sm:grid-cols-2">

                                            {STAFF_ROLES.map(role => (
                                                <RoleOption
                                                    key={role}
                                                    role={role}
                                                    checked={user.role === role}
                                                    onSelect={chooseRole}
                                                />
                                            ))}

                                        </div>

                                    </fieldset>

                                    {errors.role && (
                                        <p role="alert" className="mt-2 text-sm text-rd-danger">
                                            {errors.role}
                                        </p>
                                    )}

                                </div>

                            </section>


                            <section className="rd-panel">

                                <SectionHeader
                                    title="Password"
                                    description="Leave both boxes empty and the current password is kept."
                                />

                                <div className="grid gap-4 p-4 sm:grid-cols-2">

                                    <Field
                                        id="editPassword"
                                        label="New password"
                                        error={errors.password}
                                    >
                                        <PasswordField
                                            id="editPassword"
                                            name="password"
                                            value={user.password}
                                            onChange={handleChange}
                                            placeholder="Leave blank to keep current"
                                            error={errors.password}
                                            shown={showPassword}
                                            onToggle={() => setShowPassword(prev => !prev)}
                                        />
                                    </Field>

                                    <Field
                                        id="editConfirmPassword"
                                        label="Confirm new password"
                                        error={errors.confirmPassword}
                                    >
                                        <PasswordField
                                            id="editConfirmPassword"
                                            name="confirmPassword"
                                            value={user.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Re-enter the new password"
                                            error={errors.confirmPassword}
                                            shown={showConfirm}
                                            onToggle={() => setShowConfirm(prev => !prev)}
                                        />
                                    </Field>

                                    {user.password && (

                                        <ul className="grid gap-1.5 sm:col-span-2 sm:grid-cols-2">

                                            {PASSWORD_RULES.map(rule => (
                                                <Requirement
                                                    key={rule.key}
                                                    met={checks[rule.key]}
                                                    label={rule.label}
                                                />
                                            ))}

                                        </ul>

                                    )}

                                </div>

                            </section>


                            <section className="rd-panel">

                                <SectionHeader
                                    title="Account status"
                                    description={
                                        user.archivestatus
                                            ? "Archived accounts cannot sign in."
                                            : "Archiving keeps the record and its history, but blocks sign-in."
                                    }
                                />

                                <div className="flex flex-wrap items-center justify-between gap-3 p-4">

                                    <p className="text-sm text-rd-muted">
                                        Currently{" "}
                                        <span className="font-semibold text-rd-title">
                                            {user.archivestatus ? "archived" : "active"}
                                        </span>
                                        .
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => setArchiveOpen(true)}
                                        className={`rd-btn-ghost rd-press rd-focus min-h-11 gap-2 py-0 ${
                                            user.archivestatus
                                                ? "hover:border-emerald-500/50 hover:text-rd-title"
                                                : "text-rd-danger hover:border-rd-danger-edge hover:bg-rd-danger-bg"
                                        }`}
                                    >
                                        {user.archivestatus ? (
                                            <RestoreIcon size={16} />
                                        ) : (
                                            <ArchiveIcon size={16} />
                                        )}
                                        {user.archivestatus ? "Restore user" : "Archive user"}
                                    </button>

                                </div>

                            </section>

                        </div>


                        <aside className="lg:sticky lg:top-4">

                            <section className="rd-panel">

                                <SectionHeader
                                    title="Pending changes"
                                    description={
                                        dirty
                                            ? "Nothing is written until you save."
                                            : "This account matches what is saved."
                                    }
                                    aside={
                                        dirty && (
                                            <span className="grid size-7 flex-none place-items-center rounded-full border border-rd-cyan/40 bg-rd-cyan/15 text-xs font-bold tabular-nums text-rd-cyan">
                                                {changes.length}
                                            </span>
                                        )
                                    }
                                />

                                <div className="p-4">

                                    {dirty ? (

                                        <ul className="divide-y divide-rd-hair">
                                            {changes.map(change => (
                                                <ChangeRow
                                                    key={change.key}
                                                    label={change.label}
                                                    from={change.from}
                                                    to={change.to}
                                                />
                                            ))}
                                        </ul>

                                    ) : (

                                        <p className="py-2 text-sm text-rd-muted">
                                            Edit a field and the difference shows up here
                                            before anything is written.
                                        </p>

                                    )}


                                    <div className="mt-4 space-y-2 border-t border-rd-hair pt-4">

                                        <button
                                            type="submit"
                                            disabled={!dirty || submitting}
                                            className="rd-btn rd-press rd-focus w-full justify-center gap-2 disabled:pointer-events-none disabled:opacity-40"
                                        >
                                            {submitting && <Spinner />}
                                            {submitting ? "Saving…" : "Save changes"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => goTo("/dashboard/admin/viewUsers")}
                                            className="rd-btn-ghost rd-press rd-focus min-h-11 w-full justify-center py-0"
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>

                            </section>


                            {record?.created_at && (

                                <p className="mt-3 px-1 text-xs text-rd-muted">
                                    Account created{" "}
                                    <time
                                        dateTime={new Date(record.created_at).toISOString()}
                                        title={formatFull(record.created_at)}
                                    >
                                        {formatDate(record.created_at)} at{" "}
                                        {formatTime(record.created_at)}
                                    </time>
                                </p>

                            )}

                        </aside>

                    </div>

                </form>

            </div>


            <Toast status={status} onDismiss={() => setStatus(null)} />


            <ConfirmDialog
                open={saveOpen}
                title="Save changes?"
                description={
                    user.password
                        ? `${changes.length} change${changes.length === 1 ? "" : "s"} to “${baseline?.username}” will be written, including a new password.`
                        : `${changes.length} change${changes.length === 1 ? "" : "s"} to “${baseline?.username}” will be written.`
                }
                confirmLabel="Save changes"
                onConfirm={saveChanges}
                onCancel={() => setSaveOpen(false)}
            />


            <ConfirmDialog
                open={archiveOpen}
                tone={user.archivestatus ? "default" : "danger"}
                title={user.archivestatus ? "Restore this user?" : "Archive this user?"}
                description={
                    user.archivestatus
                        ? `“${user.username}” will be able to sign in again once you save.`
                        : `“${user.username}” will be blocked from signing in once you save.`
                }
                confirmLabel={user.archivestatus ? "Restore user" : "Archive user"}
                onConfirm={() => {

                    setArchiveOpen(false);

                    setUser(prev => ({
                        ...prev,
                        archivestatus: !prev.archivestatus,
                    }));

                }}
                onCancel={() => setArchiveOpen(false)}
            />


            <ConfirmDialog
                open={discardTo !== null}
                tone="danger"
                title="Discard unsaved changes?"
                description={`${changes.length} pending change${changes.length === 1 ? "" : "s"} on this account will be lost.`}
                confirmLabel="Discard and leave"
                onConfirm={() => {

                    const href = discardTo;

                    setDiscardTo(null);

                    if (href) router.push(href);

                }}
                onCancel={() => setDiscardTo(null)}
            />

        </>

    );

}
