/**
 * Constants for faculty directory
 */

export const FACULTY_CONSTANTS = {
  SEARCH_PLACEHOLDER: "name, position, or email...",
  DEFAULT_OFFICE_HOURS: {
    start: "9:00 AM",
    end: "5:00 PM",
  },
  DEFAULT_AVAILABLE_DAYS: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ],
  TIME_SLOTS: [
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
  ],
  DAYS_OF_WEEK: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
} as const;

export const FACULTY_MESSAGES = {
  PROMOTE_SUCCESS: "User successfully promoted to faculty",
  DEMOTE_SUCCESS: "Faculty member demoted to user",
  UPDATE_SUCCESS: "Faculty details updated successfully",
  ERROR_GENERIC: "An error occurred. Please try again.",
  ERROR_PROMOTION: "Failed to promote user to faculty",
  ERROR_DEMOTION: "Failed to demote faculty member",
  ERROR_UPDATE: "Failed to update faculty details",
} as const;
