import { getAllMockBookings, type Booking } from './bookings';

export interface BookingWithCourtInfo extends Booking {
  court_full_name: string;
}

export function getAllBookingsWithPaddles(): BookingWithCourtInfo[] {
  const bookings = getAllMockBookings();

  return bookings.map(booking => ({
    ...booking,
    court_full_name: booking.court_name
  }));
}

export function getBookingById(id: string): BookingWithCourtInfo | undefined {
  const bookings = getAllBookingsWithPaddles();
  return bookings.find(b => b.id === id);
}

export function updateBookingStatus(id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled'): BookingWithCourtInfo {
  const bookings = getAllMockBookings();
  const booking = bookings.find(b => b.id === id);

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    throw new Error('Invalid status');
  }

  booking.status = status;
  console.log('[Booking Status Updated]', id, 'to', status);

  const updated = getAllBookingsWithPaddles().find(b => b.id === id);
  return updated!;
}

export function getBookingsByStatus(status?: string): BookingWithCourtInfo[] {
  const bookings = getAllBookingsWithPaddles();
  if (!status) return bookings;
  return bookings.filter(b => b.status === status);
}

export function getTotalBookings(): number {
  return getAllMockBookings().length;
}

export function getRevenue(): number {
  return getAllMockBookings().reduce((sum, b) => sum + b.total_price, 0);
}
