/**
 * Utility functions for calendar/schedule system
 */

import {
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
import { CALENDAR_CONSTANTS } from "./constants";
import type {
  CalendarDate,
  CalendarEvent,
  CalendarStats,
  TimeSlot,
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
  const start = startOfWeek(date, { weekStartsOn: 0 }); // Sunday start
  const end = endOfWeek(date, { weekStartsOn: 0 });

  return eachDayOfInterval({ start, end }).map((day) => normalizeDate(day));
}

/**
 * Get month dates with calendar structure
 */
export function getMonthDates(date: Date): CalendarDate[] {
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
  const workingStartMinutes = CALENDAR_CONSTANTS.WORKING_HOURS.START * 60;

  // Only show indicator during working hours
  if (
    totalMinutes < workingStartMinutes ||
    totalMinutes > CALENDAR_CONSTANTS.WORKING_HOURS.END * 60
  ) {
    return -1;
  }

  return (
    (totalMinutes - workingStartMinutes) *
    (CALENDAR_CONSTANTS.ROW_HEIGHTS.DAY / 60)
  );
}

/**
 * Calculate event position and dimensions
 */
export function calculateEventPosition(
  event: CalendarEvent,
  viewMode: "day" | "week" | "month"
): { top: number; height: number; width?: number; left?: number } {
  const startHour = getHours(event.startTime);
  const startMinute = getMinutes(event.startTime);
  const endHour = getHours(event.endTime);
  const endMinute = getMinutes(event.endTime);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  const durationMinutes = endMinutes - startMinutes;

  const workingStartMinutes = CALENDAR_CONSTANTS.WORKING_HOURS.START * 60;
  const relativeStartMinutes = Math.max(0, startMinutes - workingStartMinutes);

  const rowHeight =
    CALENDAR_CONSTANTS.ROW_HEIGHTS[
      viewMode.toUpperCase() as keyof typeof CALENDAR_CONSTANTS.ROW_HEIGHTS
    ] || CALENDAR_CONSTANTS.ROW_HEIGHTS.WEEK;
  const top = (relativeStartMinutes / 60) * rowHeight;
  const height = Math.max(20, (durationMinutes / 60) * rowHeight);

  return {
    top,
    height,
    ...(viewMode === "month" && { width: 100 }),
    ...(viewMode === "week" && { left: 0 }),
  };
}

/**
 * Get meeting color based on type
 */
export function getMeetingColor(type: "meeting" | "event" | "task"): string {
  return CALENDAR_CONSTANTS.MEETING_COLORS[type];
}

/**
 * Generate time slots for a day
 */
export function generateTimeSlots(): TimeSlot[] {
  const now = new Date();
  const currentHour = getHours(now);
  const currentMinute = getMinutes(now);

  return Array.from({ length: CALENDAR_CONSTANTS.HOURS_PER_DAY }, (_, i) => {
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
  events: CalendarEvent[],
  scheduleType: "all" | "meeting" | "event" | "task"
): CalendarEvent[] {
  if (scheduleType === "all") {
    return events;
  }

  return events.filter((event) => event.type === scheduleType);
}

/**
 * Filter events by date range
 */
export function filterEventsByDateRange(
  events: CalendarEvent[],
  startDate: Date,
  endDate: Date
): CalendarEvent[] {
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
  event1: CalendarEvent,
  event2: CalendarEvent
): boolean {
  return event1.startTime < event2.endTime && event1.endTime > event2.startTime;
}

/**
 * Calculate overlapping events and their positions
 */
export function calculateOverlappingEvents(
  events: CalendarEvent[],
  viewMode: "day" | "week" | "month"
): Array<
  CalendarEvent & {
    position: {
      top: number;
      height: number;
      width: number;
      left: number;
      zIndex: number;
    };
  }
> {
  // Group events by time slots
  const timeSlots = new Map<string, CalendarEvent[]>();

  events.forEach((event) => {
    const startTime = formatDateKey(event.startTime);
    const endTime = formatDateKey(event.endTime);

    // Add event to all time slots it spans
    const currentDate = new Date(startTime);
    while (currentDate <= event.endTime) {
      const key = formatDateKey(currentDate);
      if (!timeSlots.has(key)) {
        timeSlots.set(key, []);
      }
      timeSlots.get(key)!.push(event);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  // Calculate positions for overlapping events
  const positionedEvents: Array<
    CalendarEvent & {
      position: {
        top: number;
        height: number;
        width: number;
        left: number;
        zIndex: number;
      };
    }
  > = [];

  timeSlots.forEach((slotEvents, dateKey) => {
    // Sort events by start time
    const sortedEvents = slotEvents.sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime()
    );

    // Calculate overlaps within this time slot
    const overlappingGroups: CalendarEvent[][] = [];
    let currentGroup: CalendarEvent[] = [];

    sortedEvents.forEach((event) => {
      if (currentGroup.length === 0) {
        currentGroup.push(event);
      } else {
        const lastEvent = currentGroup[currentGroup.length - 1];
        if (eventsOverlap(lastEvent, event)) {
          currentGroup.push(event);
        } else {
          overlappingGroups.push(currentGroup);
          currentGroup = [event];
        }
      }
    });

    if (currentGroup.length > 0) {
      overlappingGroups.push(currentGroup);
    }

    // Calculate positions for each group
    overlappingGroups.forEach((group) => {
      const groupSize = group.length;
      const basePosition = calculateEventPosition(group[0], viewMode);

      group.forEach((event, index) => {
        const widthPercent = 100 / groupSize;
        const leftPercent = index * widthPercent;

        positionedEvents.push({
          ...event,
          position: {
            ...basePosition,
            width: widthPercent,
            left: leftPercent,
            zIndex: 10 + index,
          },
        });
      });
    });
  });

  return positionedEvents;
}

/**
 * Calculate calendar statistics
 */
export function calculateCalendarStats(
  events: CalendarEvent[],
  currentDate: Date
): CalendarStats {
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

  return {
    totalMeetings: events.filter((e) => e.type === "meeting").length,
    totalEvents: events.filter((e) => e.type === "event").length,
    totalTasks: events.filter((e) => e.type === "task").length,
    todayMeetings: todayEvents.filter((e) => e.type === "meeting").length,
    weekMeetings: weekEvents.filter((e) => e.type === "meeting").length,
    monthMeetings: monthEvents.filter((e) => e.type === "meeting").length,
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
 * Get relative time string (e.g., "2 hours ago", "in 30 minutes")
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
    } else {
      return `in ${diffDays} days`;
    }
  }
}

/**
 * Validate time range
 */
export function validateTimeRange(startTime: Date, endTime: Date): boolean {
  return endTime > startTime;
}

/**
 * Check if time is within working hours
 */
export function isWithinWorkingHours(time: Date): boolean {
  const hour = getHours(time);
  return (
    hour >= CALENDAR_CONSTANTS.WORKING_HOURS.START &&
    hour <= CALENDAR_CONSTANTS.WORKING_HOURS.END
  );
}

/**
 * Get next available time slot
 */
export function getNextAvailableTimeSlot(
  events: CalendarEvent[],
  durationMinutes: number = 60,
  preferredStart?: Date
): Date {
  const now = new Date();
  const start = preferredStart || now;

  // Round up to next hour
  const nextHour = new Date(start);
  nextHour.setMinutes(0, 0, 0);
  nextHour.setHours(nextHour.getHours() + 1);

  // Check each hour until we find an available slot
  for (let i = 0; i < 24; i++) {
    const checkTime = new Date(nextHour);
    checkTime.setHours(checkTime.getHours() + i);

    const endTime = new Date(checkTime);
    endTime.setMinutes(endTime.getMinutes() + durationMinutes);

    // Check if this slot conflicts with existing events
    const hasConflict = events.some((event) =>
      eventsOverlap({ startTime: checkTime, endTime } as CalendarEvent, event)
    );

    if (!hasConflict && isWithinWorkingHours(checkTime)) {
      return checkTime;
    }
  }

  // If no slot found, return next day at 9 AM
  const nextDay = new Date(nextHour);
  nextDay.setDate(nextDay.getDate() + 1);
  nextDay.setHours(9, 0, 0, 0);

  return nextDay;
}
