import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/serverSession";

const normalizeRole = (value) => String(value ?? "").trim().toLowerCase();

const ROLE_HOME = {
  administrator: "/dashboard/admin",
  receptionist: "/dashboard/reception",
  "medical technologist": "/dashboard/medtech",
  pathologist: "/dashboard/doctor",
  physician: "/dashboard/doctor",
  doctor: "/dashboard/doctor",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const roleKey = normalizeRole(user?.role);

  redirect(ROLE_HOME[roleKey] ?? "/auth/login");
}
