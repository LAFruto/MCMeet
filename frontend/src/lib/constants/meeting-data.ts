import type { Meeting } from "../types";

export const MOCK_MEETINGS: Meeting[] = [
  {
    id: 1,
    title: "Faculty Meeting with Dr. Smith",
    facultyId: 1,
    facultyName: "Dr. Sarah Johnson",
    studentId: "STU001",
    studentName: "John Doe",
    date: "2024-10-04",
    startTime: "14:00",
    endTime: "15:00",
    status: "scheduled",
    purpose: "Discuss thesis proposal",
    location: "Room 201",
  },
  {
    id: 2,
    title: "Department Review",
    facultyId: 2,
    facultyName: "Prof. Michael Chen",
    studentId: "STU001",
    studentName: "John Doe",
    date: "2024-10-05",
    startTime: "10:00",
    endTime: "11:30",
    status: "scheduled",
    purpose: "Course selection guidance",
    location: "Room 305",
  },
  {
    id: 3,
    title: "Research Discussion",
    facultyId: 3,
    facultyName: "Dr. Emily Rodriguez",
    studentId: "STU001",
    studentName: "John Doe",
    date: "2024-10-08",
    startTime: "13:00",
    endTime: "14:00",
    status: "scheduled",
    purpose: "Lab equipment training",
    location: "Room 150",
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
