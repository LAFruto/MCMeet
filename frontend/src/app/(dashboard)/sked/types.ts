/**
 * Calendar/Schedule types and interfaces
 */

import type { Booking } from "@/lib/types";

export type ViewMode = "day" | "week" | "month";
export type ScheduleType = "all" | "MEETING" | "EVENT" | "TASK";

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  type: "MEETING" | "EVENT" | "TASK";
  location?: string;
  description?: string;
  attendees?: string[];
  color?: string;
}

export interface TimeSlot {
  hour: number;
  minute: number;
  display: string;
  isCurrentHour?: boolean;
}

export interface CalendarDate {
  date: Date;
  dayOfWeek: string;
  dayOfMonth: number;
  month: string;
  year: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
}

export interface CalendarViewState {
  currentDate: Date;
  viewMode: ViewMode;
  selectedScheduleType: ScheduleType;
  activeFilters: {
    faculty?: string[];
    location?: string[];
  };
}

export interface MeetingFormData {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees: string[];
  type: "MEETING" | "EVENT" | "TASK";
  professorInvolved?: string;
  studentInvolved?: string;
  purpose?: string;
  notes?: string;
}

export interface CalendarFilters {
  scheduleType: ScheduleType;
  faculty: string[];
  location: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface CalendarStats {
  totalMeetings: number;
  totalEvents: number;
  totalTasks: number;
  todayMeetings: number;
  weekMeetings: number;
  monthMeetings: number;
}

export interface CalendarClientState {
  viewMode: ViewMode;
  currentDate: Date;
  selectedScheduleType: ScheduleType;
  activeFilters: CalendarFilters;
  isEditDialogOpen: boolean;
  editingMeeting?: Booking;
  isDeleteDialogOpen: boolean;
  deletingMeeting?: Booking;
}

export interface CalendarUtils {
  formatDateKey: (date: Date) => string;
  getWeekDates: (date: Date) => Date[];
  getMonthDates: (date: Date) => CalendarDate[];
  normalizeDate: (date: Date) => Date;
  getCurrentTimePosition: (date: Date) => number;
  calculateEventPosition: (
    event: CalendarEvent,
    viewMode: ViewMode
  ) => {
    top: number;
    height: number;
    width?: number;
    left?: number;
  };
}

export interface BookingWithPosition extends Booking {
  position: {
    top: number;
    height: number;
    width?: number;
    left?: number;
    zIndex?: number;
  };
}
