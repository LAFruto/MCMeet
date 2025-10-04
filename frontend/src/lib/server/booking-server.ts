import { MOCK_BOOKINGS } from "../constants/booking-data";
import type { Booking } from "../types";

/**
 * Fetch user bookings
 * TODO: Replace with actual API call when backend is ready
 */
export async function getUserBookings(): Promise<Booking[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_BOOKINGS;
}

/**
 * Fetch single booking by ID
 */
export async function getBookingById(id: string): Promise<Booking | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return MOCK_BOOKINGS.find((booking) => booking.id === id) || null;
}
