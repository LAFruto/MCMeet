import { prisma } from "../db";
import type { FacultyMember } from "../types";

/**
 * Transforms Prisma Faculty model with User relation to FacultyMember type
 * Handles data mapping between database schema and application types
 *
 * @param faculty - Faculty record with user relation from Prisma
 * @returns {FacultyMember} Transformed faculty member object
 */
function transformToFacultyMember(faculty: any): FacultyMember {
  return {
    id: parseInt(faculty.id, 36) || 0, // Convert cuid to number for legacy compatibility
    userId: faculty.userId,
    name: faculty.user.name,
    email: faculty.user.email,
    department: faculty.department,
    phone: faculty.user.phone || "",
    office: faculty.office || "",
    availability: faculty.availability,
    status: faculty.status as "Available" | "Busy" | "Away",
    specializations: faculty.specializations,
    bio: faculty.bio || "",
    nextAvailable: faculty.availability, // Simplified - could be enhanced with actual availability calculation
  };
}

/**
 * Fetches all approved faculty members from the server
 * Server-side function for use in React Server Components
 *
 * @returns {Promise<FacultyMember[]>} Array of all approved faculty members
 * @throws {Error} If database query fails
 */
export async function getFacultyMembers(): Promise<FacultyMember[]> {
  try {
    const faculties = await prisma.faculty.findMany({
      where: {
        isApproved: true,
        user: {
          status: "ACTIVE",
        },
      },
      include: {
        user: true,
        officeHours: {
          where: {
            isActive: true,
          },
          orderBy: {
            dayOfWeek: "asc",
          },
        },
      },
      orderBy: [{ department: "asc" }, { user: { name: "asc" } }],
    });

    return faculties.map(transformToFacultyMember);
  } catch (error) {
    console.error("Error fetching faculty members:", error);
    throw new Error("Failed to fetch faculty members");
  }
}

/**
 * Fetches a specific faculty member by ID from the server
 * Server-side function for use in React Server Components
 *
 * @param {number} id - The faculty member ID to fetch (legacy number format)
 * @returns {Promise<FacultyMember | null>} The faculty member if found, null otherwise
 * @throws {Error} If database query fails
 */
export async function getFacultyById(
  id: number
): Promise<FacultyMember | null> {
  try {
    // Note: This is a workaround for legacy ID format
    // Consider migrating to string-based IDs for better compatibility
    const faculties = await prisma.faculty.findMany({
      where: {
        isApproved: true,
        user: {
          status: "ACTIVE",
        },
      },
      include: {
        user: true,
        officeHours: {
          where: {
            isActive: true,
          },
        },
      },
    });

    const faculty = faculties.find((f) => {
      const numericId = parseInt(f.id, 36) || 0;
      return numericId === id;
    });

    if (!faculty) return null;

    return transformToFacultyMember(faculty);
  } catch (error) {
    console.error(`Error fetching faculty member with ID ${id}:`, error);
    return null;
  }
}

/**
 * Fetches a specific faculty member by string ID (CUID)
 * Server-side function for use in React Server Components
 *
 * @param {string} id - The faculty member string ID (CUID format)
 * @returns {Promise<FacultyMember | null>} The faculty member if found, null otherwise
 * @throws {Error} If database query fails
 */
export async function getFacultyByStringId(
  id: string
): Promise<FacultyMember | null> {
  try {
    const faculty = await prisma.faculty.findUnique({
      where: {
        id,
        isApproved: true,
      },
      include: {
        user: true,
        officeHours: {
          where: {
            isActive: true,
          },
        },
      },
    });

    if (!faculty) return null;

    return transformToFacultyMember(faculty);
  } catch (error) {
    console.error(`Error fetching faculty member with ID ${id}:`, error);
    return null;
  }
}

/**
 * Searches faculty members by name, department, or specialization
 * Server-side function for use in React Server Components
 *
 * @param {string} query - The search query string
 * @returns {Promise<FacultyMember[]>} Array of matching faculty members
 * @throws {Error} If database query fails
 */
export async function searchFaculty(query: string): Promise<FacultyMember[]> {
  if (!query || query.trim().length === 0) {
    return getFacultyMembers();
  }

  try {
    const searchTerm = query.trim().toLowerCase();

    const faculties = await prisma.faculty.findMany({
      where: {
        isApproved: true,
        user: {
          status: "ACTIVE",
        },
        OR: [
          {
            user: {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
          {
            department: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            position: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            specializations: {
              hasSome: [searchTerm],
            },
          },
        ],
      },
      include: {
        user: true,
        officeHours: {
          where: {
            isActive: true,
          },
        },
      },
      orderBy: [{ department: "asc" }, { user: { name: "asc" } }],
    });

    return faculties.map(transformToFacultyMember);
  } catch (error) {
    console.error(`Error searching faculty with query "${query}":`, error);
    throw new Error("Failed to search faculty members");
  }
}

/**
 * Fetches faculty members by department
 * Server-side function for use in React Server Components
 *
 * @param {string} department - The department name to filter by
 * @returns {Promise<FacultyMember[]>} Array of faculty members in the department
 * @throws {Error} If database query fails
 */
export async function getFacultyByDepartment(
  department: string
): Promise<FacultyMember[]> {
  try {
    const faculties = await prisma.faculty.findMany({
      where: {
        department: {
          equals: department,
          mode: "insensitive",
        },
        isApproved: true,
        user: {
          status: "ACTIVE",
        },
      },
      include: {
        user: true,
        officeHours: {
          where: {
            isActive: true,
          },
        },
      },
      orderBy: {
        user: { name: "asc" },
      },
    });

    return faculties.map(transformToFacultyMember);
  } catch (error) {
    console.error(
      `Error fetching faculty by department "${department}":`,
      error
    );
    throw new Error("Failed to fetch faculty by department");
  }
}

/**
 * Fetches all distinct departments from faculty records
 * Server-side function for use in React Server Components
 *
 * @returns {Promise<string[]>} Array of unique department names
 * @throws {Error} If database query fails
 */
export async function getDepartments(): Promise<string[]> {
  try {
    const departments = await prisma.faculty.findMany({
      where: {
        isApproved: true,
      },
      select: {
        department: true,
      },
      distinct: ["department"],
      orderBy: {
        department: "asc",
      },
    });

    return departments.map((d) => d.department);
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw new Error("Failed to fetch departments");
  }
}
