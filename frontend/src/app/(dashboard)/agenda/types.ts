/**
 * Agenda view types and interfaces (read-only)
 */

export type AgendaViewMode = "list" | "day" | "week" | "month";
export type AgendaScheduleType = "all" | "meeting" | "event" | "task";
export type BookingRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

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

export interface BookingRequest {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  facultyId: string;
  facultyName: string;
  facultyEmail: string;
  status: BookingRequestStatus;
  purpose: string;
  createdAt: Date;
  updatedAt: Date;
  requestedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  cancelledAt?: Date;
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
