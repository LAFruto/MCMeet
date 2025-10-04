import { MOCK_MEETINGS } from "../constants/meeting-data";
import type { Meeting } from "../types";

/**
 * Fetch user bookings
 * TODO: Replace with actual API call when backend is ready
 */
export async function getUserBookings(): Promise<Meeting[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_MEETINGS;
}

/**
 * Fetch single booking by ID
 */
export async function getBookingById(id: number): Promise<Meeting | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return MOCK_MEETINGS.find((m) => m.id === id) || null;
}
