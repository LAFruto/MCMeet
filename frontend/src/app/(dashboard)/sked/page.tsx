import { Suspense } from "react";
import { getUserBookings } from "@/lib/server/booking-server";
import { SkedClient } from "./sked-client";
import { CalendarErrorBoundary } from "./index";
import { CalendarLoadingSkeleton } from "./index";
import { getAdminSession } from "@/lib/authz";

export default async function SkedPage() {
  // Require admin role
  await getAdminSession();

  const bookings = await getUserBookings();

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden">
      <CalendarErrorBoundary>
        <Suspense fallback={<CalendarLoadingSkeleton />}>
          <SkedClient bookings={bookings} />
        </Suspense>
      </CalendarErrorBoundary>
    </main>
  );
}
