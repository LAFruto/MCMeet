import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MOCK_BOOKING_REQUESTS } from "../constants/booking-requests";
import type {
  BookingRequest,
  BookingRequestStatus,
} from "@/app/(dashboard)/agenda/types";

/**
 * Query keys for booking request-related queries
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
 * Hook to fetch all booking requests with optional filters
 */
export function useBookingRequests(filters?: {
  status?: BookingRequestStatus;
  facultyId?: string;
  studentId?: string;
}) {
  return useQuery({
    queryKey: bookingRequestKeys.list(filters),
    queryFn: async (): Promise<BookingRequest[]> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filteredRequests = [...MOCK_BOOKING_REQUESTS];

      if (filters?.status) {
        filteredRequests = filteredRequests.filter(
          (request) => request.status === filters.status
        );
      }

      if (filters?.facultyId) {
        filteredRequests = filteredRequests.filter(
          (request) => request.facultyId === filters.facultyId
        );
      }

      if (filters?.studentId) {
        filteredRequests = filteredRequests.filter(
          (request) => request.studentId === filters.studentId
        );
      }

      return filteredRequests;
    },
  });
}

/**
 * Hook to fetch only pending booking requests
 */
export function usePendingBookingRequests() {
  return useBookingRequests({ status: "pending" });
}

/**
 * Hook to fetch a single booking request by ID
 */
export function useBookingRequestById(id: string) {
  return useQuery({
    queryKey: bookingRequestKeys.detail(id),
    queryFn: async (): Promise<BookingRequest | null> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const request = MOCK_BOOKING_REQUESTS.find((req) => req.id === id);
      return request || null;
    },
    enabled: !!id,
  });
}

/**
 * Hook to approve a booking request
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
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find the request and update it
      const request = MOCK_BOOKING_REQUESTS.find((req) => req.id === requestId);
      if (!request) {
        throw new Error("Booking request not found");
      }

      const updatedRequest: BookingRequest = {
        ...request,
        status: "approved",
        approvedAt: new Date(),
        approvedBy,
      };

      // In a real app, this would be an API call
      // For now, we'll just return the updated request
      return updatedRequest;
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
 * Hook to reject a booking request
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
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find the request and update it
      const request = MOCK_BOOKING_REQUESTS.find((req) => req.id === requestId);
      if (!request) {
        throw new Error("Booking request not found");
      }

      const updatedRequest: BookingRequest = {
        ...request,
        status: "rejected",
        rejectedAt: new Date(),
        rejectionReason,
      };

      // In a real app, this would be an API call
      // For now, we'll just return the updated request
      return updatedRequest;
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
 * Hook to cancel a booking request
 */
export function useCancelBookingRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
    }: {
      requestId: string;
    }): Promise<BookingRequest> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find the request and update it
      const request = MOCK_BOOKING_REQUESTS.find((req) => req.id === requestId);
      if (!request) {
        throw new Error("Booking request not found");
      }

      const updatedRequest: BookingRequest = {
        ...request,
        status: "cancelled",
        cancelledAt: new Date(),
      };

      // In a real app, this would be an API call
      // For now, we'll just return the updated request
      return updatedRequest;
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
