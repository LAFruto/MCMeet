import { apiClient } from "./api-client";
import { API_ENDPOINTS } from "../config/api";
import { MOCK_BOOKINGS } from "../constants/booking-data";
import type { Booking, BookingRequest } from "../types";

/**
 * Booking service - handles all booking-related API calls
 * Currently uses mock data, replace with real API calls
 */
export const bookingService = {
  /**
   * Get all bookings for current user
   */
  async getUserBookings(): Promise<Booking[]> {
    // TODO: Replace with actual API call when backend is ready
    // const response = await apiClient.get<Booking[]>(API_ENDPOINTS.USER_BOOKINGS);
    // return response.data;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_BOOKINGS;
  },

  /**
   * Get booking by ID
   */
  async getById(id: string): Promise<Booking | null> {
    // TODO: Replace with actual API call
    // const response = await apiClient.get<Booking>(
    //   API_ENDPOINTS.BOOKING_BY_ID(id)
    // );
    // return response.data;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_BOOKINGS.find((booking) => booking.id === id) || null;
  },

  /**
   * Create a new booking
   */
  async create(booking: BookingRequest): Promise<Booking> {
    // TODO: Replace with actual API call
    // const response = await apiClient.post<Booking>(
    //   API_ENDPOINTS.CREATE_BOOKING,
    //   booking
    // );
    // return response.data;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      title: booking.title || `Meeting with Faculty`,
      facultyId: booking.facultyId,
      studentId: booking.studentId,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: "SCHEDULED",
      scheduleType: "MEETING",
      purpose: booking.description,
      location: booking.location || "Online",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newBooking;
  },

  /**
   * Cancel a booking
   */
  async cancel(id: string): Promise<boolean> {
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
    id: string,
    newStartTime: Date,
    newEndTime: Date
  ): Promise<Booking> {
    // TODO: Replace with actual API call
    // const response = await apiClient.post<Booking>(
    //   API_ENDPOINTS.RESCHEDULE_BOOKING(id),
    //   { startTime: newStartTime, endTime: newEndTime }
    // );
    // return response.data;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 600));
    const booking = MOCK_BOOKINGS.find((b) => b.id === id);
    if (!booking) throw new Error("Booking not found");

    return {
      ...booking,
      startTime: newStartTime,
      endTime: newEndTime,
      updatedAt: new Date(),
    };
  },
};
