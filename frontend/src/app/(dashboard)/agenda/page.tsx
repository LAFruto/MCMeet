import { Suspense } from "react";
import { getUserBookings } from "@/lib/server/booking-server";
import { AgendaClient } from "./agenda-client";
import { AgendaErrorBoundary } from "./index";
import { AgendaLoadingSkeleton } from "./index";

/**
 * Agenda Page
 *
 * Minimalist, read-only view of the user's schedule.
 * Clean interface focused on viewing and navigation without editing capabilities.
 */
export default async function AgendaPage() {
  const meetings = await getUserBookings();

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden">
      <AgendaErrorBoundary>
        <Suspense fallback={<AgendaLoadingSkeleton />}>
          <AgendaClient meetings={meetings} />
        </Suspense>
      </AgendaErrorBoundary>
    </main>
  );
}
