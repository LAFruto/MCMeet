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
 * Provides a comprehensive view of all scheduled meetings and appointments.
 *
 * Features:
 * - View all bookings system-wide
 * - Filter by faculty, type, location
 * - Week/Day/Month views
 * - Real-time booking status
 *
 * @returns {Promise<JSX.Element>} The sked page component
 */
export default async function SkedPage() {
  // Verify admin access
  await getAdminSession();

  // Get ALL bookings from the system (admin view)
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
