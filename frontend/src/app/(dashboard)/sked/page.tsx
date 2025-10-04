import { getUserBookings } from "@/lib/server/booking-server";
import { SkedClient } from "./sked-client";
import { getAdminSession } from "@/lib/authz";

export default async function SkedPage() {
  // Require admin role
  await getAdminSession();

  const meetings = await getUserBookings();

  return (
    <main className="flex-1 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            My Schedules
          </h1>
          <p className="text-muted-foreground">
            View and manage your upcoming meetings and appointments.
          </p>
        </div>

        <SkedClient meetings={meetings} />
      </div>
    </main>
  );
}
