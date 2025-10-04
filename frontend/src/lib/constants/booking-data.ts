import type { Booking } from "../types";

// Helper function to get dates relative to today
function getDate(daysOffset: number = 0): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date;
}

export const MOCK_BOOKINGS: Booking[] = [
  // Today's bookings
  {
    id: "meeting-001",
    title: "Morning Standup",
    description: "Daily team sync meeting",
    facultyId: "faculty-001",
    studentId: "student-001",
    startTime: new Date(
      getDate(0).getFullYear(),
      getDate(0).getMonth(),
      getDate(0).getDate(),
      9,
      0
    ),
    endTime: new Date(
      getDate(0).getFullYear(),
      getDate(0).getMonth(),
      getDate(0).getDate(),
      9,
      30
    ),
    status: "SCHEDULED",
    purpose: "Daily team sync",
    location: "Online",
    scheduleType: "MEETING",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "meeting-002",
    title: "Thesis Review",
    description: "Review thesis draft chapters 1-3",
    facultyId: "faculty-002",
    studentId: "student-001",
    startTime: new Date(
      getDate(0).getFullYear(),
      getDate(0).getMonth(),
      getDate(0).getDate(),
      14,
      0
    ),
    endTime: new Date(
      getDate(0).getFullYear(),
      getDate(0).getMonth(),
      getDate(0).getDate(),
      15,
      0
    ),
    status: "SCHEDULED",
    purpose: "Review thesis draft chapters 1-3",
    location: "Room 201",
    scheduleType: "MEETING",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "meeting-003",
    title: "Project Discussion",
    description: "Discuss project timeline and milestones",
    facultyId: "faculty-003",
    studentId: "student-001",
    startTime: new Date(
      getDate(0).getFullYear(),
      getDate(0).getMonth(),
      getDate(0).getDate(),
      16,
      0
    ),
    endTime: new Date(
      getDate(0).getFullYear(),
      getDate(0).getMonth(),
      getDate(0).getDate(),
      17,
      0
    ),
    status: "SCHEDULED",
    purpose: "Discuss project timeline and milestones",
    location: "Online",
    scheduleType: "MEETING",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Tomorrow's bookings
  {
    id: "meeting-004",
    title: "Department Review",
    description: "Course selection guidance for next semester",
    facultyId: "faculty-002",
    studentId: "student-001",
    startTime: new Date(
      getDate(1).getFullYear(),
      getDate(1).getMonth(),
      getDate(1).getDate(),
      10,
      0
    ),
    endTime: new Date(
      getDate(1).getFullYear(),
      getDate(1).getMonth(),
      getDate(1).getDate(),
      11,
      30
    ),
    status: "SCHEDULED",
    purpose: "Course selection guidance for next semester",
    location: "Room 305",
    scheduleType: "MEETING",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "meeting-005",
    title: "Lab Equipment Training",
    description: "Introduction to new lab equipment",
    facultyId: "faculty-003",
    studentId: "student-001",
    startTime: new Date(
      getDate(1).getFullYear(),
      getDate(1).getMonth(),
      getDate(1).getDate(),
      13,
      0
    ),
    endTime: new Date(
      getDate(1).getFullYear(),
      getDate(1).getMonth(),
      getDate(1).getDate(),
      14,
      0
    ),
    status: "SCHEDULED",
    purpose: "Introduction to new lab equipment",
    location: "Lab 150",
    scheduleType: "EVENT",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Later this week
  {
    id: "meeting-006",
    title: "Research Presentation",
    description: "Present research findings to committee",
    facultyId: "faculty-001",
    studentId: "student-001",
    startTime: new Date(
      getDate(2).getFullYear(),
      getDate(2).getMonth(),
      getDate(2).getDate(),
      15,
      0
    ),
    endTime: new Date(
      getDate(2).getFullYear(),
      getDate(2).getMonth(),
      getDate(2).getDate(),
      16,
      30
    ),
    status: "SCHEDULED",
    purpose: "Present research findings to committee",
    location: "Conference Room A",
    scheduleType: "EVENT",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "meeting-007",
    title: "Advisory Meeting",
    description: "Quarterly academic progress review",
    facultyId: "faculty-004",
    studentId: "student-001",
    startTime: new Date(
      getDate(3).getFullYear(),
      getDate(3).getMonth(),
      getDate(3).getDate(),
      11,
      0
    ),
    endTime: new Date(
      getDate(3).getFullYear(),
      getDate(3).getMonth(),
      getDate(3).getDate(),
      12,
      0
    ),
    status: "SCHEDULED",
    purpose: "Quarterly academic progress review",
    location: "Room 402",
    scheduleType: "MEETING",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Past bookings
  {
    id: "meeting-008",
    title: "Introduction Meeting",
    description: "Initial consultation",
    facultyId: "faculty-001",
    studentId: "student-001",
    startTime: new Date(
      getDate(-1).getFullYear(),
      getDate(-1).getMonth(),
      getDate(-1).getDate(),
      10,
      0
    ),
    endTime: new Date(
      getDate(-1).getFullYear(),
      getDate(-1).getMonth(),
      getDate(-1).getDate(),
      11,
      0
    ),
    status: "COMPLETED",
    purpose: "Initial consultation",
    location: "Room 201",
    scheduleType: "EVENT",
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: new Date(),
  },
];

export const BOOKING_STATUS_CONFIG = {
  SCHEDULED: {
    label: "Scheduled",
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-100",
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-100",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-gray-500",
    textColor: "text-gray-700",
    bgColor: "bg-gray-100",
  },
  NO_SHOW: {
    label: "No Show",
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
} as const;
