/**
 * Mock chat responses for development
 * Replace with actual AI/API responses in production
 */

export const CHAT_RESPONSES = {
  BOOK_MEETING: `I'd be happy to help you book a meeting with a faculty member! To get started, I'll need to know:

• Which faculty member you'd like to meet with
• Your preferred date and time
• The purpose of the meeting
• Your contact information

Let me check the faculty availability calendar and show you available time slots.`,

  CHECK_AVAILABILITY: `I can help you check faculty availability! Here's what I can show you:

• Current week's schedule for all faculty members
• Available time slots for meetings
• Faculty specializations and office hours
• Upcoming events and busy periods

Which faculty member's schedule would you like to see, or would you prefer to view all available slots?`,

  RESCHEDULE: `I can help you reschedule your existing meeting. To proceed, I'll need:

• Your current meeting details (date, time, faculty member)
• Your preferred new time slot
• Reason for rescheduling (optional)

Let me pull up your current bookings and show you available alternative times.`,

  CANCEL: `I can help you cancel your scheduled meeting. For confirmation, please provide:

• The meeting date and time
• Faculty member's name
• Your name and contact information

Once confirmed, I'll cancel the meeting and send you a confirmation email. Is there anything else I can help you with regarding your schedule?`,

  FACULTY_INFO: `Here's information about our faculty members:

• **Dr. Sarah Johnson** - Computer Science, Office: Room 201, Available: Mon-Wed 2-4 PM
• **Prof. Michael Chen** - Mathematics, Office: Room 305, Available: Tue-Thu 10-12 PM
• **Dr. Emily Rodriguez** - Physics, Office: Room 150, Available: Mon-Fri 1-3 PM
• **Prof. David Kim** - Engineering, Office: Room 420, Available: Wed-Fri 9-11 AM

Each faculty member has different specializations and office hours. Would you like more details about any specific professor?`,

  ACADEMIC_CALENDAR: `Here's the academic calendar for this semester:

**Important Dates:**
• Classes Start: January 15, 2024
• Midterm Exams: March 4-8, 2024
• Spring Break: March 18-22, 2024
• Final Exams: May 6-10, 2024
• Semester Ends: May 15, 2024

**Faculty Meeting Windows:**
• Regular office hours: 9 AM - 5 PM
• Extended hours during exam periods
• No meetings during university holidays

Is there a specific date range you're interested in?`,

  DEFAULT: `I understand you're looking for help with faculty scheduling. I can assist you with:

• Booking meetings with faculty members
• Checking availability and schedules
• Rescheduling or canceling appointments
• Providing faculty information and contact details
• Showing academic calendar and important dates

What specific task would you like help with today?`,

  WELCOME: `Hello! I'm your AI assistant for MCMeet, the faculty booking system. I can help you schedule meetings with faculty members, check availability, manage your appointments, and provide information about our academic community. What would you like to do today?`,

  ERROR: `I apologize, but I'm experiencing some technical difficulties. Please try again in a moment, or contact our support team if the issue persists.`,
};

/**
 * Get appropriate response based on user input
 */
export function getResponseForInput(input: string): string {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes("book") && lowerInput.includes("meeting")) {
    return CHAT_RESPONSES.BOOK_MEETING;
  }

  if (lowerInput.includes("availability") || lowerInput.includes("schedule")) {
    return CHAT_RESPONSES.CHECK_AVAILABILITY;
  }

  if (lowerInput.includes("reschedule")) {
    return CHAT_RESPONSES.RESCHEDULE;
  }

  if (lowerInput.includes("cancel")) {
    return CHAT_RESPONSES.CANCEL;
  }

  if (lowerInput.includes("faculty") && lowerInput.includes("info")) {
    return CHAT_RESPONSES.FACULTY_INFO;
  }

  if (lowerInput.includes("calendar") || lowerInput.includes("academic")) {
    return CHAT_RESPONSES.ACADEMIC_CALENDAR;
  }

  return CHAT_RESPONSES.DEFAULT;
}
