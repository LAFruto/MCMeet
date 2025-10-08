import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "../services/booking-service";
import type { Booking, BookingRequest } from "../types";

/**
 * Query keys for booking-related queries
 * Provides hierarchical cache keys for React Query
 */
export const bookingKeys = {
  all: ["bookings"] as const,
  lists: () => [...bookingKeys.all, "list"] as const,
  list: (filters?: string) => [...bookingKeys.lists(), { filters }] as const,
  details: () => [...bookingKeys.all, "detail"] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
};

/**
 * Custom hook to fetch current user's bookings
 * Uses React Query for caching and automatic refetching
 *
 * @returns {UseQueryResult<Booking[]>} Query result with bookings data
 */
export function useUserBookings() {
  return useQuery({
    queryKey: bookingKeys.lists(),
    queryFn: () => bookingService.getUserBookings(),
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Custom hook to fetch a specific booking by ID
 *
 * @param {string} id - The booking ID to fetch
 * @returns {UseQueryResult<Booking | null>} Query result with booking data
 */
export function useBookingById(id: string) {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => bookingService.getById(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Custom hook to create a new booking
 * Automatically invalidates booking list cache on success
 *
 * @returns {UseMutationResult<Booking, Error, BookingRequest>} Mutation result
 * @remarks Note: Bookings should be created via AI agent for best UX
 */
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (booking: BookingRequest) => bookingService.create(booking),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
}

/**
 * Custom hook to cancel an existing booking
 * Automatically invalidates booking list cache on success
 *
 * @returns {UseMutationResult<boolean, Error, string>} Mutation result
 * @remarks Note: Cancellations should be done via AI agent for best UX
 */
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
}

/**
 * Custom hook to reschedule an existing booking
 * Automatically invalidates booking list cache on success
 *
 * @returns {UseMutationResult<Booking, Error, Object>} Mutation result
 * @remarks Note: Rescheduling should be done via AI agent for best UX
 */
export function useRescheduleBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      newStartTime,
      newEndTime,
    }: {
      id: string;
      newStartTime: Date;
      newEndTime: Date;
    }) => bookingService.reschedule(id, newStartTime, newEndTime),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
}
