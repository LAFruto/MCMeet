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
    await prisma.account.deleteMany();
    await prisma.department.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.log("ℹ️  Tables don't exist yet, skipping data clearing...");
  }

  // Create departments
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: "CCIS - College of Computing and Information Sciences",
        description: "College of Computing and Information Sciences",
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
      email: "admin@mcm.edu.ph",
      emailVerified: true,
      role: UserRole.ADMIN,
      department: "Administration",
      phone: "+63 99 000 0000",
      status: UserStatus.ACTIVE,
      lastLogin: new Date(),
    },
  });

  // Create faculty users
  const facultyUsers = await Promise.all([
    // New professors based on course subjects from images
    prisma.user.create({
      data: {
        id: "faculty-001",
        name: "Dr. Warren Badong",
        email: "wbadong@mcm.edu.ph",
        emailVerified: true,
        role: UserRole.FACULTY,
        department: "CCIS - College of Computing and Information Sciences",
        phone: "+63 99 123 4567",
        status: UserStatus.ACTIVE,
        lastLogin: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: "faculty-002",
        name: "Dr. Neil P. Magloyuan",
        email: "npmagloyuan@mcm.edu.ph",
        emailVerified: true,
        role: UserRole.FACULTY,
        department: "CCIS - College of Computing and Information Sciences",
        phone: "+63 99 234 5678",
        status: UserStatus.ACTIVE,
        lastLogin: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: "faculty-003",
        name: "Dr. Daisy Ann Arzaga",
        email: "daarzaga@mcm.edu.ph",
        emailVerified: true,
        role: UserRole.FACULTY,
        department: "CCIS - College of Computing and Information Sciences",
        phone: "+63 99 345 6789",
        status: UserStatus.ACTIVE,
        lastLogin: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: "faculty-004",
        name: "Dr. Rogelio Badiang",
        email: "rbadiang@mcm.edu.ph",
        emailVerified: true,
        role: UserRole.FACULTY,
        department: "CCIS - College of Computing and Information Sciences",
        phone: "+63 99 456 7890",
        status: UserStatus.ACTIVE,
        lastLogin: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: "faculty-005",
        name: "Dr. Patrick Cerna",
        email: "pcerna@mcm.edu.ph",
        emailVerified: true,
        role: UserRole.FACULTY,
        department: "CCIS - College of Computing and Information Sciences",
        phone: "+63 99 567 8901",
        status: UserStatus.ACTIVE,
        lastLogin: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: "faculty-006",
        name: "Dr. Christopher Rey Lungay",
        email: "crlungay@mcm.edu.ph",
        emailVerified: true,
        role: UserRole.FACULTY,
        department: "Information Technology",
        phone: "+63 99 678 9012",
        status: UserStatus.ACTIVE,
        lastLogin: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: "faculty-007",
        name: "Dr. Martzel Baste",
        email: "mbaste@mcm.edu.ph",
        emailVerified: true,
        role: UserRole.FACULTY,
        department: "CCIS - College of Computing and Information Sciences",
        phone: "+63 99 789 0123",
        status: UserStatus.ACTIVE,
        lastLogin: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: "faculty-008",
        name: "Dr. Genevieve Pilongo",
        email: "gpilongo@mcm.edu.ph",
        emailVerified: true,
        role: UserRole.FACULTY,
        department: "CCIS - College of Computing and Information Sciences",
        phone: "+63 99 890 1234",
        status: UserStatus.ACTIVE,
        lastLogin: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: "faculty-009",
        name: "Dr. Cherry Lisondra",
        email: "clisondra@mcm.edu.ph",
        emailVerified: true,
        role: UserRole.FACULTY,
        department: "CCIS - College of Computing and Information Sciences",
        phone: "+63 99 901 2345",
        status: UserStatus.ACTIVE,
        lastLogin: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: "faculty-010",
        name: "Dr. Rhodessa Cascaro",
        email: "rcascaro@mcm.edu.ph",
        emailVerified: true,
        role: UserRole.FACULTY,
        department: "CCIS - College of Computing and Information Sciences",
        phone: "+63 99 012 3456",
        status: UserStatus.ACTIVE,
        lastLogin: new Date(),
      },
    }),
  ]);

  // Note: Faculty accounts are created separately using the register-faculty script
  // Run: pnpm register-faculty after seeding to create faculty login accounts

  // Create student users
  const studentUsers = await Promise.all([
    prisma.user.create({
      data: {
        id: "student-001",
        name: "Maria Santos",
        email: "msantos@mcm.edu.ph",
        emailVerified: true,
        role: UserRole.STUDENT,
        department: "CCIS - College of Computing and Information Sciences",
        phone: "+63 99 111 2222",
        status: UserStatus.ACTIVE,
        lastLogin: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: "student-002",
        name: "Jose Garcia",
        email: "jgarcia@mcm.edu.ph",
        emailVerified: true,
        role: UserRole.STUDENT,
        department: "CCIS - College of Computing and Information Sciences",
        phone: "+63 99 222 3333",
        status: UserStatus.ACTIVE,
        lastLogin: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        id: "student-003",
        name: "Ana Cruz",
        email: "acruz@mcm.edu.ph",
        emailVerified: true,
        role: UserRole.STUDENT,
        department: "CCIS - College of Computing and Information Sciences",
        phone: "+63 99 333 4444",
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
        department: "CCIS - College of Computing and Information Sciences",
        position: "Professor",
        specializations: [
          "CCNA Routing and Switching",
          "Network Administration",
          "Cisco Technologies",
        ],
        office: "Faculty Room",
        availability: "Mon-Fri, 9AM-5PM",
        status: "Available",
        bio: "Dr. Warren Badong specializes in network technologies and CCNA routing and switching.",
        isApproved: true,
      },
    }),
    prisma.faculty.create({
      data: {
        userId: facultyUsers[1].id,
        department: "CCIS - College of Computing and Information Sciences",
        position: "Program Head",
        specializations: [
          "Thesis Writing",
          "Research Methodology",
          "Academic Writing",
        ],
        office: "Faculty Room",
        availability: "Mon-Wed-Fri, 10AM-4PM",
        status: "Available",
        bio: "Dr. Neil P. Magloyuan is the Program Head and expert in thesis guidance and research methodology.",
        isApproved: true,
      },
    }),
    prisma.faculty.create({
      data: {
        userId: facultyUsers[2].id,
        department: "CCIS - College of Computing and Information Sciences",
        position: "Professor",
        specializations: [
          "Intelligent Systems",
          "Artificial Intelligence",
          "Machine Learning",
        ],
        office: "Room 400",
        availability: "Tue-Thu, 8AM-6PM",
        status: "Available",
        bio: "Dr. Daisy Ann Arzaga focuses on intelligent systems and AI applications.",
        isApproved: true,
      },
    }),
    prisma.faculty.create({
      data: {
        userId: facultyUsers[3].id,
        department: "CCIS - College of Computing and Information Sciences",
        position: "Professor",
        specializations: [
          "Intelligent Systems",
          "Neural Networks",
          "Deep Learning",
        ],
        office: "Room 400",
        availability: "Wed-Fri, 9AM-11AM",
        status: "Available",
        bio: "Dr. Rogelio Badiang specializes in intelligent systems and neural networks.",
        isApproved: true,
      },
    }),
    prisma.faculty.create({
      data: {
        userId: facultyUsers[4].id,
        department: "CCIS - College of Computing and Information Sciences",
        position: "Professor",
        specializations: [
          "Data Science",
          "Software Engineering",
          "Database Systems",
        ],
        office: "Room 600",
        availability: "Mon-Fri, 8AM-4PM",
        status: "Available",
        bio: "Dr. Patrick Cerna is an expert in data science and software engineering.",
        isApproved: true,
      },
    }),
    prisma.faculty.create({
      data: {
        userId: facultyUsers[5].id,
        department: "Information Technology",
        position: "Professor",
        specializations: [
          "IT Infrastructure",
          "Network Technologies",
          "System Administration",
        ],
        office: "Cisco Lab",
        availability: "Mon-Wed-Fri, 9AM-3PM",
        status: "Available",
        bio: "Dr. Christopher Rey Lungay specializes in IT infrastructure and network technologies.",
        isApproved: true,
      },
    }),
    prisma.faculty.create({
      data: {
        userId: facultyUsers[6].id,
        department: "CCIS - College of Computing and Information Sciences",
        position: "Professor",
        specializations: ["Data Structures", "Algorithms", "Programming"],
        office: "Room 400",
        availability: "Tue-Thu, 10AM-6PM",
        status: "Available",
        bio: "Dr. Martzel Baste focuses on data structures and algorithm design.",
        isApproved: true,
      },
    }),
    prisma.faculty.create({
      data: {
        userId: facultyUsers[7].id,
        department: "CCIS - College of Computing and Information Sciences",
        position: "Professor",
        specializations: [
          "Object-Oriented Programming",
          "Software Design",
          "Java Programming",
        ],
        office: "Room 600",
        availability: "Mon-Fri, 9AM-5PM",
        status: "Available",
        bio: "Dr. Genevieve Pilongo specializes in object-oriented programming and software design.",
        isApproved: true,
      },
    }),
    prisma.faculty.create({
      data: {
        userId: facultyUsers[8].id,
        department: "CCIS - College of Computing and Information Sciences",
        position: "Professor",
        specializations: [
          "Computer Systems",
          "Operating Systems",
          "System Architecture",
        ],
        office: "Room 400",
        availability: "Mon-Wed-Fri, 8AM-4PM",
        status: "Available",
        bio: "Dr. Cherry Lisondra focuses on computer systems and operating systems.",
        isApproved: true,
      },
    }),
    prisma.faculty.create({
      data: {
        userId: facultyUsers[9].id,
        department: "CCIS - College of Computing and Information Sciences",
        position: "Dean",
        specializations: [
          "Academic Administration",
          "Strategic Planning",
          "Faculty Development",
        ],
        office: "Dean's Office, Room 100",
        availability: "Mon-Fri, 8AM-5PM",
        status: "Available",
        bio: "Dr. Rhodessa Cascaro is the Dean of the Computer Science Department, overseeing academic programs and faculty development.",
        isApproved: true,
      },
    }),
  ]);

  // Create office hours for faculty
  const officeHoursData = [
    // Dr. Warren Badong - Mon-Fri, 9AM-5PM
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

    // Dr. Neil P. Magloyuan - Mon-Wed-Fri, 10AM-4PM
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

    // Dr. Daisy Ann Arzaga - Tue-Thu, 8AM-6PM
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

    // Dr. Rogelio Badiang - Wed-Fri, 9AM-11AM
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

    // Dr. Patrick Cerna - Mon-Fri, 8AM-4PM
    {
      facultyId: facultyProfiles[4].id,
      dayOfWeek: "Monday",
      startTime: "08:00",
      endTime: "16:00",
    },
    {
      facultyId: facultyProfiles[4].id,
      dayOfWeek: "Tuesday",
      startTime: "08:00",
      endTime: "16:00",
    },
    {
      facultyId: facultyProfiles[4].id,
      dayOfWeek: "Wednesday",
      startTime: "08:00",
      endTime: "16:00",
    },
    {
      facultyId: facultyProfiles[4].id,
      dayOfWeek: "Thursday",
      startTime: "08:00",
      endTime: "16:00",
    },
    {
      facultyId: facultyProfiles[4].id,
      dayOfWeek: "Friday",
      startTime: "08:00",
      endTime: "16:00",
    },

    // Dr. Christopher Rey Lungay - Mon-Wed-Fri, 9AM-3PM
    {
      facultyId: facultyProfiles[5].id,
      dayOfWeek: "Monday",
      startTime: "09:00",
      endTime: "15:00",
    },
    {
      facultyId: facultyProfiles[5].id,
      dayOfWeek: "Wednesday",
      startTime: "09:00",
      endTime: "15:00",
    },
    {
      facultyId: facultyProfiles[5].id,
      dayOfWeek: "Friday",
      startTime: "09:00",
      endTime: "15:00",
    },

    // Dr. Martzel Baste - Tue-Thu, 10AM-6PM
    {
      facultyId: facultyProfiles[6].id,
      dayOfWeek: "Tuesday",
      startTime: "10:00",
      endTime: "18:00",
    },
    {
      facultyId: facultyProfiles[6].id,
      dayOfWeek: "Thursday",
      startTime: "10:00",
      endTime: "18:00",
    },

    // Dr. Genevieve Pilongo - Mon-Fri, 9AM-5PM
    {
      facultyId: facultyProfiles[7].id,
      dayOfWeek: "Monday",
      startTime: "09:00",
      endTime: "17:00",
    },
    {
      facultyId: facultyProfiles[7].id,
      dayOfWeek: "Tuesday",
      startTime: "09:00",
      endTime: "17:00",
    },
    {
      facultyId: facultyProfiles[7].id,
      dayOfWeek: "Wednesday",
      startTime: "09:00",
      endTime: "17:00",
    },
    {
      facultyId: facultyProfiles[7].id,
      dayOfWeek: "Thursday",
      startTime: "09:00",
      endTime: "17:00",
    },
    {
      facultyId: facultyProfiles[7].id,
      dayOfWeek: "Friday",
      startTime: "09:00",
      endTime: "17:00",
    },

    // Dr. Cherry Lisondra - Mon-Wed-Fri, 8AM-4PM
    {
      facultyId: facultyProfiles[8].id,
      dayOfWeek: "Monday",
      startTime: "08:00",
      endTime: "16:00",
    },
    {
      facultyId: facultyProfiles[8].id,
      dayOfWeek: "Wednesday",
      startTime: "08:00",
      endTime: "16:00",
    },
    {
      facultyId: facultyProfiles[8].id,
      dayOfWeek: "Friday",
      startTime: "08:00",
      endTime: "16:00",
    },

    // Dr. Rhodessa Cascaro (Dean) - Mon-Fri, 8AM-5PM
    {
      facultyId: facultyProfiles[9].id,
      dayOfWeek: "Monday",
      startTime: "08:00",
      endTime: "17:00",
    },
    {
      facultyId: facultyProfiles[9].id,
      dayOfWeek: "Tuesday",
      startTime: "08:00",
      endTime: "17:00",
    },
    {
      facultyId: facultyProfiles[9].id,
      dayOfWeek: "Wednesday",
      startTime: "08:00",
      endTime: "17:00",
    },
    {
      facultyId: facultyProfiles[9].id,
      dayOfWeek: "Thursday",
      startTime: "08:00",
      endTime: "17:00",
    },
    {
      facultyId: facultyProfiles[9].id,
      dayOfWeek: "Friday",
      startTime: "08:00",
      endTime: "17:00",
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

  // Create diverse booking samples with different statuses and types
  const bookings = await Promise.all([
    // COMPLETED BOOKINGS (Past meetings)
    prisma.booking.create({
      data: {
        title: "Thesis Defense Consultation",
        description: "Final review of thesis defense presentation",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 3,
          10,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 3,
          11,
          30
        ),
        location: "Faculty Room",
        status: MeetingStatus.COMPLETED,
        scheduleType: ScheduleType.MEETING,
        purpose: "Thesis defense preparation",
        studentId: studentUsers[0].id,
        facultyId: facultyUsers[1].id, // Dr. Neil P. Magloyuan (Program Head)
        completedAt: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 3,
          11,
          30
        ),
      },
    }),
    prisma.booking.create({
      data: {
        title: "CCNA Lab Practice Session",
        description: "Hands-on practice with Cisco equipment",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 2,
          14,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 2,
          16,
          0
        ),
        location: "Cisco Lab",
        status: MeetingStatus.COMPLETED,
        scheduleType: ScheduleType.EVENT,
        purpose: "CCNA routing and switching practice",
        studentId: studentUsers[1].id,
        facultyId: facultyUsers[0].id, // Dr. Warren Badong
        completedAt: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 2,
          16,
          0
        ),
      },
    }),

    // CONFIRMED BOOKINGS (Upcoming meetings)
    prisma.booking.create({
      data: {
        title: "Intelligent Systems Project Discussion",
        description: "Review of AI project implementation",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          9,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          10,
          30
        ),
        location: "Room 400",
        status: MeetingStatus.CONFIRMED,
        scheduleType: ScheduleType.MEETING,
        purpose: "AI project review and guidance",
        studentId: studentUsers[2].id,
        facultyId: facultyUsers[2].id, // Dr. Daisy Ann Arzaga
      },
    }),
    prisma.booking.create({
      data: {
        title: "Data Science Research Consultation",
        description: "Discussion on machine learning algorithms",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 2,
          13,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 2,
          14,
          30
        ),
        location: "Room 600",
        status: MeetingStatus.CONFIRMED,
        scheduleType: ScheduleType.MEETING,
        purpose: "Research methodology discussion",
        studentId: studentUsers[0].id,
        facultyId: facultyUsers[4].id, // Dr. Patrick Cerna
      },
    }),

    // SCHEDULED BOOKINGS (Pending confirmation)
    prisma.booking.create({
      data: {
        title: "Network Infrastructure Planning",
        description: "Planning IT infrastructure for capstone project",
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
        location: "Cisco Lab",
        status: MeetingStatus.SCHEDULED,
        scheduleType: ScheduleType.MEETING,
        purpose: "Capstone project infrastructure planning",
        studentId: studentUsers[1].id,
        facultyId: facultyUsers[5].id, // Dr. Christopher Rey Lungay
      },
    }),
    prisma.booking.create({
      data: {
        title: "Object-Oriented Programming Review",
        description: "Review of OOP concepts and Java implementation",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 4,
          14,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 4,
          15,
          30
        ),
        location: "Room 600",
        status: MeetingStatus.SCHEDULED,
        scheduleType: ScheduleType.MEETING,
        purpose: "OOP concepts clarification",
        studentId: studentUsers[2].id,
        facultyId: facultyUsers[7].id, // Dr. Genevieve Pilongo
      },
    }),

    // CANCELLED BOOKINGS
    prisma.booking.create({
      data: {
        title: "Algorithm Analysis Session",
        description: "Analysis of sorting algorithms complexity",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1,
          15,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1,
          16,
          0
        ),
        location: "Room 400",
        status: MeetingStatus.CANCELLED,
        scheduleType: ScheduleType.MEETING,
        purpose: "Algorithm complexity analysis",
        studentId: studentUsers[0].id,
        facultyId: facultyUsers[6].id, // Dr. Martzel Baste
        cancelledAt: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1,
          14,
          30
        ),
      },
    }),

    // NO_SHOW BOOKINGS
    prisma.booking.create({
      data: {
        title: "Computer Systems Architecture Review",
        description: "Review of system architecture concepts",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 2,
          11,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 2,
          12,
          0
        ),
        location: "Room 400",
        status: MeetingStatus.NO_SHOW,
        scheduleType: ScheduleType.MEETING,
        purpose: "System architecture concepts review",
        studentId: studentUsers[1].id,
        facultyId: facultyUsers[8].id, // Dr. Cherry Lisondra
      },
    }),

    // Dean's Office Meetings
    prisma.booking.create({
      data: {
        title: "Academic Appeal Meeting",
        description: "Discussion regarding grade appeal",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 5,
          9,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 5,
          10,
          0
        ),
        location: "Dean's Office, Room 100",
        status: MeetingStatus.SCHEDULED,
        scheduleType: ScheduleType.MEETING,
        purpose: "Grade appeal discussion",
        studentId: studentUsers[0].id,
        facultyId: facultyUsers[9].id, // Dr. Rhodessa Cascaro (Dean)
      },
    }),

    // Multiple bookings for same faculty (showing busy schedule)
    prisma.booking.create({
      data: {
        title: "Thesis Chapter 1 Review",
        description: "Review of thesis introduction and literature review",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          14,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          15,
          0
        ),
        location: "Faculty Room",
        status: MeetingStatus.CONFIRMED,
        scheduleType: ScheduleType.MEETING,
        purpose: "Thesis chapter review",
        studentId: studentUsers[1].id,
        facultyId: facultyUsers[1].id, // Dr. Neil P. Magloyuan
      },
    }),
    prisma.booking.create({
      data: {
        title: "Research Methodology Workshop",
        description: "Workshop on research methods and data collection",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 3,
          9,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 3,
          11,
          0
        ),
        location: "Room 400",
        status: MeetingStatus.SCHEDULED,
        scheduleType: ScheduleType.EVENT,
        purpose: "Research methodology training",
        studentId: studentUsers[2].id,
        facultyId: facultyUsers[1].id, // Dr. Neil P. Magloyuan
      },
    }),

    // Lab sessions and practical work
    prisma.booking.create({
      data: {
        title: "Network Configuration Lab",
        description: "Hands-on network configuration practice",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 2,
          8,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 2,
          10,
          0
        ),
        location: "Cisco Lab",
        status: MeetingStatus.CONFIRMED,
        scheduleType: ScheduleType.EVENT,
        purpose: "Network configuration practice",
        studentId: studentUsers[0].id,
        facultyId: facultyUsers[0].id, // Dr. Warren Badong
      },
    }),

    // Group meetings
    prisma.booking.create({
      data: {
        title: "Capstone Project Group Meeting",
        description: "Group discussion on capstone project progress",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 4,
          13,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 4,
          14,
          30
        ),
        location: "Room 600",
        status: MeetingStatus.SCHEDULED,
        scheduleType: ScheduleType.MEETING,
        purpose: "Group project coordination",
        studentId: studentUsers[1].id,
        facultyId: facultyUsers[4].id, // Dr. Patrick Cerna
      },
    }),

    // Emergency/Urgent meetings
    prisma.booking.create({
      data: {
        title: "Urgent: System Security Consultation",
        description: "Emergency consultation on system security issues",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          16,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          17,
          0
        ),
        location: "Cisco Lab",
        status: MeetingStatus.CONFIRMED,
        scheduleType: ScheduleType.MEETING,
        purpose: "Security issue resolution",
        studentId: studentUsers[2].id,
        facultyId: facultyUsers[5].id, // Dr. Christopher Rey Lungay
      },
    }),

    // Long-term project meetings
    prisma.booking.create({
      data: {
        title: "AI Research Project Milestone Review",
        description: "Quarterly review of AI research project progress",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 7,
          10,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 7,
          12,
          0
        ),
        location: "Room 400",
        status: MeetingStatus.SCHEDULED,
        scheduleType: ScheduleType.EVENT,
        purpose: "Research milestone review",
        studentId: studentUsers[0].id,
        facultyId: facultyUsers[3].id, // Dr. Rogelio Badiang
      },
    }),

    // Week-long recurring meetings for better calendar visualization
    prisma.booking.create({
      data: {
        title: "Algorithm Design Tutorial",
        description: "Weekly tutorial on algorithm design patterns",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          11,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          12,
          0
        ),
        location: "Room 400",
        status: MeetingStatus.CONFIRMED,
        scheduleType: ScheduleType.MEETING,
        purpose: "Tutorial on algorithm optimization",
        studentId: studentUsers[2].id,
        facultyId: facultyUsers[6].id, // Dr. Martzel Baste
      },
    }),
    prisma.booking.create({
      data: {
        title: "Java OOP Workshop",
        description: "Object-oriented programming concepts workshop",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 2,
          13,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 2,
          15,
          0
        ),
        location: "Room 600",
        status: MeetingStatus.SCHEDULED,
        scheduleType: ScheduleType.EVENT,
        purpose: "OOP workshop for advanced students",
        studentId: studentUsers[0].id,
        facultyId: facultyUsers[7].id, // Dr. Genevieve Pilongo
      },
    }),

    // Same-day multiple bookings (different faculty)
    prisma.booking.create({
      data: {
        title: "Database Design Consultation",
        description: "Database schema review and optimization",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 3,
          14,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 3,
          15,
          30
        ),
        location: "Room 600",
        status: MeetingStatus.CONFIRMED,
        scheduleType: ScheduleType.MEETING,
        purpose: "Database optimization guidance",
        studentId: studentUsers[1].id,
        facultyId: facultyUsers[4].id, // Dr. Patrick Cerna
      },
    }),
    prisma.booking.create({
      data: {
        title: "Machine Learning Workshop",
        description: "Introduction to neural networks and deep learning",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 4,
          10,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 4,
          12,
          0
        ),
        location: "Room 400",
        status: MeetingStatus.SCHEDULED,
        scheduleType: ScheduleType.EVENT,
        purpose: "ML fundamentals training",
        studentId: studentUsers[2].id,
        facultyId: facultyUsers[2].id, // Dr. Daisy Ann Arzaga
      },
    }),

    // End of week meetings
    prisma.booking.create({
      data: {
        title: "Weekly Progress Review",
        description: "Weekly review of student progress and upcoming tasks",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 5,
          15,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 5,
          16,
          0
        ),
        location: "Faculty Room",
        status: MeetingStatus.SCHEDULED,
        scheduleType: ScheduleType.MEETING,
        purpose: "Weekly progress check-in",
        studentId: studentUsers[0].id,
        facultyId: facultyUsers[1].id, // Dr. Neil P. Magloyuan
      },
    }),

    // Next week bookings for extended calendar view
    prisma.booking.create({
      data: {
        title: "Operating Systems Lab Session",
        description: "Hands-on practice with OS concepts",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 8,
          9,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 8,
          11,
          0
        ),
        location: "Room 400",
        status: MeetingStatus.SCHEDULED,
        scheduleType: ScheduleType.EVENT,
        purpose: "OS practical session",
        studentId: studentUsers[1].id,
        facultyId: facultyUsers[8].id, // Dr. Cherry Lisondra
      },
    }),
    prisma.booking.create({
      data: {
        title: "IT Infrastructure Planning Meeting",
        description: "Discussion on IT infrastructure improvements",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 9,
          13,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 9,
          14,
          30
        ),
        location: "Cisco Lab",
        status: MeetingStatus.SCHEDULED,
        scheduleType: ScheduleType.MEETING,
        purpose: "Infrastructure planning",
        studentId: studentUsers[2].id,
        facultyId: facultyUsers[5].id, // Dr. Christopher Rey Lungay
      },
    }),

    // Cancelled booking example
    prisma.booking.create({
      data: {
        title: "Network Troubleshooting Workshop",
        description: "Workshop on network diagnostics and troubleshooting",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 6,
          14,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 6,
          16,
          0
        ),
        location: "Cisco Lab",
        status: MeetingStatus.CANCELLED,
        scheduleType: ScheduleType.EVENT,
        purpose: "Network troubleshooting training",
        studentId: studentUsers[0].id,
        facultyId: facultyUsers[0].id, // Dr. Warren Badong
        cancelledAt: new Date(),
      },
    }),

    // Early morning meetings
    prisma.booking.create({
      data: {
        title: "Early Morning Code Review",
        description: "Review of coding assignments and best practices",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 2,
          8,
          30
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 2,
          9,
          30
        ),
        location: "Room 400",
        status: MeetingStatus.CONFIRMED,
        scheduleType: ScheduleType.MEETING,
        purpose: "Code quality review",
        studentId: studentUsers[1].id,
        facultyId: facultyUsers[6].id, // Dr. Martzel Baste
      },
    }),

    // Late afternoon meetings
    prisma.booking.create({
      data: {
        title: "Software Design Patterns Discussion",
        description: "Advanced software design patterns and architectures",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 3,
          16,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 3,
          17,
          30
        ),
        location: "Room 600",
        status: MeetingStatus.SCHEDULED,
        scheduleType: ScheduleType.MEETING,
        purpose: "Design patterns exploration",
        studentId: studentUsers[0].id,
        facultyId: facultyUsers[7].id, // Dr. Genevieve Pilongo
      },
    }),

    // Back-to-back meetings (testing calendar overlap visualization)
    prisma.booking.create({
      data: {
        title: "Data Structures Quick Consultation",
        description: "Quick questions about tree and graph implementations",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 4,
          13,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 4,
          13,
          30
        ),
        location: "Room 400",
        status: MeetingStatus.CONFIRMED,
        scheduleType: ScheduleType.MEETING,
        purpose: "Data structures clarification",
        studentId: studentUsers[2].id,
        facultyId: facultyUsers[6].id, // Dr. Martzel Baste
      },
    }),
    prisma.booking.create({
      data: {
        title: "Algorithm Complexity Analysis",
        description: "Deep dive into time and space complexity",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 4,
          13,
          30
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 4,
          14,
          30
        ),
        location: "Room 400",
        status: MeetingStatus.CONFIRMED,
        scheduleType: ScheduleType.MEETING,
        purpose: "Algorithm analysis tutorial",
        studentId: studentUsers[1].id,
        facultyId: facultyUsers[6].id, // Dr. Martzel Baste
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
        content:
          "Hello! I need help scheduling a meeting with Dr. Warren Badong.",
        type: ChatMessageType.TEXT,
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        sessionId: chatSessions[0].id,
        senderId: adminUser.id, // Use admin user as system sender
        content:
          "I can help you book an appointment with Dr. Warren Badong. What time would work best for you?",
        type: ChatMessageType.SYSTEM,
        isRead: true,
      },
    }),
    prisma.chatMessage.create({
      data: {
        sessionId: chatSessions[1].id,
        senderId: studentUsers[1].id,
        content:
          "I need help with thesis writing. Can I book office hours with Dr. Neil P. Magloyuan?",
        type: ChatMessageType.TEXT,
        isRead: true,
      },
    }),
  ]);

  // Create diverse booking requests with different statuses
  const bookingRequests = await Promise.all([
    // PENDING REQUESTS
    prisma.bookingRequest.create({
      data: {
        studentId: studentUsers[0].id,
        facultyId: facultyUsers[2].id, // Dr. Daisy Ann Arzaga
        title: "AI Project Consultation",
        description: "Need guidance on machine learning model implementation",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 6,
          10,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 6,
          11,
          0
        ),
        location: "Room 400",
        purpose: "AI project guidance",
        status: BookingStatus.PENDING,
      },
    }),
    prisma.bookingRequest.create({
      data: {
        studentId: studentUsers[1].id,
        facultyId: facultyUsers[0].id, // Dr. Warren Badong
        title: "Network Security Lab Session",
        description: "Request for hands-on network security practice",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 5,
          14,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 5,
          16,
          0
        ),
        location: "Cisco Lab",
        purpose: "Network security practice",
        status: BookingStatus.PENDING,
      },
    }),

    // APPROVED REQUESTS
    prisma.bookingRequest.create({
      data: {
        studentId: studentUsers[2].id,
        facultyId: facultyUsers[1].id, // Dr. Neil P. Magloyuan
        title: "Thesis Methodology Review",
        description: "Review of research methodology for thesis proposal",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 4,
          9,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 4,
          10,
          30
        ),
        location: "Faculty Room",
        purpose: "Thesis methodology review",
        status: BookingStatus.APPROVED,
        respondedAt: new Date(),
      },
    }),
    prisma.bookingRequest.create({
      data: {
        studentId: studentUsers[0].id,
        facultyId: facultyUsers[4].id, // Dr. Patrick Cerna
        title: "Data Science Project Discussion",
        description:
          "Discussion on data analysis techniques for capstone project",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 3,
          15,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 3,
          16,
          0
        ),
        location: "Room 600",
        purpose: "Data science project guidance",
        status: BookingStatus.APPROVED,
        respondedAt: new Date(),
      },
    }),

    // REJECTED REQUESTS
    prisma.bookingRequest.create({
      data: {
        studentId: studentUsers[1].id,
        facultyId: facultyUsers[7].id, // Dr. Genevieve Pilongo
        title: "OOP Concepts Review",
        description: "Review of object-oriented programming concepts",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 2,
          11,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 2,
          12,
          0
        ),
        location: "Room 600",
        purpose: "OOP concepts clarification",
        status: BookingStatus.REJECTED,
        respondedAt: new Date(),
        notes: "Schedule conflict with existing class. Please reschedule.",
      },
    }),

    // CANCELLED REQUESTS
    prisma.bookingRequest.create({
      data: {
        studentId: studentUsers[2].id,
        facultyId: facultyUsers[6].id, // Dr. Martzel Baste
        title: "Algorithm Analysis Session",
        description: "Analysis of algorithm complexity and optimization",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          13,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          14,
          0
        ),
        location: "Room 400",
        purpose: "Algorithm analysis",
        status: BookingStatus.CANCELLED,
        respondedAt: new Date(),
      },
    }),

    // Dean's Office Requests
    prisma.bookingRequest.create({
      data: {
        studentId: studentUsers[0].id,
        facultyId: facultyUsers[9].id, // Dr. Rhodessa Cascaro (Dean)
        title: "Academic Performance Review",
        description: "Request for academic performance review and guidance",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 7,
          10,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 7,
          11,
          0
        ),
        location: "Dean's Office, Room 100",
        purpose: "Academic performance review",
        status: BookingStatus.PENDING,
      },
    }),

    // Multiple requests for same faculty
    prisma.bookingRequest.create({
      data: {
        studentId: studentUsers[1].id,
        facultyId: facultyUsers[1].id, // Dr. Neil P. Magloyuan
        title: "Research Paper Review",
        description: "Review of research paper draft for publication",
        startTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 8,
          14,
          0
        ),
        endTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 8,
          15,
          30
        ),
        location: "Faculty Room",
        purpose: "Research paper review",
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

  console.log("\n🔐 Next Steps:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("⚠️  Faculty accounts NOT created yet!");
  console.log("📝 Run this command to create faculty login accounts:");
  console.log("   pnpm register-faculty");
  console.log("\n👨‍🏫 Faculty users created:");
  console.log("   - wbadong@mcm.edu.ph (Dr. Warren Badong - Professor)");
  console.log(
    "   - npmagloyuan@mcm.edu.ph (Dr. Neil P. Magloyuan - Program Head)"
  );
  console.log("   - daarzaga@mcm.edu.ph (Dr. Daisy Ann Arzaga - Professor)");
  console.log("   - rbadiang@mcm.edu.ph (Dr. Rogelio Badiang - Professor)");
  console.log("   - pcerna@mcm.edu.ph (Dr. Patrick Cerna - Professor)");
  console.log(
    "   - crlungay@mcm.edu.ph (Dr. Christopher Rey Lungay - Professor)"
  );
  console.log("   - mbaste@mcm.edu.ph (Dr. Martzel Baste - Professor)");
  console.log("   - gpilongo@mcm.edu.ph (Dr. Genevieve Pilongo - Professor)");
  console.log("   - clisondra@mcm.edu.ph (Dr. Cherry Lisondra - Professor)");
  console.log("   - rcascaro@mcm.edu.ph (Dr. Rhodessa Cascaro - Dean)");
  console.log("\n👤 Admin:");
  console.log("   - admin@mcm.edu.ph (use password reset flow)");
  console.log("\n👨‍🎓 Students (use password reset flow):");
  console.log("   - msantos@mcm.edu.ph, jgarcia@mcm.edu.ph, acruz@mcm.edu.ph");
  console.log(
    "\n💡 Password will be: Faculty123 (after running register-faculty)"
  );
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
