"use client";

/**
 * Custom hooks for agenda view (read-only)
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Booking } from "@/lib/types";
import type {
  AgendaEvent,
  AgendaStats,
  AgendaViewMode,
  AgendaViewState,
} from "./types";
import {
  calculateAgendaStats,
  calculateOverlappingEvents,
  filterEventsByDateRange,
  formatDateKey,
  getCurrentTimePosition,
  getMonthDates,
  getWeekDates,
  normalizeDate,
} from "./utils";

/**
 * Hook for managing agenda view state (read-only)
 */
export function useAgendaView(initialDate: Date = new Date()) {
  const [viewState, setViewState] = useState<AgendaViewState>({
    currentDate: normalizeDate(initialDate),
    viewMode: "list",
  });

  /**
   * Navigate to previous period
   */
  const goToPrevious = useCallback(() => {
    setViewState((prev: AgendaViewState) => {
      const { currentDate, viewMode } = prev;
      let newDate: Date;

      switch (viewMode) {
        case "list":
          // List view doesn't need navigation
          newDate = currentDate;
          break;
        case "day":
          newDate = new Date(currentDate);
          newDate.setDate(newDate.getDate() - 1);
          break;
        case "week":
          newDate = new Date(currentDate);
          newDate.setDate(newDate.getDate() - 7);
          break;
        case "month":
          newDate = new Date(currentDate);
          newDate.setMonth(newDate.getMonth() - 1);
          break;
        default:
          newDate = currentDate;
      }

      return {
        ...prev,
        currentDate: normalizeDate(newDate),
      };
    });
  }, []);

  /**
   * Navigate to next period
   */
  const goToNext = useCallback(() => {
    setViewState((prev: AgendaViewState) => {
      const { currentDate, viewMode } = prev;
      let newDate: Date;

      switch (viewMode) {
        case "list":
          // List view doesn't need navigation
          newDate = currentDate;
          break;
        case "day":
          newDate = new Date(currentDate);
          newDate.setDate(newDate.getDate() + 1);
          break;
        case "week":
          newDate = new Date(currentDate);
          newDate.setDate(newDate.getDate() + 7);
          break;
        case "month":
          newDate = new Date(currentDate);
          newDate.setMonth(newDate.getMonth() + 1);
          break;
        default:
          newDate = currentDate;
      }

      return {
        ...prev,
        currentDate: normalizeDate(newDate),
      };
    });
  }, []);

  /**
   * Navigate to today
   */
  const goToToday = useCallback(() => {
    setViewState((prev: AgendaViewState) => ({
      ...prev,
      currentDate: normalizeDate(new Date()),
    }));
  }, []);

  /**
   * Change view mode
   */
  const changeViewMode = useCallback((mode: AgendaViewMode) => {
    setViewState((prev: AgendaViewState) => ({
      ...prev,
      viewMode: mode,
    }));
  }, []);

  return {
    viewState,
    goToPrevious,
    goToNext,
    goToToday,
    changeViewMode,
  };
}

/**
 * Hook for processing agenda data from meetings (read-only)
 */
export function useAgendaDataFromMeetings(
  meetings: Booking[],
  viewState: AgendaViewState
) {
  // Transform meetings to agenda events
  const events: AgendaEvent[] = useMemo(() => {
    return meetings
      .map((meeting) => {
        // Parse the date string - expecting ISO format (YYYY-MM-DD)
        // Use startTime as the meeting date (it's already a Date object)
        const meetingDate = meeting.startTime;

        // Validate the date
        if (isNaN(meetingDate.getTime())) {
          console.warn(
            "Invalid meeting date:",
            meeting.startTime,
            "for meeting:",
            meeting.title
          );
          // Skip this meeting
          return null;
        }

        // Extract time parts from Date objects
        const startTimeStr = meeting.startTime
          .toTimeString()
          .split(" ")[0]
          .substring(0, 5);
        const endTimeStr = meeting.endTime
          .toTimeString()
          .split(" ")[0]
          .substring(0, 5);
        const startTimeParts = startTimeStr.split(":");
        const endTimeParts = endTimeStr.split(":");

        if (startTimeParts.length !== 2 || endTimeParts.length !== 2) {
          console.warn(
            "Invalid time format for meeting:",
            meeting.title,
            "startTime:",
            meeting.startTime,
            "endTime:",
            meeting.endTime
          );
          return null;
        }

        const [startHour, startMinute] = startTimeParts.map(Number);
        const [endHour, endMinute] = endTimeParts.map(Number);

        // Validate parsed times
        if (
          isNaN(startHour) ||
          isNaN(startMinute) ||
          isNaN(endHour) ||
          isNaN(endMinute) ||
          startHour < 0 ||
          startHour > 23 ||
          startMinute < 0 ||
          startMinute > 59 ||
          endHour < 0 ||
          endHour > 23 ||
          endMinute < 0 ||
          endMinute > 59
        ) {
          console.warn(
            "Invalid time values for meeting:",
            meeting.title,
            "startTime:",
            meeting.startTime,
            "endTime:",
            meeting.endTime
          );
          return null;
        }

        // Use the existing Date objects directly
        const startTime = meeting.startTime;
        const endTime = meeting.endTime;

        // Validate the dates
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
          console.warn("Invalid date for meeting:", meeting.title);
          return null;
        }

        // Ensure end time is after start time
        if (endTime <= startTime) {
          console.warn(
            "End time must be after start time for meeting:",
            meeting.title
          );
          return null;
        }

        return {
          id: meeting.id,
          title: meeting.title,
          startTime,
          endTime,
          type:
            meeting.scheduleType === "MEETING"
              ? "meeting"
              : meeting.scheduleType === "EVENT"
              ? "event"
              : "task",
          location: meeting.location || "",
          description: meeting.purpose || "",
          attendees: [
            meeting.faculty?.name || "Unknown Faculty",
            meeting.student?.name || "Unknown Student",
          ].filter(Boolean),
          color:
            meeting.scheduleType === "MEETING"
              ? "#ef4444"
              : meeting.scheduleType === "EVENT"
              ? "#3b82f6"
              : "#8b5cf6",
          status: "confirmed" as const,
        };
      })
      .filter(Boolean) as AgendaEvent[]; // Filter out null values
  }, [meetings]);

  return useAgendaData(events, viewState);
}

/**
 * Hook for processing agenda data (read-only)
 */
export function useAgendaData(
  events: AgendaEvent[],
  viewState: AgendaViewState
) {
  /**
   * Filter events based on current view (no schedule type filtering)
   */
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Filter by date range based on view mode
    const { currentDate, viewMode } = viewState;
    let startDate: Date;
    let endDate: Date;

    switch (viewMode) {
      case "list":
        // List view shows all events without date filtering
        return filtered;
      case "day":
        startDate = new Date(currentDate);
        endDate = new Date(currentDate);
        endDate.setDate(endDate.getDate() + 1);
        break;
      case "week":
        const weekDates = getWeekDates(currentDate);
        startDate = weekDates[0];
        endDate = weekDates[weekDates.length - 1];
        endDate.setDate(endDate.getDate() + 1);
        break;
      case "month":
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        endDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );
        break;
      default:
        startDate = currentDate;
        endDate = currentDate;
    }

    filtered = filterEventsByDateRange(filtered, startDate, endDate);

    return filtered;
  }, [events, viewState]);

  /**
   * Calculate agenda statistics
   */
  const stats = useMemo((): AgendaStats => {
    return calculateAgendaStats(events, viewState.currentDate);
  }, [events, viewState.currentDate]);

  /**
   * Get events for current view
   */
  const viewEvents = useMemo(() => {
    const { currentDate, viewMode } = viewState;

    switch (viewMode) {
      case "list":
        // List view shows all filtered events
        return filteredEvents;
      case "day":
        return filteredEvents.filter(
          (event: AgendaEvent) =>
            formatDateKey(event.startTime) === formatDateKey(currentDate)
        );
      case "week":
        const weekDates = getWeekDates(currentDate);
        return filteredEvents.filter((event: AgendaEvent) =>
          weekDates.some(
            (weekDate) =>
              formatDateKey(event.startTime) === formatDateKey(weekDate)
          )
        );
      case "month":
        const monthDates = getMonthDates(currentDate);
        return filteredEvents.filter((event: AgendaEvent) =>
          monthDates.some(
            (monthDate) =>
              formatDateKey(event.startTime) === formatDateKey(monthDate.date)
          )
        );
      default:
        return filteredEvents;
    }
  }, [filteredEvents, viewState]);

  /**
   * Get current time position for indicator
   */
  const currentTimePosition = useMemo(() => {
    return getCurrentTimePosition(new Date());
  }, []);

  /**
   * Calculate overlapping events with positions
   */
  const positionedEvents = useMemo(() => {
    return calculateOverlappingEvents(viewEvents, viewState.viewMode);
  }, [viewEvents, viewState.viewMode]);

  return {
    filteredEvents,
    viewEvents,
    positionedEvents,
    stats,
    currentTimePosition,
  };
}

/**
 * Hook for managing current time updates
 */
export function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return currentTime;
}

/**
 * Hook for agenda loading state
 */
export function useAgendaLoading() {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return {
    isLoading,
    setLoading,
  };
}
