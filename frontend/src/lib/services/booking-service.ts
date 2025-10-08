import { apiClient } from "./api-client";
import { API_ENDPOINTS } from "../config/api";
import type { Booking, BookingRequest } from "../types";

/**
 * Booking service for managing student-faculty appointments
 * Integrates with the AI agent chat interface for booking operations
 *
 * @remarks
 * All booking operations (create, cancel, reschedule) are handled through
 * the AI agent chat interface to provide a natural conversation experience
 */
export const bookingService = {
  /**
   * Retrieves all bookings for the current user
   * @returns {Promise<Booking[]>} Array of user bookings
   * @remarks Currently returns empty array - AI agent handles bookings via chat
   */
  async getUserBookings(): Promise<Booking[]> {
    // TODO: Implement API call - AI agent handles bookings via chat
    return [];
  },

  /**
   * Retrieves a specific booking by ID
   * @param {string} id - The booking ID
   * @returns {Promise<Booking | null>} The booking if found, null otherwise
   */
  async getById(id: string): Promise<Booking | null> {
    // TODO: Implement API call
    return null;
  },

  /**
   * Creates a new booking
   * @param {BookingRequest} booking - The booking request data
   * @returns {Promise<Booking>} The created booking
   * @throws {Error} Always throws - bookings must be created via AI agent
   */
  async create(booking: BookingRequest): Promise<Booking> {
    throw new Error("Use AI agent to create bookings");
  },

  /**
   * Cancels an existing booking
   * @param {string} id - The booking ID to cancel
   * @returns {Promise<boolean>} True if cancelled successfully
   * @throws {Error} Always throws - cancellations must be done via AI agent
   */
  async cancel(id: string): Promise<boolean> {
    throw new Error("Use AI agent to cancel bookings");
  },

  /**
   * Reschedules an existing booking
   * @param {string} id - The booking ID to reschedule
   * @param {Date} newStartTime - New start time for the booking
   * @param {Date} newEndTime - New end time for the booking
   * @returns {Promise<Booking>} The rescheduled booking
   * @throws {Error} Always throws - rescheduling must be done via AI agent
   */
  async reschedule(
    id: string,
    newStartTime: Date,
    newEndTime: Date
  ): Promise<Booking> {
    throw new Error("Use AI agent to reschedule bookings");
  },
};
