import { getAllMockBookings } from './bookings';
import { MOCK_PADDLES } from './paddles';

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
    .filter(b => b.start_date === today || b.status === 'active')
    .reduce((sum, b) => sum + b.total_price, 0);
}

export function getActiveBookingCount(): number {
  const bookings = getAllMockBookings();
  return bookings.filter(b => b.status === 'active').length;
}

export function getAvailablePaddleCount(): number {
  return MOCK_PADDLES.filter(p => p.available_now).length;
}

export function getTotalUserCount(): number {
  const bookings = getAllMockBookings();
  const userIds = new Set<string>();
  bookings.forEach(b => userIds.add(b.user_id));
  return userIds.size;
}

export interface RecentBooking {
  id: string;
  paddle_name: string;
  user_name: string;
  start_date: string;
  status: string;
  total_price: number;
}

export function getRecentBookings(limit: number = 5): RecentBooking[] {
  const bookings = getAllMockBookings();
  return bookings
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
    .slice(0, limit)
    .map(b => {
      const paddle = MOCK_PADDLES.find(p => p.id === b.paddle_id);
      return {
        id: b.id,
        paddle_name: paddle?.name || 'Unknown Paddle',
        user_name: b.user_name,
        start_date: b.start_date,
        status: b.status,
        total_price: b.total_price
      };
    });
}
