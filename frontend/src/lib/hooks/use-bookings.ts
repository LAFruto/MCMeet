import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "../services/booking-service";
import type { Booking, BookingRequest } from "../types";

/**
 * Query keys for booking-related queries
 */
export const bookingKeys = {
  all: ["bookings"] as const,
  lists: () => [...bookingKeys.all, "list"] as const,
  list: (filters?: string) => [...bookingKeys.lists(), { filters }] as const,
  details: () => [...bookingKeys.all, "detail"] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
};

/**
 * Hook to fetch user's bookings
 */
export function useUserBookings() {
  return useQuery({
    queryKey: bookingKeys.lists(),
    queryFn: () => bookingService.getUserBookings(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch a single booking by ID
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
 * Hook to create a new booking
 */
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (booking: BookingRequest) => bookingService.create(booking),
    onSuccess: () => {
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
}

/**
 * Hook to cancel a booking
 */
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingService.cancel(id),
    onSuccess: () => {
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
}

/**
 * Hook to reschedule a booking
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
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
}
