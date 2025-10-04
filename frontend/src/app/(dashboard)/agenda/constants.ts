/**
 * Constants for agenda view (read-only)
 */

export const AGENDA_CONSTANTS = {
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

  // Row heights (in pixels) - slightly smaller than sked for minimalist view
  ROW_HEIGHTS: {
    DAY: 100,
    WEEK: 40,
    MONTH: 35,
  },

  // Event colors (same as sked for consistency)
  EVENT_COLORS: {
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

  // Current time indicator
  CURRENT_TIME_COLOR: "#dc2626", // dark red

  // UI configuration (minimalist)
  UI: {
    HEADER_HEIGHT: 48, // Smaller header
    NAVIGATION_HEIGHT: 40, // Smaller navigation
    TAB_HEIGHT: 36, // Smaller tabs
    MIN_CELL_WIDTH: 100,
    MAX_OVERLAP_WIDTH: 150,
  },

  // Responsive breakpoints
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
  },
} as const;

export const AGENDA_MESSAGES = {
  // Info messages
  NO_MEETINGS: "No meetings scheduled",
  NO_EVENTS: "No events scheduled",
  NO_TASKS: "No tasks scheduled",
  LOADING: "Loading your schedule...",
  NO_UPCOMING: "No upcoming events",

  // Empty state messages
  EMPTY_DAY: "No events scheduled for today",
  EMPTY_WEEK: "No events scheduled this week",
  EMPTY_MONTH: "No events scheduled this month",
} as const;

export const AGENDA_LABELS = {
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

  // Status
  CONFIRMED: "Confirmed",
  TENTATIVE: "Tentative",
  CANCELLED: "Cancelled",

  // Time
  ALL_DAY: "All Day",
  AM: "AM",
  PM: "PM",

  // Agenda specific
  MY_SCHEDULE: "My Schedule",
  UPCOMING: "Upcoming",
  THIS_WEEK: "This Week",
  THIS_MONTH: "This Month",
} as const;
