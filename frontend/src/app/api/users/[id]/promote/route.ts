/**
 * Promote User to Faculty API Route
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

    // Only admins can promote users
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: userId } = await params;
    const body = await request.json();
    const {
      position,
      phone,
      officeHours,
      availableDays,
      specializations,
      department,
    } = body;

    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has a faculty profile
    const existingFaculty = await prisma.faculty.findUnique({
      where: { userId },
    });

    if (existingFaculty) {
      return NextResponse.json(
        { error: "User is already a faculty member" },
        { status: 400 }
      );
    }

    // Build availability string from days and hours
    const availability =
      availableDays && officeHours?.start && officeHours?.end
        ? `${availableDays.join(", ")}, ${officeHours.start}-${officeHours.end}`
        : "Mon-Fri, 9AM-5PM";

    // Update user role to FACULTY
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: "FACULTY",
        phone: phone || user.phone,
        department:
          department ||
          user.department ||
          "CCIS - College of Computing and Information Sciences",
      },
    });

    // Create faculty profile
    const faculty = await prisma.faculty.create({
      data: {
        userId,
        department:
          department ||
          user.department ||
          "CCIS - College of Computing and Information Sciences",
        position: position || "Professor",
        specializations: specializations || [],
        availability,
        status: "Available",
        isApproved: true, // Auto-approve when promoted by admin
        approvedAt: new Date(),
        approvedBy: session.user.id,
      },
    });

    // Create office hours if provided
    if (
      availableDays &&
      availableDays.length > 0 &&
      officeHours?.start &&
      officeHours?.end
    ) {
      const officeHoursData = availableDays.map((day: string) => ({
        facultyId: faculty.id,
        dayOfWeek: day,
        startTime: officeHours.start,
        endTime: officeHours.end,
        isActive: true,
      }));

      await prisma.officeHours.createMany({
        data: officeHoursData,
      });
    }

    return NextResponse.json({
      success: true,
      faculty,
    });
  } catch (error) {
    console.error("Error promoting user to faculty:", error);
    return NextResponse.json(
      { error: "Failed to promote user to faculty" },
      { status: 500 }
    );
  }
}
