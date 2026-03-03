/**
 * Mock user data and bookings
 * This will be replaced with real Supabase queries once the backend is ready
 */

export type { Booking } from './bookings';
import type { Booking } from './bookings';

export interface User {
  id: string;
  name: string;
  email: string;
}

// Mock current logged-in user
export const CURRENT_USER: User = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com'
};

/**
 * Mock user bookings for dashboard
 * Uses paddle IDs from MOCK_COURTS to ensure consistency
 */
export const MOCK_USER_BOOKINGS: Booking[] = [
  // Active Bookings (1 confirmed, 1 in progress)
  {
    id: 'booking-1',
    court_id: '550e8400-e29b-41d4-a716-446655440001', // Wilson Pro Power Pro
    user_id: 'user-123',
    start_date: '2026-03-10',
    end_date: '2026-03-12',
    delivery_address: {
      full_name: 'John Doe',
      street_address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      phone: '555-0001'
    },
    daily_rate: 15,
    total_price: 30.0,
    status: 'confirmed',
    created_at: new Date('2026-03-03')
  },
  {
    id: 'booking-2',
    court_id: '550e8400-e29b-41d4-a716-446655440003', // Yonex Vcore 98
    user_id: 'user-123',
    start_date: '2026-03-05',
    end_date: '2026-03-08',
    delivery_address: {
      full_name: 'John Doe',
      street_address: '456 Oak Ave',
      city: 'New York',
      state: 'NY',
      zip: '10002',
      phone: '555-0001'
    },
    daily_rate: 18,
    total_price: 54.0,
    status: 'confirmed',
    created_at: new Date('2026-02-28')
  },
  // Past Bookings (completed/cancelled)
  {
    id: 'booking-3',
    court_id: '550e8400-e29b-41d4-a716-446655440002', // Head Prestige Speed
    user_id: 'user-123',
    start_date: '2026-02-15',
    end_date: '2026-02-17',
    delivery_address: {
      full_name: 'John Doe',
      street_address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      phone: '555-0001'
    },
    daily_rate: 12,
    total_price: 24.0,
    status: 'completed',
    created_at: new Date('2026-02-12')
  },
  {
    id: 'booking-4',
    court_id: '550e8400-e29b-41d4-a716-446655440004', // Dunlop Nitro Beginners
    user_id: 'user-123',
    start_date: '2026-01-20',
    end_date: '2026-01-23',
    delivery_address: {
      full_name: 'John Doe',
      street_address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      phone: '555-0001'
    },
    daily_rate: 8,
    total_price: 24.0,
    status: 'completed',
    created_at: new Date('2026-01-15')
  },
  // Cancelled Booking
  {
    id: 'booking-5',
    court_id: '550e8400-e29b-41d4-a716-446655440006', // Prince Beast 100
    user_id: 'user-123',
    start_date: '2026-02-01',
    end_date: '2026-02-03',
    delivery_address: {
      full_name: 'John Doe',
      street_address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      phone: '555-0001'
    },
    daily_rate: 14,
    total_price: 28.0,
    status: 'cancelled',
    created_at: new Date('2026-01-28')
  }
];

/**
 * Get bookings for a specific user
 */
export function getUserBookings(userId: string): Booking[] {
  return MOCK_USER_BOOKINGS.filter(b => b.user_id === userId);
}

/**
 * Get active bookings (status: 'confirmed' or 'pending')
 */
export function getActiveBookings(userId: string): Booking[] {
  return getUserBookings(userId).filter(b => b.status === 'confirmed' || b.status === 'pending');
}

/**
 * Get past bookings (status: 'completed')
 */
export function getPastBookings(userId: string): Booking[] {
  return getUserBookings(userId).filter(b => b.status === 'completed');
}

/**
 * Get cancelled bookings (status: 'cancelled')
 */
export function getCancelledBookings(userId: string): Booking[] {
  return getUserBookings(userId).filter(b => b.status === 'cancelled');
}

/**
 * Cancel a booking (if >24 hours before start)
 * Returns: { success: boolean, message: string }
 */
export function cancelBooking(
  bookingId: string,
  userId: string
): { success: boolean; message: string } {
  const booking = MOCK_USER_BOOKINGS.find(b => b.id === bookingId && b.user_id === userId);

  if (!booking) {
    return { success: false, message: 'Booking not found' };
  }

  if (booking.status === 'cancelled') {
    return { success: false, message: 'Booking already cancelled' };
  }

  const startDate = new Date(booking.start_date);
  const now = new Date();
  const hoursDiff = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursDiff < 24) {
    return {
      success: false,
      message: 'Cannot cancel within 24 hours of booking start'
    };
  }

  booking.status = 'cancelled';
  return { success: true, message: 'Booking cancelled successfully' };
}

/**
 * Calculate number of days for a booking
 */
export function calculateBookingDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays); // Minimum 1 day
}

/**
 * Format address as single line
 */
export function formatAddress(address: DeliveryAddress | null): string {
  if (!address) return 'Address not provided';
  return `${address.street_address}, ${address.city}, ${address.state} ${address.zip}`;
}

export interface DeliveryAddress {
  full_name: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}
