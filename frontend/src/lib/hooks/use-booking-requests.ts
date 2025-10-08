import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  BookingRequest,
  BookingRequestStatus,
} from "@/app/(dashboard)/agenda/types";

/**
 * Query keys for booking request-related queries
 * Provides hierarchical cache keys for React Query with filter support
 */
export const bookingRequestKeys = {
  all: ["bookingRequests"] as const,
  lists: () => [...bookingRequestKeys.all, "list"] as const,
  list: (filters?: {
    status?: BookingRequestStatus;
    facultyId?: string;
    studentId?: string;
  }) => [...bookingRequestKeys.lists(), { filters }] as const,
  details: () => [...bookingRequestKeys.all, "detail"] as const,
  detail: (id: string) => [...bookingRequestKeys.details(), id] as const,
};

/**
 * Custom hook to fetch booking requests with optional filters
 * Supports filtering by status, faculty ID, or student ID
 *
 * @param {Object} [filters] - Optional filter criteria
 * @param {BookingRequestStatus} [filters.status] - Filter by request status
 * @param {string} [filters.facultyId] - Filter by faculty member ID
 * @param {string} [filters.studentId] - Filter by student ID
 * @returns {UseQueryResult<BookingRequest[]>} Query result with booking requests
 */
export function useBookingRequests(filters?: {
  status?: BookingRequestStatus;
  facultyId?: string;
  studentId?: string;
}) {
  return useQuery({
    queryKey: bookingRequestKeys.list(filters),
    queryFn: async (): Promise<BookingRequest[]> => {
      // TODO: Implement API call to fetch booking requests
      // const response = await fetch('/api/bookings/requests', { method: 'GET' });
      // return response.json();
      return [];
    },
  });
}

/**
 * Custom hook to fetch only pending booking requests
 * Convenience wrapper around useBookingRequests with pending status filter
 *
 * @returns {UseQueryResult<BookingRequest[]>} Query result with pending requests
 */
export function usePendingBookingRequests() {
  return useBookingRequests({ status: "pending" });
}

/**
 * Custom hook to fetch a specific booking request by ID
 *
 * @param {string} id - The booking request ID to fetch
 * @returns {UseQueryResult<BookingRequest | null>} Query result with booking request data
 */
export function useBookingRequestById(id: string) {
  return useQuery({
    queryKey: bookingRequestKeys.detail(id),
    queryFn: async (): Promise<BookingRequest | null> => {
      // TODO: Implement API call to fetch single booking request
      // const response = await fetch(`/api/bookings/requests/${id}`);
      // return response.json();
      return null;
    },
    enabled: !!id,
  });
}

/**
 * Custom hook to approve a booking request
 * Automatically invalidates booking request cache on success
 *
 * @returns {UseMutationResult} Mutation result for approval action
 * @remarks Note: Approvals should be done via AI agent for best UX
 */
export function useApproveBookingRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      approvedBy,
    }: {
      requestId: string;
      approvedBy: string;
    }): Promise<BookingRequest> => {
      // TODO: Implement API call to approve booking request
      // const response = await fetch(`/api/bookings/requests/${requestId}/approve`, {
      //   method: 'POST',
      //   body: JSON.stringify({ approvedBy })
      // });
      // return response.json();
      throw new Error("Not implemented - use AI agent to approve bookings");
    },
    onSuccess: () => {
      // Invalidate and refetch booking requests
      queryClient.invalidateQueries({
        queryKey: bookingRequestKeys.all,
      });
    },
  });
}

/**
 * Custom hook to reject a booking request
 * Automatically invalidates booking request cache on success
 *
 * @returns {UseMutationResult} Mutation result for rejection action
 * @remarks Note: Rejections should be done via AI agent for best UX
 */
export function useRejectBookingRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      rejectionReason,
    }: {
      requestId: string;
      rejectionReason?: string;
    }): Promise<BookingRequest> => {
      // TODO: Implement API call to reject booking request
      // const response = await fetch(`/api/bookings/requests/${requestId}/reject`, {
      //   method: 'POST',
      //   body: JSON.stringify({ rejectionReason })
      // });
      // return response.json();
      throw new Error("Not implemented - use AI agent to reject bookings");
    },
    onSuccess: () => {
      // Invalidate and refetch booking requests
      queryClient.invalidateQueries({
        queryKey: bookingRequestKeys.all,
      });
    },
  });
}

/**
 * Custom hook to cancel a booking request
 * Automatically invalidates booking request cache on success
 *
 * @returns {UseMutationResult} Mutation result for cancellation action
 * @remarks Note: Cancellations should be done via AI agent for best UX
 */
export function useCancelBookingRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
    }: {
      requestId: string;
    }): Promise<BookingRequest> => {
      // TODO: Implement API call to cancel booking request
      // const response = await fetch(`/api/bookings/requests/${requestId}/cancel`, {
      //   method: 'POST'
      // });
      // return response.json();
      throw new Error("Not implemented - use AI agent to cancel bookings");
    },
    onSuccess: () => {
      // Invalidate and refetch booking requests
      queryClient.invalidateQueries({
        queryKey: bookingRequestKeys.all,
      });
    },
  });
}

// Legacy exports for backward compatibility
export const useMeetingRequests = useBookingRequests;
export const usePendingMeetingRequests = usePendingBookingRequests;
export const useMeetingRequestById = useBookingRequestById;
export const useApproveMeetingRequest = useApproveBookingRequest;
export const useRejectMeetingRequest = useRejectBookingRequest;
export const useCancelMeetingRequest = useCancelBookingRequest;
