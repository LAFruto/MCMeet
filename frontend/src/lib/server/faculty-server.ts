import type { FacultyMember } from "../types";

/**
 * Fetches all faculty members from the server
 * Server-side function for use in React Server Components
 *
 * @returns {Promise<FacultyMember[]>} Array of all faculty members
 * @remarks Currently returns empty array - AI agent provides faculty info
 */
export async function getFacultyMembers(): Promise<FacultyMember[]> {
  return [];
}

/**
 * Fetches a specific faculty member by ID from the server
 * Server-side function for use in React Server Components
 *
 * @param {number} id - The faculty member ID to fetch
 * @returns {Promise<FacultyMember | null>} The faculty member if found, null otherwise
 */
export async function getFacultyById(
  id: number
): Promise<FacultyMember | null> {
  return null;
}

/**
 * Searches faculty members by name or department
 * Server-side function for use in React Server Components
 *
 * @param {string} query - The search query string
 * @returns {Promise<FacultyMember[]>} Array of matching faculty members
 */
export async function searchFaculty(query: string): Promise<FacultyMember[]> {
  return [];
}
