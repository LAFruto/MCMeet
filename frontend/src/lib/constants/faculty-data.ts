import type { FacultyMember } from "../types";

export const FACULTY_MEMBERS: FacultyMember[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    department: "Computer Science",
    email: "sarah.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    availability: "Mon-Fri, 9AM-5PM",
    status: "Available",
    specializations: ["Machine Learning", "Data Science", "AI"],
    nextAvailable: "Today, 2:00 PM",
    office: "Room 201",
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    department: "Mathematics",
    email: "michael.chen@university.edu",
    phone: "+1 (555) 234-5678",
    availability: "Mon-Wed-Fri, 10AM-4PM",
    status: "Busy",
    specializations: ["Calculus", "Statistics", "Linear Algebra"],
    nextAvailable: "Tomorrow, 10:00 AM",
    office: "Room 305",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    department: "Physics",
    email: "emily.rodriguez@university.edu",
    phone: "+1 (555) 345-6789",
    availability: "Tue-Thu, 8AM-6PM",
    status: "Available",
    specializations: ["Quantum Physics", "Thermodynamics", "Mechanics"],
    nextAvailable: "Today, 3:30 PM",
    office: "Room 150",
  },
  {
    id: 4,
    name: "Prof. David Kim",
    department: "Engineering",
    email: "david.kim@university.edu",
    phone: "+1 (555) 456-7890",
    availability: "Wed-Fri, 9AM-11AM",
    status: "Available",
    specializations: ["Robotics", "Control Systems", "Automation"],
    nextAvailable: "Wednesday, 9:00 AM",
    office: "Room 420",
  },
];


