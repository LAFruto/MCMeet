"use client";

/**
 * Custom hooks for calendar/schedule system
 */

import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import type {
  CalendarViewState,
  CalendarFilters,
  CalendarEvent,
  ViewMode,
  ScheduleType,
  MeetingFormData,
  CalendarStats,
} from "./types";
import { CALENDAR_CONSTANTS, CALENDAR_MESSAGES } from "./constants";
import {
  formatDateKey,
  normalizeDate,
  getWeekDates,
  getMonthDates,
  filterEventsByType,
  filterEventsByDateRange,
  calculateCalendarStats,
  getCurrentTimePosition,
  calculateOverlappingEvents,
} from "./utils";

/**
 * Hook for managing calendar view state
 */
export function useCalendarView(initialDate: Date = new Date()) {
  const [viewState, setViewState] = useState<CalendarViewState>({
    currentDate: normalizeDate(initialDate),
    viewMode: "week",
    selectedScheduleType: "all",
    activeFilters: {
      faculty: [],
      location: [],
    },
  });

  /**
   * Navigate to previous period
   */
  const goToPrevious = useCallback(() => {
    setViewState((prev) => {
      const { currentDate, viewMode } = prev;
      let newDate: Date;

      switch (viewMode) {
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
    setViewState((prev) => {
      const { currentDate, viewMode } = prev;
      let newDate: Date;

      switch (viewMode) {
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
    setViewState((prev) => ({
      ...prev,
      currentDate: normalizeDate(new Date()),
    }));
  }, []);

  /**
   * Change view mode
   */
  const changeViewMode = useCallback((mode: ViewMode) => {
    setViewState((prev) => ({
      ...prev,
      viewMode: mode,
    }));
  }, []);

  /**
   * Change schedule type filter
   */
  const changeScheduleType = useCallback((type: ScheduleType) => {
    setViewState((prev) => ({
      ...prev,
      selectedScheduleType: type,
    }));
  }, []);

  /**
   * Update active filters
   */
  const updateFilters = useCallback((filters: Partial<CalendarFilters>) => {
    setViewState((prev) => ({
      ...prev,
      activeFilters: {
        ...prev.activeFilters,
        ...filters,
      },
    }));
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setViewState((prev) => ({
      ...prev,
      selectedScheduleType: "all",
      activeFilters: {
        faculty: [],
        location: [],
      },
    }));
  }, []);

  return {
    viewState,
    goToPrevious,
    goToNext,
    goToToday,
    changeViewMode,
    changeScheduleType,
    updateFilters,
    clearFilters,
  };
}

/**
 * Hook for managing calendar events
 */
export function useCalendarEvents(initialEvents: CalendarEvent[] = []) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Create a new event
   */
  const createEvent = useCallback(async (eventData: MeetingFormData) => {
    setIsLoading(true);
    try {
      const newEvent: CalendarEvent = {
        id: `event-${Date.now()}`,
        title: eventData.title,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        type: eventData.type,
        location: eventData.location,
        description: eventData.description,
        attendees: eventData.attendees,
        color:
          eventData.type === "MEETING"
            ? "#ef4444"
            : eventData.type === "EVENT"
            ? "#3b82f6"
            : "#8b5cf6",
      };

      setEvents((prev) => [...prev, newEvent]);

      const successMessage =
        eventData.type === "MEETING"
          ? CALENDAR_MESSAGES.MEETING_CREATED
          : eventData.type === "EVENT"
          ? CALENDAR_MESSAGES.EVENT_CREATED
          : CALENDAR_MESSAGES.TASK_CREATED;

      toast.success(successMessage);

      return newEvent;
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(CALENDAR_MESSAGES.ERROR_CREATE_MEETING);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update an existing event
   */
  const updateEvent = useCallback(
    async (eventId: string, eventData: Partial<MeetingFormData>) => {
      setIsLoading(true);
      try {
        setEvents((prev) =>
          prev.map((event) =>
            event.id === eventId ? { ...event, ...eventData } : event
          )
        );

        const successMessage =
          eventData.type === "MEETING"
            ? CALENDAR_MESSAGES.MEETING_UPDATED
            : eventData.type === "EVENT"
            ? CALENDAR_MESSAGES.EVENT_UPDATED
            : CALENDAR_MESSAGES.TASK_UPDATED;

        toast.success(successMessage);
      } catch (error) {
        console.error("Error updating event:", error);
        toast.error(CALENDAR_MESSAGES.ERROR_UPDATE_MEETING);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Delete an event
   */
  const deleteEvent = useCallback(async (eventId: string) => {
    setIsLoading(true);
    try {
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      toast.success(CALENDAR_MESSAGES.MEETING_DELETED);
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(CALENDAR_MESSAGES.ERROR_DELETE_MEETING);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    events,
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}

/**
 * Hook for filtering and processing calendar data
 */
export function useCalendarData(
  events: CalendarEvent[],
  viewState: CalendarViewState
) {
  /**
   * Filter events based on current view and filters
   */
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Filter by schedule type
    if (viewState.selectedScheduleType !== "all") {
      // Convert new enum values to old format for compatibility
      const oldScheduleType =
        viewState.selectedScheduleType === "MEETING"
          ? "meeting"
          : viewState.selectedScheduleType === "EVENT"
          ? "event"
          : viewState.selectedScheduleType === "TASK"
          ? "task"
          : "all";
      filtered = filterEventsByType(filtered, oldScheduleType);
    }

    // Filter by date range based on view mode
    const { currentDate, viewMode } = viewState;
    let startDate: Date;
    let endDate: Date;

    switch (viewMode) {
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

    // Filter by faculty
    if (
      viewState.activeFilters.faculty &&
      viewState.activeFilters.faculty.length > 0
    ) {
      filtered = filtered.filter((event) =>
        event.attendees?.some((attendee) =>
          viewState.activeFilters.faculty?.includes(attendee)
        )
      );
    }

    // Filter by location
    if (
      viewState.activeFilters.location &&
      viewState.activeFilters.location.length > 0
    ) {
      filtered = filtered.filter((event) =>
        viewState.activeFilters.location?.includes(event.location || "")
      );
    }

    return filtered;
  }, [events, viewState]);

  /**
   * Calculate calendar statistics
   */
  const stats = useMemo((): CalendarStats => {
    return calculateCalendarStats(events, viewState.currentDate);
  }, [events, viewState.currentDate]);

  /**
   * Get events for current view
   */
  const viewEvents = useMemo(() => {
    const { currentDate, viewMode } = viewState;

    switch (viewMode) {
      case "day":
        return filteredEvents.filter(
          (event) =>
            formatDateKey(event.startTime) === formatDateKey(currentDate)
        );
      case "week":
        const weekDates = getWeekDates(currentDate);
        return filteredEvents.filter((event) =>
          weekDates.some(
            (weekDate) =>
              formatDateKey(event.startTime) === formatDateKey(weekDate)
          )
        );
      case "month":
        const monthDates = getMonthDates(currentDate);
        return filteredEvents.filter((event) =>
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
 * Hook for managing calendar dialogs
 */
export function useCalendarDialogs() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | null>(
    null
  );

  /**
   * Open edit dialog
   */
  const openEditDialog = useCallback((event: CalendarEvent) => {
    setEditingEvent(event);
    setIsEditDialogOpen(true);
  }, []);

  /**
   * Close edit dialog
   */
  const closeEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
    setEditingEvent(null);
  }, []);

  /**
   * Open delete dialog
   */
  const openDeleteDialog = useCallback((event: CalendarEvent) => {
    setDeletingEvent(event);
    setIsDeleteDialogOpen(true);
  }, []);

  /**
   * Close delete dialog
   */
  const closeDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setDeletingEvent(null);
  }, []);

  return {
    isEditDialogOpen,
    isDeleteDialogOpen,
    editingEvent,
    deletingEvent,
    openEditDialog,
    closeEditDialog,
    openDeleteDialog,
    closeDeleteDialog,
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
