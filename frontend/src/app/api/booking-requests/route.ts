/**
 * Booking Requests API Route
 * Handles fetching booking requests for the current user
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import type { BookingRequest as PrismaBookingRequest } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userRole = (session.user as any).role;

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");

    // Build where clause based on user role
    let whereClause: any = {};

    if (userRole === "ADMIN") {
      // Admins see all requests
      whereClause = status ? { status: status.toUpperCase() } : {};
    } else if (userRole === "FACULTY") {
      // Faculty see requests for their appointments
      whereClause = {
        facultyId: userId,
        ...(status ? { status: status.toUpperCase() } : {}),
      };
    } else {
      // Students see their own requests
      whereClause = {
        studentId: userId,
        ...(status ? { status: status.toUpperCase() } : {}),
      };
    }

    // Fetch booking requests
    const requests = await prisma.bookingRequest.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
        faculty: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }],
    });

    // Transform to API format
    const formattedRequests = requests.map((req) => ({
      id: req.id,
      studentId: req.studentId,
      studentName: req.student.name,
      studentEmail: req.student.email,
      facultyId: req.facultyId,
      facultyName: req.faculty.name,
      facultyEmail: req.faculty.email,
      title: req.title,
      description: req.description,
      startTime: req.startTime,
      endTime: req.endTime,
      location: req.location,
      purpose: req.purpose,
      status: req.status.toLowerCase(),
      notes: req.notes,
      createdAt: req.createdAt,
      respondedAt: req.respondedAt,
    }));

    return NextResponse.json(formattedRequests);
  } catch (error) {
    console.error("Error fetching booking requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking requests" },
      { status: 500 }
    );
  }
}
