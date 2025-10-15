/**
 * Bookings API Route
 * Handles fetching and managing bookings
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  getUserBookings,
  getBookingsForUser,
} from "@/lib/server/booking-server";

/**
 * GET /api/bookings
 * Fetch bookings based on user role
 * - Admins: all bookings
 * - Students/Faculty: their own bookings
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;

    let bookings;
    if (userRole === "ADMIN") {
      // Admins get all bookings
      bookings = await getUserBookings();
    } else {
      // Students and faculty get their own bookings
      bookings = await getBookingsForUser(session.user.id);
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
