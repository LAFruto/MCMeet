"use client";

import { usePageContext } from "@/lib/hooks/use-chat";
import { CalendarWeekView } from "@/components/calendar-week-view";
import type { Meeting } from "@/lib/types";
import { useCalendarView, useCalendarEvents, useCalendarData } from "./hooks";
import { CALENDAR_CONSTANTS, CALENDAR_LABELS } from "./constants";

interface SkedClientProps {
  meetings: Meeting[];
}

/**
 * Calendar/Schedule Client Component
 *
 * Main client component for the calendar system.
 * Provides comprehensive calendar functionality including viewing, creating,
 * editing, and managing meetings, events, and tasks.
 *
 * @param meetings - Array of meetings from server
 */
export function SkedClient({ meetings }: SkedClientProps) {
  usePageContext("sked");

  // Initialize calendar view state
  const {
    viewState,
    goToPrevious,
    goToNext,
    goToToday,
    changeViewMode,
    changeScheduleType,
    updateFilters,
    clearFilters,
  } = useCalendarView();

  // Initialize calendar events management
  const { events, isLoading, createEvent, updateEvent, deleteEvent } =
    useCalendarEvents();

  // Process and filter calendar data
  const {
    filteredEvents,
    viewEvents,
    positionedEvents,
    stats,
    currentTimePosition,
  } = useCalendarData(events, viewState);

  /**
   * Handle meeting creation
   */
  const handleCreateMeeting = async (meetingData: any) => {
    try {
      await createEvent(meetingData);
    } catch (error) {
      console.error("Failed to create meeting:", error);
    }
  };

  /**
   * Handle meeting updates
   */
  const handleUpdateMeeting = async (meetingId: string, meetingData: any) => {
    try {
      await updateEvent(meetingId, meetingData);
    } catch (error) {
      console.error("Failed to update meeting:", error);
    }
  };

  /**
   * Handle meeting deletion
   */
  const handleDeleteMeeting = async (meetingId: string) => {
    try {
      await deleteEvent(meetingId);
    } catch (error) {
      console.error("Failed to delete meeting:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
      <CalendarWeekView
        meetings={meetings}
        onCreateMeeting={handleCreateMeeting}
      />
    </div>
  );
}
