import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { facultyService } from "../services/faculty-service";
import type { FacultyMember } from "../types";

/**
 * Query keys for faculty-related queries
 */
export const facultyKeys = {
  all: ["faculty"] as const,
  lists: () => [...facultyKeys.all, "list"] as const,
  list: (filters?: string) => [...facultyKeys.lists(), { filters }] as const,
  details: () => [...facultyKeys.all, "detail"] as const,
  detail: (id: number) => [...facultyKeys.details(), id] as const,
  availability: (id: number) => [...facultyKeys.all, "availability", id] as const,
};

/**
 * Hook to fetch all faculty members
 */
export function useFaculty() {
  return useQuery({
    queryKey: facultyKeys.lists(),
    queryFn: () => facultyService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single faculty member by ID
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
 * Hook to fetch faculty availability
 */
export function useFacultyAvailability(id: number) {
  return useQuery({
    queryKey: facultyKeys.availability(id),
    queryFn: () => facultyService.getAvailability(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute (fresher data for availability)
  });
}

/**
 * Hook to search faculty
 */
export function useSearchFaculty(query: string) {
  return useQuery({
    queryKey: facultyKeys.list(query),
    queryFn: () => facultyService.search(query),
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000,
  });
}


