// Centralized type definitions

// Chat types
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
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  setInput: (input: string) => void;
  clearMessages: () => void;
  setIsLoading: (loading: boolean) => void;
  sendMessage: (content: string) => Promise<void>;
  setSelectedQuickAction: (action: string | null) => void;
  setCurrentPage: (page: PageContext) => void;
}

export interface PageContext {
  page: "home" | "faculty" | "agenda" | "sked";
  data?: Record<string, unknown>;
}

// User Account types
export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "student" | "faculty" | "admin";
  createdAt: Date;
  lastLogin?: Date;
  department?: string;
  phone?: string;
  status: "active" | "inactive";
}

// Faculty types
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
  userId?: string; // Link to UserAccount
}

// Booking types
export interface Meeting {
  id: number;
  title: string;
  facultyId: number;
  facultyName: string;
  studentId: string;
  studentName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "completed" | "cancelled";
  purpose?: string;
  location?: string;
  scheduleType?: "meeting" | "event" | "task";
}

export interface BookingRequest {
  facultyId: number;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
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
