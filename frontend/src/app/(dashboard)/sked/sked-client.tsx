"use client";

import { CalendarWeekView } from "@/components/calendar-week-view";
import { usePageContext } from "@/lib/hooks/use-chat";
import type { Booking } from "@/lib/types";
import { useCalendarData, useCalendarEvents, useCalendarView } from "./hooks";

interface SkedClientProps {
  bookings: Booking[];
}

/**
 * Calendar/Schedule Client Component
 *
 * Main client component for the calendar system.
 * Provides comprehensive calendar functionality including viewing, creating,
 * editing, and managing bookings, events, and tasks.
 *
 * @param bookings - Array of bookings from server
 */
export function SkedClient({ bookings }: SkedClientProps) {
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
   * Handle booking creation
   */
  const handleCreateBooking = async (bookingData: any) => {
    try {
      await createEvent(bookingData);
    } catch (error) {
      console.error("Failed to create booking:", error);
    }
  };

  /**
   * Handle booking updates
   */
  const handleUpdateBooking = async (bookingId: string, bookingData: any) => {
    try {
      await updateEvent(bookingId, bookingData);
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  /**
   * Handle booking deletion
   */
  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await deleteEvent(bookingId);
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
      <CalendarWeekView
        bookings={bookings}
        onCreateBooking={handleCreateBooking}
      />
    </div>
  );
}
