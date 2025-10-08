import type { Booking } from "../types";

/**
 * Fetches all bookings for the current user from the server
 * Server-side function for use in React Server Components
 * 
 * @returns {Promise<Booking[]>} Array of user bookings
 * @remarks Currently returns empty array - AI agent handles bookings via chat
 */
export async function getUserBookings(): Promise<Booking[]> {
  return [];
}

/**
 * Fetches a specific booking by ID from the server
 * Server-side function for use in React Server Components
 * 
 * @param {string} id - The booking ID to fetch
 * @returns {Promise<Booking | null>} The booking if found, null otherwise
 */
export async function getBookingById(id: string): Promise<Booking | null> {
  return null;
}
