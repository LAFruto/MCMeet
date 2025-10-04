import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "./auth";

/**
 * Authorization helpers for MCMeet
 * Centralized role-based access control (RBAC) utilities
 */

export interface AuthSession {
  user: {
    id: string;
    email: string;
    name: string;
    role?: string;
    twoFactorEnabled?: boolean;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
}

/**
 * Check if user is an admin
 */
export function isAdmin(session: AuthSession | null): boolean {
  return session?.user?.role === "admin";
}

/**
 * Check if user is a student
 */
export function isStudent(session: AuthSession | null): boolean {
  return session?.user?.role === "student";
}

/**
 * Check if user can book for a specific student
 * Admins can book for anyone, students can only book for themselves
 */
export function canBookFor(
  session: AuthSession | null,
  studentId: string
): boolean {
  if (!session) return false;
  return isAdmin(session) || session.user.id === studentId;
}

/**
 * Check if user can manage faculty
 * Only admins can manage faculty
 */
export function canManageFaculty(session: AuthSession | null): boolean {
  return isAdmin(session);
}

/**
 * Check if user can view all bookings
 * Only admins can view all bookings
 */
export function canViewAllBookings(session: AuthSession | null): boolean {
  return isAdmin(session);
}

/**
 * Assert that user has specific role
 * Throws error if role doesn't match
 */
export function assertRole(
  session: AuthSession | null,
  role: "admin" | "student"
): void {
  if (!session) {
    throw new Error("Unauthorized: No session");
  }
  if (session.user.role !== role) {
    throw new Error(`Unauthorized: requires ${role} role`);
  }
}

/**
 * Get current session or redirect to login
 * Use in server components and server actions
 */
export async function getRequiredSession(): Promise<AuthSession> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session as AuthSession;
}

/**
 * Get admin session or redirect
 * Ensures user is authenticated AND is an admin
 */
export async function getAdminSession(): Promise<AuthSession> {
  const session = await getRequiredSession();

  if (!isAdmin(session)) {
    redirect("/");
  }

  return session;
}

/**
 * Get admin session with 2FA verification
 * Use for sensitive admin operations
 */
export async function getAdminSessionWith2FA(): Promise<AuthSession> {
  const session = await getAdminSession();

  if (session.user.twoFactorEnabled && !session.user.twoFactorEnabled) {
    redirect("/admin/setup-2fa");
  }

  return session;
}

/**
 * Get student session or redirect
 * Ensures user is authenticated AND is a student
 */
export async function getStudentSession(): Promise<AuthSession> {
  const session = await getRequiredSession();

  if (!isStudent(session)) {
    redirect("/");
  }

  return session;
}

/**
 * Get optional session (doesn't redirect)
 * Use when session is optional but you want to check roles
 */
export async function getOptionalSession(): Promise<AuthSession | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session as AuthSession | null;
  } catch (error) {
    return null;
  }
}
