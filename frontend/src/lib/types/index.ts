// MCMeet - Meeting Booking System Types
// Centralized type definitions for chatbot-driven booking system

// Enums (matching Prisma schema)
export type UserRole = "STUDENT" | "FACULTY" | "ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type MeetingStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";
export type ScheduleType = "MEETING" | "EVENT" | "TASK";
export type ChatMessageType =
  | "TEXT"
  | "SYSTEM"
  | "QUICK_ACTION"
  | "BOOKING_REQUEST"
  | "MEETING_REMINDER";
export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

// User types (matching Prisma User model)
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: UserRole;
  department?: string;
  phone?: string;
  status: UserStatus;
  lastLogin?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  twoFactorVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Faculty types (matching Prisma Faculty model)
// Faculty interface - represents faculty members that can be booked
export interface Faculty {
  id: string;
  userId: string;
  user?: User;
  department: string;
  position: string;
  specializations: string[];
  office?: string;
  availability: string;
  status: string; // "Available" | "Busy" | "Away"
  bio?: string;
  isApproved: boolean; // Admin approval status
  approvedAt?: Date; // When admin approved this faculty
  approvedBy?: string; // Admin who approved this faculty
  createdAt: Date;
  updatedAt: Date;
  officeHours?: OfficeHours[];
}

// Office Hours types (matching Prisma OfficeHours model)
export interface OfficeHours {
  id: string;
  facultyId: string;
  faculty?: Faculty;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Booking types (matching Prisma Booking model)
// Booking interface - represents scheduled appointments created via chatbot
export interface Booking {
  id: string; // Unique booking identifier
  title: string; // Booking title/subject
  description?: string; // Additional booking details
  startTime: Date; // When the booking starts
  endTime: Date; // When the booking ends
  location?: string; // Meeting location (physical or virtual)
  status: MeetingStatus; // Booking status (SCHEDULED, CONFIRMED, etc.)
  scheduleType: ScheduleType; // Type of booking (MEETING, EVENT, TASK)
  purpose?: string; // Purpose of the meeting/booking
  notes?: string; // Admin notes about the booking
  studentId: string; // Student who made the booking
  student?: User; // Student user details
  facultyId: string; // Faculty member being booked
  faculty?: User; // Faculty user details
  createdAt: Date; // When booking was created
  updatedAt: Date; // When booking was last updated
  cancelledAt?: Date; // When booking was cancelled
  completedAt?: Date; // When booking was completed
}

// Chat Session types (matching Prisma ChatSession model)
export interface ChatSession {
  id: string;
  userId: string;
  user?: User;
  title?: string;
  isActive: boolean;
  context?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date;
  messages?: ChatMessage[];
}

// Chat Message types (matching Prisma ChatMessage model)
export interface ChatMessage {
  id: string;
  sessionId: string;
  session?: ChatSession;
  senderId: string;
  sender?: User;
  receiverId?: string;
  receiver?: User;
  content: string;
  type: ChatMessageType;
  metadata?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Booking Request types (matching Prisma BookingRequest model)
export interface BookingRequest {
  id: string;
  studentId: string;
  student?: User;
  facultyId: string;
  faculty?: User;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  purpose: string;
  status: BookingStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  respondedAt?: Date;
}

// Department types (matching Prisma Department model)
export interface Department {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Legacy types for backward compatibility
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  context?: PageContext;
}

export interface ChatState {
  messages: Message[];
  input: string;
  isLoading: boolean;
  selectedQuickAction: string | null;
  currentPage: PageContext;
  userId?: string;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  setInput: (input: string) => void;
  clearMessages: () => void;
  setIsLoading: (loading: boolean) => void;
  sendMessage: (content: string) => Promise<void>;
  setSelectedQuickAction: (action: string | null) => void;
  setCurrentPage: (page: PageContext) => void;
  setUserId: (userId?: string) => void;
}

export interface PageContext {
  page: "home" | "faculty" | "agenda" | "sked";
  data?: Record<string, unknown>;
}

// Legacy FacultyMember type for backward compatibility
export interface FacultyMember {
  id: number;
  name: string;
  department: string;
  email: string;
  phone: string;
  availability: string;
  status: "Available" | "Busy" | "Away";
  specializations: string[];
  nextAvailable: string;
  office?: string;
  bio?: string;
  userId?: string;
}

// API types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Quick Actions
export interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  template: string;
}

// Extended types for UI components
export interface BookingWithDetails extends Booking {
  facultyName?: string;
  studentName?: string;
  facultyEmail?: string;
  studentEmail?: string;
}

export interface FacultyWithUser extends Faculty {
  user: User;
}

export interface BookingRequestWithDetails extends BookingRequest {
  facultyName?: string;
  studentName?: string;
  facultyEmail?: string;
  studentEmail?: string;
}
