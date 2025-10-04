/**
 * Calendar/Schedule system exports
 */

export { SkedClient } from "./sked-client";
export {
  CalendarErrorBoundary,
  ErrorFallback as CalendarErrorFallback,
} from "@/components/ui/error-boundaries";
export {
  CalendarLoadingSkeleton,
  MeetingCellSkeleton,
  CalendarLoadingSkeleton as CalendarHeaderSkeleton,
  CalendarLoadingSkeleton as CalendarNavigationSkeleton,
  CalendarLoadingSkeleton as ScheduleTabsSkeleton,
} from "@/components/ui/loading-skeletons";
export {
  CALENDAR_CONSTANTS,
  CALENDAR_MESSAGES,
  CALENDAR_LABELS,
} from "./constants";
export {
  useCalendarView,
  useCalendarEvents,
  useCalendarData,
  useCalendarDialogs,
  useCurrentTime,
} from "./hooks";
export type {
  ViewMode,
  ScheduleType,
  CalendarEvent,
  TimeSlot,
  CalendarDate,
  CalendarViewState,
  MeetingFormData,
  CalendarFilters,
  CalendarStats,
  CalendarClientState,
  CalendarUtils,
  BookingWithPosition,
} from "./types";
export {
  calendarEventSchema,
  calendarFiltersSchema,
  calendarViewSchema,
  timeSlotSchema,
  meetingConflictSchema,
  recurringMeetingSchema,
  attendeeSchema,
  calendarExportSchema,
} from "./validation";
export {
  formatDateKey,
  normalizeDate,
  getWeekDates,
  getMonthDates,
  getCurrentTimePosition,
  calculateEventPosition,
  getMeetingColor,
  generateTimeSlots,
  filterEventsByType,
  filterEventsByDateRange,
  eventsOverlap,
  calculateOverlappingEvents,
  calculateCalendarStats,
  formatTime,
  formatDate,
  formatDateTime,
  getRelativeTime,
  validateTimeRange,
  isWithinWorkingHours,
  getNextAvailableTimeSlot,
} from "./utils";
