import { getAdminSession } from "@/lib/authz";

/**
 * Admin-only page to view all bookings across the system
 */
export default async function AllBookingsPage() {
  const session = await getAdminSession();

  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            All Bookings
          </h1>
          <p className="text-muted-foreground">
            View and manage all meetings across the system
          </p>
        </div>

        <div className="bg-muted/30 border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-2">
            Welcome, {session.user.name}!
          </p>
          <p className="text-sm text-muted-foreground">
            System-wide bookings view coming soon...
          </p>
        </div>
      </div>
    </main>
  );
}
