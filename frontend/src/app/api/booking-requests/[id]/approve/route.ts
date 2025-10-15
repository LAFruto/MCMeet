/**
 * Approve Booking Request API Route
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    const { id: requestId } = await params;

    // Only faculty and admins can approve requests
    if (userRole !== "FACULTY" && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get the booking request
    const bookingRequest = await prisma.bookingRequest.findUnique({
      where: { id: requestId },
    });

    if (!bookingRequest) {
      return NextResponse.json(
        { error: "Booking request not found" },
        { status: 404 }
      );
    }

    // Verify faculty owns this request
    if (
      userRole === "FACULTY" &&
      bookingRequest.facultyId !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update booking request status
    const updatedRequest = await prisma.bookingRequest.update({
      where: { id: requestId },
      data: {
        status: "APPROVED",
        respondedAt: new Date(),
      },
      include: {
        student: true,
        faculty: true,
      },
    });

    // Create actual booking from the approved request
    await prisma.booking.create({
      data: {
        title: updatedRequest.title,
        description: updatedRequest.description,
        startTime: updatedRequest.startTime,
        endTime: updatedRequest.endTime,
        location: updatedRequest.location,
        status: "CONFIRMED",
        scheduleType: "MEETING",
        purpose: updatedRequest.purpose,
        studentId: updatedRequest.studentId,
        facultyId: updatedRequest.facultyId,
      },
    });

    return NextResponse.json({
      success: true,
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error approving booking request:", error);
    return NextResponse.json(
      { error: "Failed to approve booking request" },
      { status: 500 }
    );
  }
}
