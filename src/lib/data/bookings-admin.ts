import { getAllMockBookings, type Booking } from './bookings';
import { MOCK_PADDLES } from './paddles';

export interface BookingWithPaddleInfo extends Booking {
  paddle_name: string;
}

export function getAllBookingsWithPaddles(): BookingWithPaddleInfo[] {
  const bookings = getAllMockBookings();

  return bookings.map(booking => ({
    ...booking,
    paddle_name: MOCK_PADDLES.find(p => p.id === booking.paddle_id)?.name || 'Unknown Paddle'
  }));
}

export function getBookingById(id: string): BookingWithPaddleInfo | undefined {
  const bookings = getAllBookingsWithPaddles();
  return bookings.find(b => b.id === id);
}

export function updateBookingStatus(id: string, status: 'pending' | 'active' | 'completed' | 'cancelled'): BookingWithPaddleInfo {
  const bookings = getAllMockBookings();
  const booking = bookings.find(b => b.id === id);

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (!['pending', 'active', 'completed', 'cancelled'].includes(status)) {
    throw new Error('Invalid status');
  }

  booking.status = status;
  console.log('[Booking Status Updated]', id, 'to', status);

  const updated = getAllBookingsWithPaddles().find(b => b.id === id);
  return updated!;
}

export function getBookingsByStatus(status?: string): BookingWithPaddleInfo[] {
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
