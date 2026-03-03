import { getAllMockBookings } from './bookings';
import { MOCK_COURTS } from '$lib/data/courts';

export interface MetricsData {
  todayRevenue: number;
  activeBookingCount: number;
  availablePaddleCount: number;
  totalUserCount: number;
}

export function getTodayRevenue(): number {
  const today = new Date().toISOString().split('T')[0];
  const bookings = getAllMockBookings();
  return bookings
    .filter(b => b.booking_date === today || b.status === 'confirmed')
    .reduce((sum, b) => sum + b.total_price, 0);
}

export function getActiveBookingCount(): number {
  const bookings = getAllMockBookings();
  return bookings.filter(b => b.status === 'confirmed').length;
}

export function getAvailablePaddleCount(): number {
  return MOCK_COURTS.filter(p => p.available_now).length;
}

export function getTotalUserCount(): number {
  const bookings = getAllMockBookings();
  const userIds = new Set<string>();
  bookings.forEach(b => userIds.add(b.user_id));
  return userIds.size;
}

export interface RecentBooking {
  id: string;
  court_name: string;
  user_name: string;
  booking_date: string;
  status: string;
  total_price: number;
}

export function getRecentBookings(limit: number = 5): RecentBooking[] {
  const bookings = getAllMockBookings();
  return bookings
    .sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime())
    .slice(0, limit)
    .map(b => {
      return {
        id: b.id,
        court_name: b.court_name,
        user_name: b.user_name,
        booking_date: b.booking_date,
        status: b.status,
        total_price: b.total_price
      };
    });
}
