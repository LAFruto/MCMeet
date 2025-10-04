import { getAdminSession } from "@/lib/authz";
import { DashboardLayoutClient } from "@/components/dashboard-layout-client";

/**
 * Admin layout - requires admin role
 * Automatically redirects non-admin users
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will redirect to "/" if user is not admin
  await getAdminSession();

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
