import { apiClient } from "./api-client";
import { API_ENDPOINTS } from "../config/api";
import { FACULTY_MEMBERS } from "../constants/faculty-data";
import type { FacultyMember } from "../types";

/**
 * Faculty service - handles all faculty-related API calls
 * Currently uses mock data, replace with real API calls
 */
export const facultyService = {
  /**
   * Get all faculty members
   */
  async getAll(): Promise<FacultyMember[]> {
    // TODO: Replace with actual API call when backend is ready
    // const response = await apiClient.get<FacultyMember[]>(API_ENDPOINTS.FACULTY);
    // return response.data;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 500));
    return FACULTY_MEMBERS;
  },

  /**
   * Get faculty member by ID
   */
  async getById(id: number): Promise<FacultyMember | null> {
    // TODO: Replace with actual API call
    // const response = await apiClient.get<FacultyMember>(
    //   API_ENDPOINTS.FACULTY_BY_ID(id)
    // );
    // return response.data;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 300));
    return FACULTY_MEMBERS.find((f) => f.id === id) || null;
  },

  /**
   * Get faculty availability
   */
  async getAvailability(id: number): Promise<{
    facultyId: number;
    availableSlots: string[];
  }> {
    // TODO: Replace with actual API call
    // const response = await apiClient.get<{ availableSlots: string[] }>(
    //   API_ENDPOINTS.FACULTY_AVAILABILITY(id)
    // );
    // return { facultyId: id, ...response.data };

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      facultyId: id,
      availableSlots: [
        "2024-10-04 14:00",
        "2024-10-04 15:00",
        "2024-10-05 10:00",
        "2024-10-05 11:00",
      ],
    };
  },

  /**
   * Search faculty by name or department
   */
  async search(query: string): Promise<FacultyMember[]> {
    // TODO: Replace with actual API call
    // const response = await apiClient.get<FacultyMember[]>(
    //   `${API_ENDPOINTS.FACULTY}?search=${encodeURIComponent(query)}`
    // );
    // return response.data;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 300));
    const lowerQuery = query.toLowerCase();
    return FACULTY_MEMBERS.filter(
      (f) =>
        f.name.toLowerCase().includes(lowerQuery) ||
        f.department.toLowerCase().includes(lowerQuery) ||
        f.specializations.some((s) => s.toLowerCase().includes(lowerQuery))
    );
  },
};
