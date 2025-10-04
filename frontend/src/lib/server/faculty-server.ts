import { FACULTY_MEMBERS } from "../constants/faculty-data";
import type { FacultyMember } from "../types";

/**
 * Fetch all faculty members
 * TODO: Replace with actual API call when backend is ready
 */
export async function getFacultyMembers(): Promise<FacultyMember[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return FACULTY_MEMBERS;
}

/**
 * Fetch single faculty member by ID
 */
export async function getFacultyById(
  id: number
): Promise<FacultyMember | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return FACULTY_MEMBERS.find((f) => f.id === id) || null;
}

/**
 * Search faculty members by query
 */
export async function searchFaculty(query: string): Promise<FacultyMember[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const lowerQuery = query.toLowerCase();
  return FACULTY_MEMBERS.filter(
    (f) =>
      f.name.toLowerCase().includes(lowerQuery) ||
      f.department.toLowerCase().includes(lowerQuery) ||
      f.specializations.some((s) => s.toLowerCase().includes(lowerQuery))
  );
}
