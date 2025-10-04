import type { Meeting } from "../types";

// Helper function to get date strings relative to today
function getDateString(daysOffset: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  // Normalize to local timezone and create a date at midnight
  const normalizedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  return normalizedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export const MOCK_MEETINGS: Meeting[] = [
  // Today's meetings
  {
    id: 1,
    title: "Morning Standup",
    facultyId: 1,
    facultyName: "Dr. Sarah Johnson",
    studentId: "STU001",
    studentName: "John Doe",
    date: getDateString(0),
    startTime: "09:00",
    endTime: "09:30",
    status: "scheduled",
    purpose: "Daily team sync",
    location: "Online",
    scheduleType: "meeting",
  },
  {
    id: 2,
    title: "Thesis Review",
    facultyId: 2,
    facultyName: "Prof. Michael Chen",
    studentId: "STU001",
    studentName: "John Doe",
    date: getDateString(0),
    startTime: "14:00",
    endTime: "15:00",
    status: "scheduled",
    purpose: "Review thesis draft chapters 1-3",
    location: "Room 201",
    scheduleType: "meeting",
  },
  {
    id: 3,
    title: "Project Discussion",
    facultyId: 3,
    facultyName: "Dr. Emily Rodriguez",
    studentId: "STU001",
    studentName: "John Doe",
    date: getDateString(0),
    startTime: "16:00",
    endTime: "17:00",
    status: "scheduled",
    purpose: "Discuss project timeline and milestones",
    location: "Online",
    scheduleType: "meeting",
  },
  // Tomorrow's meetings
  {
    id: 4,
    title: "Department Review",
    facultyId: 2,
    facultyName: "Prof. Michael Chen",
    studentId: "STU001",
    studentName: "John Doe",
    date: getDateString(1),
    startTime: "10:00",
    endTime: "11:30",
    status: "scheduled",
    purpose: "Course selection guidance for next semester",
    location: "Room 305",
    scheduleType: "meeting",
  },
  {
    id: 5,
    title: "Lab Equipment Training",
    facultyId: 3,
    facultyName: "Dr. Emily Rodriguez",
    studentId: "STU001",
    studentName: "John Doe",
    date: getDateString(1),
    startTime: "13:00",
    endTime: "14:00",
    status: "scheduled",
    purpose: "Introduction to new lab equipment",
    location: "Lab 150",
    scheduleType: "event",
  },
  // Later this week
  {
    id: 6,
    title: "Research Presentation",
    facultyId: 1,
    facultyName: "Dr. Sarah Johnson",
    studentId: "STU001",
    studentName: "John Doe",
    date: getDateString(2),
    startTime: "15:00",
    endTime: "16:30",
    status: "scheduled",
    purpose: "Present research findings to committee",
    location: "Conference Room A",
    scheduleType: "event",
  },
  {
    id: 7,
    title: "Advisory Meeting",
    facultyId: 4,
    facultyName: "Prof. David Lee",
    studentId: "STU001",
    studentName: "John Doe",
    date: getDateString(3),
    startTime: "11:00",
    endTime: "12:00",
    status: "scheduled",
    purpose: "Quarterly academic progress review",
    location: "Room 402",
    scheduleType: "meeting",
  },
  // Past meetings
  {
    id: 8,
    title: "Introduction Meeting",
    facultyId: 1,
    facultyName: "Dr. Sarah Johnson",
    studentId: "STU001",
    studentName: "John Doe",
    date: getDateString(-1),
    startTime: "10:00",
    endTime: "11:00",
    status: "completed",
    purpose: "Initial consultation",
    location: "Room 201",
    scheduleType: "event",
  },
];

export const MEETING_STATUS_CONFIG = {
  scheduled: {
    label: "Scheduled",
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-100",
  },
  completed: {
    label: "Completed",
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-gray-500",
    textColor: "text-gray-700",
    bgColor: "bg-gray-100",
  },
} as const;
