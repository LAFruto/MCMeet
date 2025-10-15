"use client";

import { usePageContext } from "@/lib/hooks/use-chat";
import { AgendaView } from "./agenda-view";
import type { Booking } from "@/lib/types";
import { useAgendaView, useAgendaDataFromMeetings } from "./hooks";

interface AgendaClientProps {
  meetings: Booking[];
  userId: string;
  userRole: string;
}

/**
 * Agenda Client Component
 *
 * Main client component for the agenda view.
 * Provides a clean, read-only view of the user's schedule.
 * Students: View bookings and see booking request status (read-only)
 * Faculty: View bookings and approve/deny requests
 *
 * @param meetings - Array of meetings from server
 * @param userId - Current user's ID for filtering
 * @param userRole - User's role (STUDENT, FACULTY, ADMIN)
 */
export function AgendaClient({
  meetings,
  userId,
  userRole,
}: AgendaClientProps) {
  usePageContext("agenda");

  // Initialize agenda view state
  const { viewState, goToPrevious, goToNext, goToToday, changeViewMode } =
    useAgendaView();

  // Process agenda data
  const {
    filteredEvents,
    viewEvents,
    positionedEvents,
    stats,
    currentTimePosition,
  } = useAgendaDataFromMeetings(meetings, viewState);

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
      <AgendaView
        meetings={meetings}
        viewState={viewState}
        onNavigatePrevious={goToPrevious}
        onNavigateNext={goToNext}
        onNavigateToday={goToToday}
        onChangeViewMode={changeViewMode}
        stats={stats}
        currentTimePosition={currentTimePosition}
        userId={userId}
        userRole={userRole}
      />
    </div>
  );
}
