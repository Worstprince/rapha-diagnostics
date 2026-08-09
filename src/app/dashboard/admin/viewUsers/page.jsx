import DisplayUsers from "@/components/userManagement/displayUsers";

import { PageHeader } from "../_ui";

export default function UserManagementPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">
      <PageHeader
        title="User Management"
        description="Manage and configure user accounts and permissions."
      />

      <DisplayUsers />
    </div>
  );
}
