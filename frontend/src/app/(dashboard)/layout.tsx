import { DashboardLayoutClient } from "@/components/dashboard-layout-client";
// import { getRequiredSession } from "@/lib/authz";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side guard: redirects to /login if no valid session
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const _sessionPromise = getRequiredSession();
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
