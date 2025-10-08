import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { facultyService } from "../services/faculty-service";
import type { FacultyMember } from "../types";

/**
 * Query keys for faculty-related queries
 * Provides hierarchical cache keys for React Query
 */
export const facultyKeys = {
  all: ["faculty"] as const,
  lists: () => [...facultyKeys.all, "list"] as const,
  list: (filters?: string) => [...facultyKeys.lists(), { filters }] as const,
  details: () => [...facultyKeys.all, "detail"] as const,
  detail: (id: number) => [...facultyKeys.details(), id] as const,
  availability: (id: number) =>
    [...facultyKeys.all, "availability", id] as const,
};

/**
 * Custom hook to fetch all faculty members
 * Uses React Query with 5-minute cache for relatively stable faculty data
 *
 * @returns {UseQueryResult<FacultyMember[]>} Query result with faculty members array
 */
export function useFaculty() {
  return useQuery({
    queryKey: facultyKeys.lists(),
    queryFn: () => facultyService.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Custom hook to fetch a specific faculty member by ID
 *
 * @param {number} id - The faculty member ID to fetch
 * @returns {UseQueryResult<FacultyMember | null>} Query result with faculty member data
 */
export function useFacultyById(id: number) {
  return useQuery({
    queryKey: facultyKeys.detail(id),
    queryFn: () => facultyService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Custom hook to fetch faculty member availability
 * Uses shorter cache time for more up-to-date availability information
 *
 * @param {number} id - The faculty member ID to fetch availability for
 * @returns {UseQueryResult<{facultyId: number; availableSlots: string[]}>} Query result with availability data
 */
export function useFacultyAvailability(id: number) {
  return useQuery({
    queryKey: facultyKeys.availability(id),
    queryFn: () => facultyService.getAvailability(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Custom hook to search faculty members by name or department
 * Only executes when query string is not empty
 *
 * @param {string} query - The search query string
 * @returns {UseQueryResult<FacultyMember[]>} Query result with matching faculty members
 */
export function useSearchFaculty(query: string) {
  return useQuery({
    queryKey: facultyKeys.list(query),
    queryFn: () => facultyService.search(query),
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000,
  });
}
