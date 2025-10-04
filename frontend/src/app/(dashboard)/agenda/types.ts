/**
 * Agenda view types and interfaces (read-only)
 */

export type AgendaViewMode = "day" | "week" | "month";
export type AgendaScheduleType = "all" | "meeting" | "event" | "task";

export interface AgendaEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  type: "meeting" | "event" | "task";
  location?: string;
  description?: string;
  attendees?: string[];
  color?: string;
  status?: "confirmed" | "tentative" | "cancelled";
}

export interface AgendaTimeSlot {
  hour: number;
  minute: number;
  display: string;
  isCurrentHour?: boolean;
}

export interface AgendaDate {
  date: Date;
  dayOfWeek: string;
  dayOfMonth: number;
  month: string;
  year: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  events: AgendaEvent[];
}

export interface AgendaViewState {
  currentDate: Date;
  viewMode: AgendaViewMode;
}

export interface AgendaStats {
  totalMeetings: number;
  totalEvents: number;
  totalTasks: number;
  todayMeetings: number;
  weekMeetings: number;
  monthMeetings: number;
  upcomingMeetings: number;
}

export interface AgendaEventWithPosition extends AgendaEvent {
  position: {
    top: number;
    height: number;
    width?: number;
    left?: number;
    zIndex?: number;
  };
}

export interface AgendaUtils {
  formatDateKey: (date: Date) => string;
  getWeekDates: (date: Date) => Date[];
  getMonthDates: (date: Date) => AgendaDate[];
  normalizeDate: (date: Date) => Date;
  getCurrentTimePosition: (date: Date) => number;
  calculateEventPosition: (
    event: AgendaEvent,
    viewMode: AgendaViewMode
  ) => {
    top: number;
    height: number;
    width?: number;
    left?: number;
  };
}
