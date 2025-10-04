/**
 * Agenda view exports
 */

export { AgendaClient } from "./agenda-client";
export { AgendaView } from "./agenda-view";
export {
  CalendarErrorBoundary as AgendaErrorBoundary,
  ErrorFallback as AgendaErrorFallback,
} from "@/components/ui/error-boundaries";
export {
  CalendarLoadingSkeleton as AgendaLoadingSkeleton,
  EventCellSkeleton as AgendaEventSkeleton,
} from "@/components/ui/loading-skeletons";
export { AGENDA_CONSTANTS, AGENDA_MESSAGES, AGENDA_LABELS } from "./constants";
export {
  useAgendaView,
  useAgendaData,
  useAgendaDataFromMeetings,
  useCurrentTime,
  useAgendaLoading,
} from "./hooks";
export type {
  AgendaViewMode,
  AgendaEvent,
  AgendaTimeSlot,
  AgendaDate,
  AgendaViewState,
  AgendaStats,
  AgendaEventWithPosition,
  AgendaUtils,
} from "./types";
export {
  formatDateKey,
  normalizeDate,
  getWeekDates,
  getMonthDates,
  getCurrentTimePosition,
  calculateEventPosition,
  getEventColor,
  generateTimeSlots,
  filterEventsByDateRange,
  eventsOverlap,
  calculateOverlappingEvents,
  calculateAgendaStats,
  formatTime,
  formatDate,
  formatDateTime,
  getRelativeTime,
  isWithinWorkingHours,
  getNextUpcomingEvent,
  getTodayEvents,
  getThisWeekEvents,
} from "./utils";
