/**
 * Utility functions for agenda view (read-only)
 */

import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getHours,
  getMinutes,
  isSameDay,
  isToday,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { AGENDA_CONSTANTS } from "./constants";
import type {
  AgendaDate,
  AgendaEvent,
  AgendaStats,
  AgendaTimeSlot,
} from "./types";

/**
 * Format date to key string for consistent comparison
 */
export function formatDateKey(date: Date): string {
  // Validate that the date is valid
  if (!date || isNaN(date.getTime())) {
    // Return a safe fallback without logging to prevent console spam
    return "1970-01-01"; // Epoch date as safe fallback
  }
  return format(date, "yyyy-MM-dd");
}

/**
 * Normalize date to midnight for consistent date handling
 */
export function normalizeDate(date: Date): Date {
  // Validate that the date is valid
  if (!date || isNaN(date.getTime())) {
    // Return today's date as fallback without logging to prevent console spam
    return new Date();
  }

  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

/**
 * Get week dates for a given date
 */
export function getWeekDates(date: Date): Date[] {
  // Validate input date
  if (!date || isNaN(date.getTime())) {
    // Use today's date as fallback without logging to prevent console spam
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 0 });
    const end = endOfWeek(today, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end }).map((day) => normalizeDate(day));
  }

  const start = startOfWeek(date, { weekStartsOn: 0 }); // Sunday start
  const end = endOfWeek(date, { weekStartsOn: 0 });

  return eachDayOfInterval({ start, end }).map((day) => normalizeDate(day));
}

/**
 * Get month dates with calendar structure
 */
export function getMonthDates(date: Date): AgendaDate[] {
  // Validate input date
  if (!date || isNaN(date.getTime())) {
    // Use today's date as fallback without logging to prevent console spam
    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    const startOfWeekDate = startOfWeek(start, { weekStartsOn: 0 });
    const endOfWeekDate = endOfWeek(end, { weekStartsOn: 0 });

    const days = eachDayOfInterval({
      start: startOfWeekDate,
      end: endOfWeekDate,
    });

    return days.map((day) => ({
      date: normalizeDate(day),
      dayOfWeek: format(day, "EEEE"),
      dayOfMonth: day.getDate(),
      month: format(day, "MMMM"),
      year: day.getFullYear(),
      isToday: isToday(day),
      isCurrentMonth: isSameDay(startOfMonth(today), startOfMonth(day)),
      events: [], // Will be populated by caller
    }));
  }

  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const startOfWeekDate = startOfWeek(start, { weekStartsOn: 0 });
  const endOfWeekDate = endOfWeek(end, { weekStartsOn: 0 });

  const days = eachDayOfInterval({
    start: startOfWeekDate,
    end: endOfWeekDate,
  });

  return days.map((day) => ({
    date: normalizeDate(day),
    dayOfWeek: format(day, "EEEE"),
    dayOfMonth: day.getDate(),
    month: format(day, "MMMM"),
    year: day.getFullYear(),
    isToday: isToday(day),
    isCurrentMonth: isSameDay(startOfMonth(date), startOfMonth(day)),
    events: [], // Will be populated by caller
  }));
}

/**
 * Get current time position in pixels for current time indicator
 */
export function getCurrentTimePosition(date: Date): number {
  const now = new Date();
  const hour = getHours(now);
  const minute = getMinutes(now);
  const totalMinutes = hour * 60 + minute;
  const workingStartMinutes = AGENDA_CONSTANTS.WORKING_HOURS.START * 60;

  // Only show indicator during working hours
  if (
    totalMinutes < workingStartMinutes ||
    totalMinutes > AGENDA_CONSTANTS.WORKING_HOURS.END * 60
  ) {
    return -1;
  }

  return (
    (totalMinutes - workingStartMinutes) *
    (AGENDA_CONSTANTS.ROW_HEIGHTS.DAY / 60)
  );
}

/**
 * Calculate event position and dimensions
 */
export function calculateEventPosition(
  event: AgendaEvent,
  viewMode: "list" | "day" | "week" | "month"
): { top: number; height: number; width?: number; left?: number } {
  // For list view, return default positioning
  if (viewMode === "list") {
    return {
      top: 0,
      height: 60, // Fixed height for list items
      width: 100,
      left: 0,
    };
  }

  const startHour = getHours(event.startTime);
  const startMinute = getMinutes(event.startTime);
  const endHour = getHours(event.endTime);
  const endMinute = getMinutes(event.endTime);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  const durationMinutes = endMinutes - startMinutes;

  const workingStartMinutes = AGENDA_CONSTANTS.WORKING_HOURS.START * 60;
  const relativeStartMinutes = Math.max(0, startMinutes - workingStartMinutes);

  const rowHeight =
    AGENDA_CONSTANTS.ROW_HEIGHTS[
      viewMode.toUpperCase() as keyof typeof AGENDA_CONSTANTS.ROW_HEIGHTS
    ] || AGENDA_CONSTANTS.ROW_HEIGHTS.WEEK;
  const top = (relativeStartMinutes / 60) * rowHeight;
  const height = Math.max(15, (durationMinutes / 60) * rowHeight);

  return {
    top,
    height,
    ...(viewMode === "month" && { width: 100 }),
    ...(viewMode === "week" && { left: 0 }),
  };
}

/**
 * Get event color based on type
 */
export function getEventColor(type: "meeting" | "event" | "task"): string {
  return AGENDA_CONSTANTS.EVENT_COLORS[type];
}

/**
 * Generate time slots for a day
 */
export function generateTimeSlots(): AgendaTimeSlot[] {
  const now = new Date();
  const currentHour = getHours(now);
  const currentMinute = getMinutes(now);

  return Array.from({ length: AGENDA_CONSTANTS.HOURS_PER_DAY }, (_, i) => {
    const hour = i;
    const minute = 0;
    const isCurrentHour = hour === currentHour;

    let display: string;
    if (hour === 0) {
      display = "12:00 AM";
    } else if (hour < 12) {
      display = `${hour}:00 AM`;
    } else if (hour === 12) {
      display = "12:00 PM";
    } else {
      display = `${hour - 12}:00 PM`;
    }

    return {
      hour,
      minute,
      display,
      isCurrentHour,
    };
  });
}

/**
 * Filter events by schedule type
 */
export function filterEventsByType(
  events: AgendaEvent[],
  scheduleType: "all" | "meeting" | "event" | "task"
): AgendaEvent[] {
  if (scheduleType === "all") {
    return events;
  }

  return events.filter((event) => event.type === scheduleType);
}

/**
 * Filter events by date range
 */
export function filterEventsByDateRange(
  events: AgendaEvent[],
  startDate: Date,
  endDate: Date
): AgendaEvent[] {
  return events.filter(
    (event) =>
      isWithinInterval(event.startTime, { start: startDate, end: endDate }) ||
      isWithinInterval(event.endTime, { start: startDate, end: endDate })
  );
}

/**
 * Check if two events overlap
 */
export function eventsOverlap(
  event1: AgendaEvent,
  event2: AgendaEvent
): boolean {
  return event1.startTime < event2.endTime && event1.endTime > event2.startTime;
}

/**
 * Calculate overlapping events and their positions (simplified for agenda)
 */
export function calculateOverlappingEvents(
  events: AgendaEvent[],
  viewMode: "list" | "day" | "week" | "month"
): Array<
  AgendaEvent & {
    position: {
      top: number;
      height: number;
      width: number;
      left: number;
      zIndex: number;
    };
  }
> {
  // Simplified overlapping calculation for read-only view
  const positionedEvents: Array<
    AgendaEvent & {
      position: {
        top: number;
        height: number;
        width: number;
        left: number;
        zIndex: number;
      };
    }
  > = [];

  events.forEach((event, index) => {
    const basePosition = calculateEventPosition(event, viewMode);

    positionedEvents.push({
      ...event,
      position: {
        ...basePosition,
        width: 100,
        left: 0,
        zIndex: 10 + index,
      },
    });
  });

  return positionedEvents;
}

/**
 * Calculate agenda statistics
 */
export function calculateAgendaStats(
  events: AgendaEvent[],
  currentDate: Date
): AgendaStats {
  const today = normalizeDate(currentDate);
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const todayEvents = events.filter((event) =>
    isSameDay(event.startTime, today)
  );
  const weekEvents = events.filter((event) =>
    isWithinInterval(event.startTime, { start: weekStart, end: weekEnd })
  );
  const monthEvents = events.filter((event) =>
    isWithinInterval(event.startTime, { start: monthStart, end: monthEnd })
  );

  // Calculate upcoming events (next 7 days)
  const nextWeek = addDays(today, 7);
  const upcomingEvents = events.filter(
    (event) => event.startTime >= today && event.startTime <= nextWeek
  );

  return {
    totalMeetings: events.filter((e) => e.type === "meeting").length,
    totalEvents: events.filter((e) => e.type === "event").length,
    totalTasks: events.filter((e) => e.type === "task").length,
    todayMeetings: todayEvents.filter((e) => e.type === "meeting").length,
    weekMeetings: weekEvents.filter((e) => e.type === "meeting").length,
    monthMeetings: monthEvents.filter((e) => e.type === "meeting").length,
    upcomingMeetings: upcomingEvents.filter((e) => e.type === "meeting").length,
  };
}

/**
 * Format time for display
 */
export function formatTime(date: Date): string {
  return format(date, "h:mm a");
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return format(date, "MMM d, yyyy");
}

/**
 * Format date and time for display
 */
export function formatDateTime(date: Date): string {
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

/**
 * Get relative time string (e.g., "in 2 hours", "tomorrow")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 0) {
    const absMinutes = Math.abs(diffMinutes);
    if (absMinutes < 60) {
      return `${absMinutes} minutes ago`;
    } else if (absMinutes < 1440) {
      return `${Math.abs(diffHours)} hours ago`;
    } else {
      return `${Math.abs(diffDays)} days ago`;
    }
  } else {
    if (diffMinutes < 60) {
      return `in ${diffMinutes} minutes`;
    } else if (diffMinutes < 1440) {
      return `in ${diffHours} hours`;
    } else if (diffDays === 1) {
      return "tomorrow";
    } else {
      return `in ${diffDays} days`;
    }
  }
}

/**
 * Check if time is within working hours
 */
export function isWithinWorkingHours(time: Date): boolean {
  const hour = getHours(time);
  return (
    hour >= AGENDA_CONSTANTS.WORKING_HOURS.START &&
    hour <= AGENDA_CONSTANTS.WORKING_HOURS.END
  );
}

/**
 * Get next upcoming event
 */
export function getNextUpcomingEvent(
  events: AgendaEvent[]
): AgendaEvent | null {
  const now = new Date();
  const upcomingEvents = events
    .filter((event) => event.startTime > now)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
}

/**
 * Get events for today
 */
export function getTodayEvents(events: AgendaEvent[]): AgendaEvent[] {
  const today = normalizeDate(new Date());
  return events.filter((event) => isSameDay(event.startTime, today));
}

/**
 * Get events for this week
 */
export function getThisWeekEvents(events: AgendaEvent[]): AgendaEvent[] {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 0 });

  return events.filter((event) =>
    isWithinInterval(event.startTime, { start: weekStart, end: weekEnd })
  );
}
