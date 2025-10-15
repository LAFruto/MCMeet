import { prisma } from "../db";
import type { Booking } from "../types";

/**
 * Transforms Prisma Booking model with User relations to Booking type
 * Handles data mapping between database schema and application types
 *
 * @param booking - Booking record with user relations from Prisma
 * @returns {Booking} Transformed booking object
 */
function transformToBooking(booking: any): Booking {
  return {
    id: booking.id,
    title: booking.title,
    description: booking.description || undefined,
    startTime: booking.startTime,
    endTime: booking.endTime,
    location: booking.location || undefined,
    status: booking.status,
    scheduleType: booking.scheduleType,
    purpose: booking.purpose || undefined,
    notes: booking.notes || undefined,
    studentId: booking.studentId,
    student: booking.student
      ? {
          id: booking.student.id,
          name: booking.student.name,
          email: booking.student.email,
          emailVerified: booking.student.emailVerified,
          image: booking.student.image || undefined,
          role: booking.student.role,
          department: booking.student.department || undefined,
          phone: booking.student.phone || undefined,
          status: booking.student.status,
          lastLogin: booking.student.lastLogin || undefined,
          twoFactorEnabled: booking.student.twoFactorEnabled,
          twoFactorSecret: booking.student.twoFactorSecret || undefined,
          twoFactorVerified: booking.student.twoFactorVerified,
          createdAt: booking.student.createdAt,
          updatedAt: booking.student.updatedAt,
        }
      : undefined,
    facultyId: booking.facultyId,
    faculty: booking.faculty
      ? {
          id: booking.faculty.id,
          name: booking.faculty.name,
          email: booking.faculty.email,
          emailVerified: booking.faculty.emailVerified,
          image: booking.faculty.image || undefined,
          role: booking.faculty.role,
          department: booking.faculty.department || undefined,
          phone: booking.faculty.phone || undefined,
          status: booking.faculty.status,
          lastLogin: booking.faculty.lastLogin || undefined,
          twoFactorEnabled: booking.faculty.twoFactorEnabled,
          twoFactorSecret: booking.faculty.twoFactorSecret || undefined,
          twoFactorVerified: booking.faculty.twoFactorVerified,
          createdAt: booking.faculty.createdAt,
          updatedAt: booking.faculty.updatedAt,
        }
      : undefined,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
    cancelledAt: booking.cancelledAt || undefined,
    completedAt: booking.completedAt || undefined,
  };
}

/**
 * Fetches all bookings from the server
 * Server-side function for use in React Server Components
 * Primarily used for admin calendar/sked view
 *
 * @returns {Promise<Booking[]>} Array of all bookings with student and faculty details
 * @throws {Error} If database query fails
 */
export async function getUserBookings(): Promise<Booking[]> {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        student: true,
        faculty: true,
      },
      orderBy: [{ startTime: "asc" }, { createdAt: "desc" }],
    });

    return bookings.map(transformToBooking);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw new Error("Failed to fetch bookings");
  }
}

/**
 * Fetches bookings for a specific user
 * Server-side function for use in React Server Components
 *
 * @param {string} userId - The user ID to fetch bookings for
 * @returns {Promise<Booking[]>} Array of user's bookings
 * @throws {Error} If database query fails
 */
export async function getBookingsForUser(userId: string): Promise<Booking[]> {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [{ studentId: userId }, { facultyId: userId }],
      },
      include: {
        student: true,
        faculty: true,
      },
      orderBy: [{ startTime: "asc" }, { createdAt: "desc" }],
    });

    return bookings.map(transformToBooking);
  } catch (error) {
    console.error(`Error fetching bookings for user ${userId}:`, error);
    throw new Error("Failed to fetch user bookings");
  }
}

/**
 * Fetches a specific booking by ID from the server
 * Server-side function for use in React Server Components
 *
 * @param {string} id - The booking ID to fetch
 * @returns {Promise<Booking | null>} The booking if found, null otherwise
 * @throws {Error} If database query fails
 */
export async function getBookingById(id: string): Promise<Booking | null> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        student: true,
        faculty: true,
      },
    });

    if (!booking) return null;

    return transformToBooking(booking);
  } catch (error) {
    console.error(`Error fetching booking with ID ${id}:`, error);
    return null;
  }
}

/**
 * Fetches bookings within a specific date range
 * Server-side function for use in React Server Components
 *
 * @param {Date} startDate - Start of date range
 * @param {Date} endDate - End of date range
 * @returns {Promise<Booking[]>} Array of bookings in the date range
 * @throws {Error} If database query fails
 */
export async function getBookingsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<Booking[]> {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        AND: [
          {
            startTime: {
              gte: startDate,
            },
          },
          {
            startTime: {
              lte: endDate,
            },
          },
        ],
      },
      include: {
        student: true,
        faculty: true,
      },
      orderBy: [{ startTime: "asc" }, { createdAt: "desc" }],
    });

    return bookings.map(transformToBooking);
  } catch (error) {
    console.error("Error fetching bookings by date range:", error);
    throw new Error("Failed to fetch bookings by date range");
  }
}

/**
 * Fetches bookings for a specific faculty member
 * Server-side function for use in React Server Components
 *
 * @param {string} facultyId - The faculty user ID
 * @returns {Promise<Booking[]>} Array of faculty's bookings
 * @throws {Error} If database query fails
 */
export async function getBookingsForFaculty(
  facultyId: string
): Promise<Booking[]> {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        facultyId,
      },
      include: {
        student: true,
        faculty: true,
      },
      orderBy: [{ startTime: "asc" }, { createdAt: "desc" }],
    });

    return bookings.map(transformToBooking);
  } catch (error) {
    console.error(`Error fetching bookings for faculty ${facultyId}:`, error);
    throw new Error("Failed to fetch faculty bookings");
  }
}

/**
 * Fetches upcoming bookings (future bookings only)
 * Server-side function for use in React Server Components
 *
 * @param {number} limit - Maximum number of bookings to return (default: 10)
 * @returns {Promise<Booking[]>} Array of upcoming bookings
 * @throws {Error} If database query fails
 */
export async function getUpcomingBookings(
  limit: number = 10
): Promise<Booking[]> {
  try {
    const now = new Date();

    const bookings = await prisma.booking.findMany({
      where: {
        startTime: {
          gte: now,
        },
        status: {
          in: ["SCHEDULED", "CONFIRMED"],
        },
      },
      include: {
        student: true,
        faculty: true,
      },
      orderBy: {
        startTime: "asc",
      },
      take: limit,
    });

    return bookings.map(transformToBooking);
  } catch (error) {
    console.error("Error fetching upcoming bookings:", error);
    throw new Error("Failed to fetch upcoming bookings");
  }
}
