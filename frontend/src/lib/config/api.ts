/**
 * API configuration
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

export const API_ENDPOINTS = {
  // Chat
  CHAT: "/chat",
  CHAT_HISTORY: "/chat/history",

  // Faculty
  FACULTY: "/faculty",
  FACULTY_BY_ID: (id: number) => `/faculty/${id}`,
  FACULTY_AVAILABILITY: (id: number) => `/faculty/${id}/availability`,

  // Bookings
  BOOKINGS: "/bookings",
  BOOKING_BY_ID: (id: number) => `/bookings/${id}`,
  USER_BOOKINGS: "/bookings/user",
  CREATE_BOOKING: "/bookings/create",
  CANCEL_BOOKING: (id: number) => `/bookings/${id}/cancel`,
  RESCHEDULE_BOOKING: (id: number) => `/bookings/${id}/reschedule`,

  // Calendar
  CALENDAR: "/calendar",
  EVENTS: "/calendar/events",
} as const;
