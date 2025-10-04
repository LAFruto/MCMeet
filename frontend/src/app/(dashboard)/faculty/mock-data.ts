/**
 * Mock data for faculty directory
 */

import type { User } from "@/lib/types";

/**
 * Mock user accounts that can be promoted to faculty
 */
export const MOCK_USER_ACCOUNTS: User[] = [
  {
    id: "user-1",
    name: "John Smith",
    email: "john.smith@student.edu",
    emailVerified: true,
    role: "STUDENT",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    lastLogin: new Date("2024-01-20"),
    status: "ACTIVE",
    twoFactorEnabled: false,
    twoFactorVerified: false,
  },
  {
    id: "user-2",
    name: "Sarah Johnson",
    email: "sarah.johnson@student.edu",
    emailVerified: true,
    role: "STUDENT",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    lastLogin: new Date("2024-01-19"),
    department: "Computer Science",
    status: "ACTIVE",
    twoFactorEnabled: false,
    twoFactorVerified: false,
  },
  {
    id: "user-3",
    name: "Michael Chen",
    email: "michael.chen@student.edu",
    emailVerified: true,
    role: "STUDENT",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
    lastLogin: new Date("2024-01-18"),
    department: "Mathematics",
    phone: "+1 (555) 123-4567",
    status: "ACTIVE",
    twoFactorEnabled: false,
    twoFactorVerified: false,
  },
  {
    id: "user-4",
    name: "Emily Davis",
    email: "emily.davis@student.edu",
    emailVerified: true,
    role: "STUDENT",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
    lastLogin: new Date("2024-01-21"),
    department: "Physics",
    phone: "+1 (555) 987-6543",
    status: "ACTIVE",
    twoFactorEnabled: false,
    twoFactorVerified: false,
  },
  {
    id: "user-5",
    name: "David Wilson",
    email: "david.wilson@student.edu",
    emailVerified: true,
    role: "STUDENT",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
    lastLogin: new Date("2024-01-17"),
    department: "Chemistry",
    status: "ACTIVE",
    twoFactorEnabled: false,
    twoFactorVerified: false,
  },
] as const;
