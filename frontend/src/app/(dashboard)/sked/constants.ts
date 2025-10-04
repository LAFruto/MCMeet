/**
 * Constants for calendar/schedule system
 */

export const CALENDAR_CONSTANTS = {
  // View modes
  VIEW_MODES: ["day", "week", "month"] as const,

  // Schedule types
  SCHEDULE_TYPES: ["all", "meeting", "event", "task"] as const,

  // Time configuration
  HOURS_PER_DAY: 24,
  MINUTES_PER_HOUR: 60,
  WORKING_HOURS: {
    START: 8,
    END: 20,
  },

  // Row heights (in pixels)
  ROW_HEIGHTS: {
    DAY: 128,
    WEEK: 48,
    MONTH: 40,
  },

  // Meeting colors
  MEETING_COLORS: {
    meeting: "#ef4444", // red
    event: "#3b82f6", // blue
    task: "#8b5cf6", // purple
  },

  // Time slots
  TIME_SLOTS: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    display:
      i === 0
        ? "12:00 AM"
        : i < 12
        ? `${i}:00 AM`
        : i === 12
        ? "12:00 PM"
        : `${i - 12}:00 PM`,
  })),

  // Days of week
  DAYS_OF_WEEK: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ] as const,

  // Months
  MONTHS: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ] as const,

  // Meeting duration options (in minutes)
  MEETING_DURATIONS: [15, 30, 45, 60, 90, 120, 180, 240] as const,

  // Default meeting duration
  DEFAULT_MEETING_DURATION: 60,

  // Current time indicator
  CURRENT_TIME_COLOR: "#dc2626", // dark red

  // UI configuration
  UI: {
    HEADER_HEIGHT: 56, // 14 * 4 = 56px (h-14)
    SEARCH_BAR_HEIGHT: 48, // 12 * 4 = 48px (h-12)
    TAB_HEIGHT: 40,
    SIDEBAR_WIDTH: 240,
    MIN_CELL_WIDTH: 120,
    MAX_OVERLAP_WIDTH: 200,
  },

  // Responsive breakpoints
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
  },
} as const;

export const CALENDAR_MESSAGES = {
  // Success messages
  MEETING_CREATED: "Meeting created successfully",
  MEETING_UPDATED: "Meeting updated successfully",
  MEETING_DELETED: "Meeting deleted successfully",
  EVENT_CREATED: "Event created successfully",
  EVENT_UPDATED: "Event updated successfully",
  EVENT_DELETED: "Event deleted successfully",
  TASK_CREATED: "Task created successfully",
  TASK_UPDATED: "Task updated successfully",
  TASK_DELETED: "Task deleted successfully",

  // Error messages
  ERROR_GENERIC: "An error occurred. Please try again.",
  ERROR_CREATE_MEETING: "Failed to create meeting",
  ERROR_UPDATE_MEETING: "Failed to update meeting",
  ERROR_DELETE_MEETING: "Failed to delete meeting",
  ERROR_INVALID_TIME: "Invalid time selection",
  ERROR_CONFLICT: "Time conflict detected",
  ERROR_NETWORK: "Network error. Please check your connection.",

  // Validation messages
  VALIDATION_REQUIRED_TITLE: "Title is required",
  VALIDATION_REQUIRED_START_TIME: "Start time is required",
  VALIDATION_REQUIRED_END_TIME: "End time is required",
  VALIDATION_INVALID_TIME_RANGE: "End time must be after start time",
  VALIDATION_REQUIRED_LOCATION: "Location is required",
  VALIDATION_REQUIRED_ATTENDEES: "At least one attendee is required",

  // Info messages
  NO_MEETINGS: "No meetings scheduled",
  NO_EVENTS: "No events scheduled",
  NO_TASKS: "No tasks scheduled",
  LOADING: "Loading calendar...",
  SAVING: "Saving...",

  // Confirmation messages
  CONFIRM_DELETE: "Are you sure you want to delete this item?",
  CONFIRM_DELETE_TITLE: "Delete Item",
  CONFIRM_DELETE_DESCRIPTION: "This action cannot be undone.",
} as const;

export const CALENDAR_LABELS = {
  // Navigation
  PREVIOUS_MONTH: "Previous month",
  NEXT_MONTH: "Next month",
  PREVIOUS_WEEK: "Previous week",
  NEXT_WEEK: "Next week",
  PREVIOUS_DAY: "Previous day",
  NEXT_DAY: "Next day",
  TODAY: "Today",

  // Views
  DAY_VIEW: "Day",
  WEEK_VIEW: "Week",
  MONTH_VIEW: "Month",

  // Schedule types
  ALL_SCHEDULES: "All Schedules",
  MEETINGS: "Meetings",
  EVENTS: "Events",
  TASKS: "Tasks",

  // Actions
  CREATE_MEETING: "Create Meeting",
  CREATE_EVENT: "Create Event",
  CREATE_TASK: "Create Task",
  EDIT_MEETING: "Edit Meeting",
  DELETE_MEETING: "Delete Meeting",
  VIEW_DETAILS: "View Details",

  // Filters
  FILTER_BY_FACULTY: "Filter by faculty",
  FILTER_BY_LOCATION: "Filter by location",
  CLEAR_FILTERS: "Clear filters",
  ACTIVE_FILTERS: "Active filters",

  // Form fields
  TITLE: "Title",
  DESCRIPTION: "Description",
  START_TIME: "Start Time",
  END_TIME: "End Time",
  LOCATION: "Location",
  ATTENDEES: "Attendees",
  TYPE: "Type",
  PROFESSOR_INVOLVED: "Professor Involved",
  STUDENT_INVOLVED: "Student Involved",

  // Time
  ALL_DAY: "All Day",
  AM: "AM",
  PM: "PM",

  // Status
  AVAILABLE: "Available",
  BUSY: "Busy",
  AWAY: "Away",
} as const;
