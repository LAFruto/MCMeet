import { Suspense } from "react";
import { getUserBookings } from "@/lib/server/booking-server";
import { SkedClient } from "./sked-client";
import { CalendarErrorBoundary } from "./index";
import { CalendarLoadingSkeleton } from "./index";
import { getAdminSession } from "@/lib/authz";

export default async function SkedPage() {
  // Require admin role
  await getAdminSession();

  const meetings = await getUserBookings();

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden">
      <CalendarErrorBoundary>
        <Suspense fallback={<CalendarLoadingSkeleton />}>
          <SkedClient meetings={meetings} />
        </Suspense>
      </CalendarErrorBoundary>
    </main>
  );
}
