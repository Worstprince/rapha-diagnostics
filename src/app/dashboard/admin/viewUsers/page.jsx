import DisplayUsers from "@/components/userManagement/displayUsers";

export default function UserManagementPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="rd-panel p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">Admin</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">User Management</h1>
        <p className="mt-2 text-sm text-rd-muted">
          Manage and configure user accounts and permissions.
        </p>
      </header>

      <DisplayUsers />
    </div>
  );
}
