import type { Metadata } from "next";
import { Suspense } from "react";
import { getBookingsForUser } from "@/lib/server/booking-server";
import { AgendaClient } from "./agenda-client";
import { AgendaErrorBoundary } from "./index";
import { AgendaLoadingSkeleton } from "./index";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Agenda | MCMeet",
  description: "View your scheduled meetings and appointments",
};

/**
 * Agenda Page
 *
 * Minimalist, read-only view of the user's schedule.
 * Shows bookings where the user is either student or faculty.
 * Clean interface focused on viewing and navigation without editing capabilities.
 */
export default async function AgendaPage() {
  // Get current session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login");
  }

  // Get bookings for the current user (either as student or faculty)
  const meetings = await getBookingsForUser(session.user.id);

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden">
      <AgendaErrorBoundary>
        <Suspense fallback={<AgendaLoadingSkeleton />}>
          <AgendaClient meetings={meetings} userId={session.user.id} />
        </Suspense>
      </AgendaErrorBoundary>
    </main>
  );
}
