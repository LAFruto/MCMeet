import { apiClient } from "./api-client";
import { API_ENDPOINTS } from "../config/api";
import { MOCK_MEETINGS } from "../constants/meeting-data";
import type { Meeting, BookingRequest } from "../types";

/**
 * Booking service - handles all booking-related API calls
 * Currently uses mock data, replace with real API calls
 */
export const bookingService = {
  /**
   * Get all bookings for current user
   */
  async getUserBookings(): Promise<Meeting[]> {
    // TODO: Replace with actual API call when backend is ready
    // const response = await apiClient.get<Meeting[]>(API_ENDPOINTS.USER_BOOKINGS);
    // return response.data;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_MEETINGS;
  },

  /**
   * Get booking by ID
   */
  async getById(id: number): Promise<Meeting | null> {
    // TODO: Replace with actual API call
    // const response = await apiClient.get<Meeting>(
    //   API_ENDPOINTS.BOOKING_BY_ID(id)
    // );
    // return response.data;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_MEETINGS.find((m) => m.id === id) || null;
  },

  /**
   * Create a new booking
   */
  async create(booking: BookingRequest): Promise<Meeting> {
    // TODO: Replace with actual API call
    // const response = await apiClient.post<Meeting>(
    //   API_ENDPOINTS.CREATE_BOOKING,
    //   booking
    // );
    // return response.data;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newMeeting: Meeting = {
      id: Date.now(),
      title: `Meeting with Faculty`,
      facultyId: booking.facultyId,
      facultyName: "Faculty Member",
      studentId: "STU001",
      studentName: "John Doe",
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: "scheduled",
      purpose: booking.purpose,
    };
    return newMeeting;
  },

  /**
   * Cancel a booking
   */
  async cancel(id: number): Promise<boolean> {
    // TODO: Replace with actual API call
    // await apiClient.post(API_ENDPOINTS.CANCEL_BOOKING(id));
    // return true;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  },

  /**
   * Reschedule a booking
   */
  async reschedule(
    id: number,
    newDate: string,
    newStartTime: string,
    newEndTime: string
  ): Promise<Meeting> {
    // TODO: Replace with actual API call
    // const response = await apiClient.post<Meeting>(
    //   API_ENDPOINTS.RESCHEDULE_BOOKING(id),
    //   { date: newDate, startTime: newStartTime, endTime: newEndTime }
    // );
    // return response.data;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 600));
    const meeting = MOCK_MEETINGS.find((m) => m.id === id);
    if (!meeting) throw new Error("Meeting not found");

    return {
      ...meeting,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
    };
  },
};
