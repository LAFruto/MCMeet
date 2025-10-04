/**
 * Mock data for faculty directory
 */

import type { UserAccount } from "@/lib/types";

/**
 * Mock user accounts that can be promoted to faculty
 */
export const MOCK_USER_ACCOUNTS: UserAccount[] = [
  {
    id: "user-1",
    name: "John Smith",
    email: "john.smith@student.edu",
    role: "student",
    createdAt: new Date("2024-01-15"),
    lastLogin: new Date("2024-01-20"),
    status: "active",
  },
  {
    id: "user-2",
    name: "Sarah Johnson",
    email: "sarah.johnson@student.edu",
    role: "student",
    createdAt: new Date("2024-01-10"),
    lastLogin: new Date("2024-01-19"),
    department: "Computer Science",
    status: "active",
  },
  {
    id: "user-3",
    name: "Michael Chen",
    email: "michael.chen@student.edu",
    role: "student",
    createdAt: new Date("2024-01-05"),
    lastLogin: new Date("2024-01-18"),
    department: "Mathematics",
    phone: "+1 (555) 123-4567",
    status: "active",
  },
  {
    id: "user-4",
    name: "Emily Davis",
    email: "emily.davis@student.edu",
    role: "student",
    createdAt: new Date("2024-01-12"),
    lastLogin: new Date("2024-01-21"),
    department: "Physics",
    phone: "+1 (555) 987-6543",
    status: "active",
  },
  {
    id: "user-5",
    name: "David Wilson",
    email: "david.wilson@student.edu",
    role: "student",
    createdAt: new Date("2024-01-08"),
    lastLogin: new Date("2024-01-17"),
    department: "Chemistry",
    status: "active",
  },
] as const;
