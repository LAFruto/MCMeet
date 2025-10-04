/**
 * Validation schemas for calendar/schedule system
 */

import { z } from "zod";

/**
 * Schema for meeting/event/task creation and updates
 */
export const calendarEventSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(100, "Title too long"),
    description: z.string().max(500, "Description too long").optional(),
    startTime: z.date({ message: "Start time is required" }),
    endTime: z.date({ message: "End time is required" }),
    location: z
      .string()
      .min(1, "Location is required")
      .max(100, "Location too long"),
    type: z.enum(["meeting", "event", "task"], {
      message: "Type is required",
    }),
    attendees: z.array(z.string()).min(1, "At least one attendee is required"),
    professorInvolved: z
      .string()
      .max(100, "Professor name too long")
      .optional(),
    studentInvolved: z.string().max(100, "Student name too long").optional(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

/**
 * Schema for calendar filters
 */
export const calendarFiltersSchema = z
  .object({
    scheduleType: z.enum(["all", "meeting", "event", "task"]),
    faculty: z.array(z.string()).optional(),
    location: z.array(z.string()).optional(),
    dateRange: z
      .object({
        start: z.date(),
        end: z.date(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.dateRange && data.dateRange.end <= data.dateRange.start) {
        return false;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["dateRange"],
    }
  );

/**
 * Schema for calendar view state
 */
export const calendarViewSchema = z.object({
  currentDate: z.date(),
  viewMode: z.enum(["day", "week", "month"]),
  selectedScheduleType: z.enum(["all", "meeting", "event", "task"]),
});

/**
 * Schema for time slot validation
 */
export const timeSlotSchema = z.object({
  hour: z.number().min(0).max(23),
  minute: z.number().min(0).max(59).optional().default(0),
});

/**
 * Schema for meeting conflict detection
 */
export const meetingConflictSchema = z
  .object({
    existingMeeting: z.object({
      startTime: z.date(),
      endTime: z.date(),
    }),
    newMeeting: z.object({
      startTime: z.date(),
      endTime: z.date(),
    }),
  })
  .refine(
    (data) => {
      const { existingMeeting, newMeeting } = data;

      // Check if meetings overlap
      const existingStart = existingMeeting.startTime.getTime();
      const existingEnd = existingMeeting.endTime.getTime();
      const newStart = newMeeting.startTime.getTime();
      const newEnd = newMeeting.endTime.getTime();

      // Overlap exists if: newStart < existingEnd && newEnd > existingStart
      return !(newStart < existingEnd && newEnd > existingStart);
    },
    {
      message: "Time conflict detected with existing meeting",
      path: ["newMeeting"],
    }
  );

/**
 * Schema for recurring meeting configuration
 */
export const recurringMeetingSchema = z
  .object({
    frequency: z.enum(["daily", "weekly", "monthly"]),
    interval: z.number().min(1).max(52), // Every N days/weeks/months
    endDate: z.date().optional(),
    occurrences: z.number().min(1).max(100).optional(),
  })
  .refine(
    (data) => {
      // Either endDate or occurrences must be specified
      return data.endDate || data.occurrences;
    },
    {
      message: "Either end date or number of occurrences must be specified",
      path: ["endDate"],
    }
  );

/**
 * Schema for meeting attendee validation
 */
export const attendeeSchema = z.object({
  id: z.string().min(1, "Attendee ID is required"),
  name: z.string().min(1, "Attendee name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["student", "faculty", "admin"]).optional(),
  status: z
    .enum(["pending", "accepted", "declined"])
    .optional()
    .default("pending"),
});

/**
 * Schema for calendar export options
 */
export const calendarExportSchema = z.object({
  format: z.enum(["ics", "csv", "pdf"]),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }),
  includeDetails: z.boolean().default(true),
  includeAttendees: z.boolean().default(true),
  scheduleTypes: z
    .array(z.enum(["meeting", "event", "task"]))
    .default(["meeting", "event", "task"]),
});

/**
 * Type inference from schemas
 */
export type CalendarEventInput = z.infer<typeof calendarEventSchema>;
export type CalendarFiltersInput = z.infer<typeof calendarFiltersSchema>;
export type CalendarViewInput = z.infer<typeof calendarViewSchema>;
export type TimeSlotInput = z.infer<typeof timeSlotSchema>;
export type MeetingConflictInput = z.infer<typeof meetingConflictSchema>;
export type RecurringMeetingInput = z.infer<typeof recurringMeetingSchema>;
export type AttendeeInput = z.infer<typeof attendeeSchema>;
export type CalendarExportInput = z.infer<typeof calendarExportSchema>;
