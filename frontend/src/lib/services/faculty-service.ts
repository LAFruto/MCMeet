import { apiClient } from "./api-client";
import { API_ENDPOINTS } from "../config/api";
import type { FacultyMember } from "../types";

/**
 * Faculty service for managing faculty member information and availability
 * Integrates with the AI agent for dynamic faculty queries
 *
 * @remarks
 * Faculty information is primarily accessed through the AI agent chat interface
 * for a more natural query experience
 */
export const facultyService = {
  /**
   * Retrieves all faculty members
   * @returns {Promise<FacultyMember[]>} Array of all faculty members
   * @remarks Currently returns empty array - AI agent provides faculty info
   */
  async getAll(): Promise<FacultyMember[]> {
    // TODO: Implement API call - AI agent provides faculty info
    return [];
  },

  /**
   * Retrieves a specific faculty member by ID
   * @param {number} id - The faculty member ID
   * @returns {Promise<FacultyMember | null>} The faculty member if found, null otherwise
   */
  async getById(id: number): Promise<FacultyMember | null> {
    // TODO: Implement API call
    return null;
  },

  /**
   * Retrieves availability slots for a faculty member
   * @param {number} id - The faculty member ID
   * @returns {Promise<{facultyId: number; availableSlots: string[]}>} Faculty availability data
   */
  async getAvailability(id: number): Promise<{
    facultyId: number;
    availableSlots: string[];
  }> {
    // TODO: Implement API call
    return { facultyId: id, availableSlots: [] };
  },

  /**
   * Searches for faculty members by name or department
   * @param {string} query - Search query string
   * @returns {Promise<FacultyMember[]>} Array of matching faculty members
   */
  async search(query: string): Promise<FacultyMember[]> {
    // TODO: Implement API call
    return [];
  },
};
