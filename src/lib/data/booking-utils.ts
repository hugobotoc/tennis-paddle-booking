import { isCourtBlocked } from '$lib/data/court-blocking';
import { getCourtsByClub } from '$lib/data/courts';

// Check if a court is blocked for a specific booking time
export function isCourtAvailable(
  clubId: string,
  courtId: string,
  date: string, // YYYY-MM-DD
  startTime: string, // HH:MM
  endTime: string // HH:MM
): boolean {
  // First check if the court is blocked
  const block = isCourtBlocked(clubId, courtId, date, startTime, endTime);
  return !block;
}

// Get list of available courts for a specific time slot
export function getAvailableCourts(
  clubId: string,
  date: string, // YYYY-MM-DD
  startTime: string, // HH:MM
  endTime: string // HH:MM
): string[] {
  const courts = getCourtsByClub(clubId);
  const availableCourts: string[] = [];

  for (const court of courts) {
    if (isCourtAvailable(clubId, court.id, date, startTime, endTime)) {
      availableCourts.push(court.id);
    }
  }

  return availableCourts;
}

// Validate if a booking can be made (checks for blocked courts)
export function validateBooking(
  clubId: string,
  courtId: string,
  date: string,
  startTime: string,
  endTime: string
): { isValid: boolean; message?: string } {
  // Check if court is blocked
  const block = isCourtBlocked(clubId, courtId, date, startTime, endTime);
  if (block) {
    return {
      isValid: false,
      message: `Court is blocked for this time slot (${block.name})`
    };
  }

  // If we get here, court is available
  return { isValid: true };
}