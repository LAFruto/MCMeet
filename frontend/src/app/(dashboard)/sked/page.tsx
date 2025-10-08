import type { Metadata } from "next";
import { Suspense } from "react";
import { getUserBookings } from "@/lib/server/booking-server";
import { SkedClient } from "./sked-client";
import { CalendarErrorBoundary } from "./index";
import { CalendarLoadingSkeleton } from "./index";
import { getAdminSession } from "@/lib/authz";

export const metadata: Metadata = {
  title: "Sked | MCMeet",
  description: "Manage and view all scheduled bookings",
};

/**
 * Sked (Schedule) Page
 *
 * Admin-only calendar view for managing all bookings across the system.
 * Provides a comprehensive view of scheduled meetings and appointments.
 *
 * @returns {Promise<JSX.Element>} The sked page component
 */
export default async function SkedPage() {
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
