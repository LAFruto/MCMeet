"use client";

import { CalendarWeekView } from "@/components/calendar-week-view";
import { usePageContext } from "@/lib/hooks/use-chat";
import type { Booking } from "@/lib/types";
import { useMemo } from "react";

interface SkedClientProps {
  bookings: Booking[];
}

/**
 * Calendar/Schedule Client Component
 *
 * Admin-only calendar view for managing all bookings across the system.
 * Provides comprehensive calendar functionality including viewing, creating,
 * editing, and managing bookings, events, and tasks.
 *
 * @param bookings - Array of all bookings from server (admin view)
 */
export function SkedClient({ bookings }: SkedClientProps) {
  usePageContext("sked");

  // Normalize bookings to ensure dates are Date objects
  const normalizedBookings = useMemo(() => {
    return bookings
      .filter((booking) => booking.startTime && booking.endTime)
      .map((booking) => ({
        ...booking,
        startTime:
          booking.startTime instanceof Date
            ? booking.startTime
            : new Date(booking.startTime),
        endTime:
          booking.endTime instanceof Date
            ? booking.endTime
            : new Date(booking.endTime),
        createdAt:
          booking.createdAt instanceof Date
            ? booking.createdAt
            : new Date(booking.createdAt),
        updatedAt:
          booking.updatedAt instanceof Date
            ? booking.updatedAt
            : new Date(booking.updatedAt),
      }));
  }, [bookings]);

  /**
   * Handle booking creation (placeholder for future implementation)
   */
  const handleCreateBooking = async (bookingData: any) => {
    // TODO: Implement booking creation API call
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
      <CalendarWeekView
        bookings={normalizedBookings}
        onCreateBooking={handleCreateBooking}
      />
    </div>
  );
}
