import {
  PrismaClient,
  UserRole,
  UserStatus,
  MeetingStatus,
  ScheduleType,
  ChatMessageType,
  BookingStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding MCMeet booking system database...");

  // Clear existing data (if tables exist)
  try {
    await prisma.chatMessage.deleteMany();
    await prisma.chatSession.deleteMany();
    await prisma.bookingRequest.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.officeHours.deleteMany();
    await prisma.faculty.deleteMany();
    await prisma.department.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.log("ℹ️  Tables don't exist yet, skipping data clearing...");
  }

  // Create departments
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: "Computer Science",
        description: "Department of Computer Science and Engineering",
      },
    }),
    prisma.department.create({
      data: {
        name: "Mathematics",
        description: "Department of Mathematics and Statistics",
      },
    }),
    prisma.department.create({
      data: {
        name: "Physics",
        description: "Department of Physics and Astronomy",
      },
    }),
    prisma.department.create({
      data: {
        name: "Engineering",
        description: "Department of Engineering",
      },
    }),
  ]);

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      id: "admin-001",
      name: "Admin User",
      email: "admin@university.edu",
      emailVerified: true,
      role: UserRole.ADMIN,
      department: "Administration",
      phone: "+1 (555) 000-0000",
      status: UserStatus.ACTIVE,
      lastLogin: new Date(),
    },
  });

  // Create faculty users
  const facultyUsers = await Promise.all([
    prisma.user.create({
      data: {
        id: "faculty-001",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@university.edu",
        emailVerified: true,
        role: UserRole.FACULTY,
        department: "Computer Science",
        phone: "+1 (555) 123-4567",
        status: UserStatus.ACTIVE,
        lastLogin: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: "faculty-002",
        name: "Prof. Michael Chen",
        email: "michael.chen@university.edu",
        emailVerified: true,
        role: UserRole.FACULTY,
        department: "Mathematics",
        phone: "+1 (555) 234-5678",
        status: UserStatus.ACTIVE,
        lastLogin: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: "faculty-003",
        name: "Dr. Emily Rodriguez",
        email: "emily.rodriguez@university.edu",
        emailVerified: true,
        role: UserRole.FACULTY,
        department: "Physics",
        phone: "+1 (555) 345-6789",
        status: UserStatus.ACTIVE,
        lastLogin: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: "faculty-004",
        name: "Prof. David Kim",
        email: "david.kim@university.edu",
        emailVerified: true,
        role: UserRole.FACULTY,
        department: "Engineering",
        phone: "+1 (555) 456-7890",
        status: UserStatus.ACTIVE,
        lastLogin: new Date(),
      },
    }),
  ]);

  // Create student users
  const studentUsers = await Promise.all([
    prisma.user.create({
      data: {
        id: "student-001",
        name: "John Doe",
        email: "john.doe@university.edu",
        emailVerified: true,
        role: UserRole.STUDENT,
        department: "Computer Science",
        phone: "+1 (555) 111-2222",
        status: UserStatus.ACTIVE,
        lastLogin: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: "student-002",
        name: "Jane Smith",
        email: "jane.smith@university.edu",
        emailVerified: true,
        role: UserRole.STUDENT,
        department: "Mathematics",
        phone: "+1 (555) 222-3333",
        status: UserStatus.ACTIVE,
        lastLogin: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: "student-003",
        name: "Alex Wilson",
        email: "alex.wilson@university.edu",
        emailVerified: true,
        role: UserRole.STUDENT,
        department: "Physics",
        phone: "+1 (555) 333-4444",
        status: UserStatus.ACTIVE,
        lastLogin: new Date(),
      },
    }),
  ]);

  // Create faculty profiles
  const facultyProfiles = await Promise.all([
    prisma.faculty.create({
      data: {
        userId: facultyUsers[0].id,
        department: "Computer Science",
        position: "Associate Professor",
        specializations: [
          "Machine Learning",
          "Data Science",
          "Artificial Intelligence",
        ],
        office: "Room 201",
        availability: "Mon-Fri, 9AM-5PM",
        status: "Available",
        bio: "Dr. Sarah Johnson specializes in machine learning and data science applications.",
      },
    }),
    prisma.faculty.create({
      data: {
        userId: facultyUsers[1].id,
        department: "Mathematics",
        position: "Professor",
        specializations: ["Calculus", "Statistics", "Linear Algebra"],
        office: "Room 305",
        availability: "Mon-Wed-Fri, 10AM-4PM",
        status: "Busy",
        bio: "Prof. Michael Chen is an expert in mathematical analysis and statistics.",
      },
    }),
    prisma.faculty.create({
      data: {
        userId: facultyUsers[2].id,
        department: "Physics",
        position: "Assistant Professor",
        specializations: ["Quantum Physics", "Thermodynamics", "Mechanics"],
        office: "Room 150",
        availability: "Tue-Thu, 8AM-6PM",
        status: "Available",
        bio: "Dr. Emily Rodriguez focuses on quantum physics research and applications.",
      },
    }),
    prisma.faculty.create({
      data: {
        userId: facultyUsers[3].id,
        department: "Engineering",
        position: "Professor",
        specializations: ["Robotics", "Control Systems", "Automation"],
        office: "Room 420",
        availability: "Wed-Fri, 9AM-11AM",
        status: "Available",
        bio: "Prof. David Kim is a leading expert in robotics and control systems.",
      },
    }),
  ]);

  // Create office hours for faculty
  const officeHoursData = [
    // Dr. Sarah Johnson - Mon-Fri, 9AM-5PM
    {
      facultyId: facultyProfiles[0].id,
      dayOfWeek: "Monday",
      startTime: "09:00",
      endTime: "17:00",
    },
    {
      facultyId: facultyProfiles[0].id,
      dayOfWeek: "Tuesday",
      startTime: "09:00",
      endTime: "17:00",
    },
    {
      facultyId: facultyProfiles[0].id,
      dayOfWeek: "Wednesday",
      startTime: "09:00",
      endTime: "17:00",
    },
    {
      facultyId: facultyProfiles[0].id,
      dayOfWeek: "Thursday",
      startTime: "09:00",
      endTime: "17:00",
    },
    {
      facultyId: facultyProfiles[0].id,
      dayOfWeek: "Friday",
      startTime: "09:00",
      endTime: "17:00",
    },

    // Prof. Michael Chen - Mon-Wed-Fri, 10AM-4PM
    {
      facultyId: facultyProfiles[1].id,
      dayOfWeek: "Monday",
      startTime: "10:00",
      endTime: "16:00",
    },
    {
      facultyId: facultyProfiles[1].id,
      dayOfWeek: "Wednesday",
      startTime: "10:00",
      endTime: "16:00",
    },
    {
      facultyId: facultyProfiles[1].id,
      dayOfWeek: "Friday",
      startTime: "10:00",
      endTime: "16:00",
    },

    // Dr. Emily Rodriguez - Tue-Thu, 8AM-6PM
    {
      facultyId: facultyProfiles[2].id,
      dayOfWeek: "Tuesday",
      startTime: "08:00",
      endTime: "18:00",
    },
    {
      facultyId: facultyProfiles[2].id,
      dayOfWeek: "Thursday",
      startTime: "08:00",
      endTime: "18:00",
    },

    // Prof. David Kim - Wed-Fri, 9AM-11AM
    {
      facultyId: facultyProfiles[3].id,
      dayOfWeek: "Wednesday",
      startTime: "09:00",
      endTime: "11:00",
    },
    {
      facultyId: facultyProfiles[3].id,
      dayOfWeek: "Friday",
      startTime: "09:00",
      endTime: "11:00",
    },
  ];

  await Promise.all(
    officeHoursData.map((data) => prisma.officeHours.create({ data }))
  );

  // Create meetings
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(now);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  const bookings = await Promise.all([
    // Today's bookings
    prisma.booking.create({
      data: {
        title: "Academic Advisory Meeting",
        description: "Student-faculty meeting for academic guidance",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          9,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          9,
          30
        ),
        location: "Online",
        status: MeetingStatus.SCHEDULED,
        scheduleType: ScheduleType.MEETING,
        purpose: "Daily team sync",
        studentId: studentUsers[0].id,
        facultyId: facultyUsers[0].id,
      },
    }),
    prisma.booking.create({
      data: {
        title: "Thesis Consultation Booking",
        description: "Scheduled meeting to review thesis draft chapters 1-3",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          14,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          15,
          0
        ),
        location: "Room 201",
        status: MeetingStatus.SCHEDULED,
        scheduleType: ScheduleType.MEETING,
        purpose: "Review thesis draft chapters 1-3",
        studentId: studentUsers[0].id,
        facultyId: facultyUsers[1].id,
      },
    }),

    // Tomorrow's meetings
    prisma.booking.create({
      data: {
        title: "Course Selection Booking",
        description: "Scheduled appointment for course selection guidance",
        startTime: new Date(
          tomorrow.getFullYear(),
          tomorrow.getMonth(),
          tomorrow.getDate(),
          10,
          0
        ),
        endTime: new Date(
          tomorrow.getFullYear(),
          tomorrow.getMonth(),
          tomorrow.getDate(),
          11,
          30
        ),
        location: "Room 305",
        status: MeetingStatus.SCHEDULED,
        scheduleType: ScheduleType.MEETING,
        purpose: "Course selection guidance for next semester",
        studentId: studentUsers[0].id,
        facultyId: facultyUsers[1].id,
      },
    }),
    prisma.booking.create({
      data: {
        title: "Lab Training Session Booking",
        description: "Scheduled training session for new lab equipment",
        startTime: new Date(
          tomorrow.getFullYear(),
          tomorrow.getMonth(),
          tomorrow.getDate(),
          13,
          0
        ),
        endTime: new Date(
          tomorrow.getFullYear(),
          tomorrow.getMonth(),
          tomorrow.getDate(),
          14,
          0
        ),
        location: "Lab 150",
        status: MeetingStatus.SCHEDULED,
        scheduleType: ScheduleType.EVENT,
        purpose: "Introduction to new lab equipment",
        studentId: studentUsers[0].id,
        facultyId: facultyUsers[2].id,
      },
    }),

    // Day after tomorrow
    prisma.booking.create({
      data: {
        title: "Research Presentation Booking",
        description: "Scheduled presentation of research findings to committee",
        startTime: new Date(
          dayAfterTomorrow.getFullYear(),
          dayAfterTomorrow.getMonth(),
          dayAfterTomorrow.getDate(),
          15,
          0
        ),
        endTime: new Date(
          dayAfterTomorrow.getFullYear(),
          dayAfterTomorrow.getMonth(),
          dayAfterTomorrow.getDate(),
          16,
          30
        ),
        location: "Conference Room A",
        status: MeetingStatus.SCHEDULED,
        scheduleType: ScheduleType.EVENT,
        purpose: "Present research findings to committee",
        studentId: studentUsers[0].id,
        facultyId: facultyUsers[0].id,
      },
    }),
  ]);

  // Create chat sessions
  const chatSessions = await Promise.all([
    prisma.chatSession.create({
      data: {
        userId: studentUsers[0].id,
        title: "General Chat",
        isActive: true,
        context: { page: "home", data: {} },
        lastMessageAt: new Date(),
      },
    }),
    prisma.chatSession.create({
      data: {
        userId: studentUsers[1].id,
        title: "Math Help",
        isActive: true,
        context: { page: "faculty", data: { facultyId: facultyUsers[1].id } },
        lastMessageAt: new Date(),
      },
    }),
  ]);

  // Create chat messages
  const chatMessages = await Promise.all([
    prisma.chatMessage.create({
      data: {
        sessionId: chatSessions[0].id,
        senderId: studentUsers[0].id,
        content: "Hello! I need help scheduling a meeting with Dr. Johnson.",
        type: ChatMessageType.TEXT,
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        sessionId: chatSessions[0].id,
        senderId: adminUser.id, // Use admin user as system sender
        content:
          "I can help you book an appointment with Dr. Johnson. What time would work best for you?",
        type: ChatMessageType.SYSTEM,
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        sessionId: chatSessions[1].id,
        senderId: studentUsers[1].id,
        content:
          "I need help with calculus homework. Can I book office hours with Prof. Chen?",
        type: ChatMessageType.TEXT,
        isRead: true,
      },
    }),
  ]);

  // Create booking requests
  const bookingRequests = await Promise.all([
    prisma.bookingRequest.create({
      data: {
        studentId: studentUsers[0].id,
        facultyId: facultyUsers[0].id,
        title: "Research Discussion",
        description: "Need to discuss research methodology for thesis",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 3,
          10,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 3,
          11,
          0
        ),
        location: "Room 201",
        purpose: "Research methodology discussion",
        status: BookingStatus.PENDING,
      },
    }),
    prisma.bookingRequest.create({
      data: {
        studentId: studentUsers[1].id,
        facultyId: facultyUsers[1].id,
        title: "Math Tutoring",
        description: "Need help with advanced calculus problems",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 2,
          14,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 2,
          15,
          0
        ),
        location: "Room 305",
        purpose: "Advanced calculus tutoring",
        status: BookingStatus.APPROVED,
        respondedAt: new Date(),
      },
    }),
  ]);

  console.log("✅ Database seeded successfully!");
  console.log(`📊 Created:`);
  console.log(`   - ${departments.length} departments`);
  console.log(
    `   - ${facultyUsers.length + studentUsers.length + 1} users (${
      facultyUsers.length
    } faculty, ${studentUsers.length} students, 1 admin)`
  );
  console.log(`   - ${facultyProfiles.length} faculty profiles`);
  console.log(`   - ${officeHoursData.length} office hours entries`);
  console.log(`   - ${bookings.length} bookings`);
  console.log(`   - ${chatSessions.length} chat sessions`);
  console.log(`   - ${chatMessages.length} chat messages`);
  console.log(`   - ${bookingRequests.length} booking requests`);

  console.log("\n🔐 Test Accounts:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Admin: admin@university.edu (monitor bookings via Sked/Agenda)");
  console.log(
    "Faculty: sarah.johnson@university.edu, michael.chen@university.edu (pre-approved)"
  );
  console.log(
    "Students: john.doe@university.edu, jane.smith@university.edu (create bookings via chatbot)"
  );
  console.log("\n💡 Use Better Auth's password reset flow to set passwords");
  console.log(
    "🤖 Students can book appointments through the chatbot interface"
  );
  console.log(
    "👨‍💼 Admins can monitor and manage bookings via Sked and Agenda views"
  );
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
