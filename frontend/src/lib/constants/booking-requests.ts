import type { BookingRequest } from "@/app/(dashboard)/agenda/types";

/**
 * Mock booking requests data for testing
 */
export const MOCK_BOOKING_REQUESTS: BookingRequest[] = [
  {
    id: "req-1",
    title: "Research Discussion",
    description: "Discussion about thesis research methodology and next steps",
    startTime: new Date(2024, 11, 15, 10, 0), // Dec 15, 2024, 10:00 AM
    endTime: new Date(2024, 11, 15, 11, 0), // Dec 15, 2024, 11:00 AM
    location: "Office 201",
    studentId: "student-1",
    studentName: "Alice Johnson",
    studentEmail: "alice.johnson@university.edu",
    facultyId: "faculty-1",
    facultyName: "Dr. Sarah Wilson",
    facultyEmail: "sarah.wilson@university.edu",
    status: "pending",
    purpose: "Thesis research discussion",
    createdAt: new Date(2024, 11, 10, 14, 30),
    updatedAt: new Date(2024, 11, 10, 14, 30),
    requestedAt: new Date(2024, 11, 10, 14, 30),
  },
  {
    id: "req-2",
    title: "Project Review",
    description: "Review of final project submission and grading",
    startTime: new Date(2024, 11, 16, 14, 0), // Dec 16, 2024, 2:00 PM
    endTime: new Date(2024, 11, 16, 15, 0), // Dec 16, 2024, 3:00 PM
    location: "Online",
    studentId: "student-2",
    studentName: "Bob Smith",
    studentEmail: "bob.smith@university.edu",
    facultyId: "faculty-2",
    facultyName: "Prof. Michael Brown",
    facultyEmail: "michael.brown@university.edu",
    status: "approved",
    purpose: "Final project review",
    createdAt: new Date(2024, 11, 8, 9, 15),
    updatedAt: new Date(2024, 11, 9, 16, 45),
    requestedAt: new Date(2024, 11, 8, 9, 15),
    approvedAt: new Date(2024, 11, 9, 16, 45),
  },
  {
    id: "req-3",
    title: "Career Guidance",
    description:
      "Discussion about career options and graduate school applications",
    startTime: new Date(2024, 11, 18, 11, 30), // Dec 18, 2024, 11:30 AM
    endTime: new Date(2024, 11, 18, 12, 30), // Dec 18, 2024, 12:30 PM
    location: "Office 305",
    studentId: "student-3",
    studentName: "Carol Davis",
    studentEmail: "carol.davis@university.edu",
    facultyId: "faculty-1",
    facultyName: "Dr. Sarah Wilson",
    facultyEmail: "sarah.wilson@university.edu",
    status: "rejected",
    purpose: "Career guidance session",
    createdAt: new Date(2024, 11, 12, 10, 20),
    updatedAt: new Date(2024, 11, 13, 14, 10),
    requestedAt: new Date(2024, 11, 12, 10, 20),
    rejectedAt: new Date(2024, 11, 13, 14, 10),
    rejectionReason: "Time slot not available. Please choose a different time.",
  },
  {
    id: "req-4",
    title: "Lab Meeting",
    description: "Weekly lab meeting to discuss research progress",
    startTime: new Date(2024, 11, 20, 9, 0), // Dec 20, 2024, 9:00 AM
    endTime: new Date(2024, 11, 20, 10, 0), // Dec 20, 2024, 10:00 AM
    location: "Lab 101",
    studentId: "student-4",
    studentName: "David Lee",
    studentEmail: "david.lee@university.edu",
    facultyId: "faculty-3",
    facultyName: "Dr. Emily Chen",
    facultyEmail: "emily.chen@university.edu",
    status: "pending",
    purpose: "Lab meeting participation",
    createdAt: new Date(2024, 11, 14, 16, 0),
    updatedAt: new Date(2024, 11, 14, 16, 0),
    requestedAt: new Date(2024, 11, 14, 16, 0),
  },
  {
    id: "req-5",
    title: "Thesis Defense Prep",
    description: "Preparation for upcoming thesis defense presentation",
    startTime: new Date(2024, 11, 22, 15, 0), // Dec 22, 2024, 3:00 PM
    endTime: new Date(2024, 11, 22, 16, 30), // Dec 22, 2024, 4:30 PM
    location: "Conference Room A",
    studentId: "student-5",
    studentName: "Eva Martinez",
    studentEmail: "eva.martinez@university.edu",
    facultyId: "faculty-2",
    facultyName: "Prof. Michael Brown",
    facultyEmail: "michael.brown@university.edu",
    status: "approved",
    purpose: "Thesis defense preparation",
    createdAt: new Date(2024, 11, 11, 11, 45),
    updatedAt: new Date(2024, 11, 12, 9, 30),
    requestedAt: new Date(2024, 11, 11, 11, 45),
    approvedAt: new Date(2024, 11, 12, 9, 30),
  },
];

/**
 * Get booking requests by status
 */
export function getBookingRequestsByStatus(
  requests: BookingRequest[],
  status: "pending" | "approved" | "rejected" | "cancelled"
): BookingRequest[] {
  return requests.filter((request) => request.status === status);
}

/**
 * Get booking requests by faculty ID
 */
export function getBookingRequestsByFaculty(
  requests: BookingRequest[],
  facultyId: string
): BookingRequest[] {
  return requests.filter((request) => request.facultyId === facultyId);
}

/**
 * Get booking requests by student ID
 */
export function getBookingRequestsByStudent(
  requests: BookingRequest[],
  studentId: string
): BookingRequest[] {
  return requests.filter((request) => request.studentId === studentId);
}
