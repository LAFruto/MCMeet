import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { canBookFor, canViewAllBookings } from "@/lib/authz";
import {
  checkBookingRateLimit,
  createRateLimitHeaders,
} from "@/lib/rate-limit";

/**
 * Bookings API endpoint with authorization and rate limiting
 * GET /api/bookings - List bookings
 * POST /api/bookings - Create booking
 */

/**
 * GET /api/bookings
 * Students see their own bookings, admins see all
 */
export async function GET(request: NextRequest) {
  try {
    // Get session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please sign in" },
        { status: 401 }
      );
    }

    // Check rate limit
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const rateLimitResult = await checkBookingRateLimit(session.user.id, ip);
    const responseHeaders = createRateLimitHeaders(rateLimitResult);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429, headers: responseHeaders }
      );
    }

    // TODO: Fetch bookings from database
    // If admin, fetch all; if student, fetch only their own
    const isAdmin = canViewAllBookings(session as any);

    const mockBookings = [
      {
        id: 1,
        studentId: session.user.id,
        facultyId: 1,
        date: "2024-10-10",
        startTime: "14:00",
        endTime: "15:00",
        status: "scheduled",
      },
    ];

    return NextResponse.json(
      { success: true, data: mockBookings },
      { headers: responseHeaders }
    );
  } catch (error) {
    console.error("GET bookings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/bookings
 * Create a new booking with authorization checks
 */
export async function POST(request: NextRequest) {
  try {
    // Get session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please sign in" },
        { status: 401 }
      );
    }

    // Check rate limit
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const rateLimitResult = await checkBookingRateLimit(session.user.id, ip);
    const responseHeaders = createRateLimitHeaders(rateLimitResult);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429, headers: responseHeaders }
      );
    }

    // Parse and validate request
    const body = await request.json();
    const { studentId, facultyId, date, startTime, endTime, purpose } = body;

    // Validate required fields
    if (!studentId || !facultyId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers: responseHeaders }
      );
    }

    // Authorization check: can user book for this student?
    if (!canBookFor(session as any, studentId)) {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "You can only book for yourself unless you're an admin",
        },
        { status: 403, headers: responseHeaders }
      );
    }

    // TODO: Create booking in database
    // - Validate faculty exists and is available
    // - Check for time slot conflicts (use unique constraint)
    // - Send email notification

    const mockBooking = {
      id: Date.now(),
      studentId,
      facultyId,
      date,
      startTime,
      endTime,
      purpose,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    };

    // TODO: Send email notification
    // import { sendMail, emailTemplates } from "@/lib/mailer";
    // const template = emailTemplates.bookingConfirmation({...});
    // await sendMail({ to: session.user.email, ...template });

    return NextResponse.json(
      { success: true, data: mockBooking },
      { status: 201, headers: responseHeaders }
    );
  } catch (error) {
    console.error("POST booking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
