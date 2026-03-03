import { getAllCourts } from './courts';
import { getAllMockBookings } from './bookings';

export interface AdminMetrics {
  totalCourts: number;
  availableCourts: number;
  slotsBookedToday: number;
  totalRevenue: number;
  utilizationRate: number;
}

export function getAdminMetrics(): AdminMetrics {
  const courts = getAllCourts();
  const bookings = getAllMockBookings();
  const today = new Date().toISOString().split('T')[0];

  const availableCourts = courts.filter(c => c.available_now).length;
  const slotsBookedToday = bookings.filter(b => b.booking_date === today && b.status === 'confirmed').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'completed' || b.status === 'confirmed')
    .reduce((sum, b) => sum + b.total_price, 0);
  const utilizationRate = courts.length > 0 ? Math.round((slotsBookedToday / (courts.length * 8)) * 100) : 0;

  return {
    totalCourts: courts.length,
    availableCourts,
    slotsBookedToday,
    totalRevenue,
    utilizationRate
  };
}

export interface RecentBookingDisplay {
  id: string;
  court_name: string;
  user_name: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  total_price: number;
}

export function getRecentBookings(limit: number = 5): RecentBookingDisplay[] {
  const bookings = getAllMockBookings();
  const courts = getAllCourts();

  return bookings
    .sort((a, b) => {
      const dateA = new Date(`${a.booking_date}T${a.start_time}`).getTime();
      const dateB = new Date(`${b.booking_date}T${b.start_time}`).getTime();
      return dateB - dateA;
    })
    .slice(0, limit)
    .map(b => ({
      id: b.id,
      court_name: courts.find(c => c.id === b.court_id)?.name || 'Unknown Court',
      user_name: b.user_name,
      booking_date: b.booking_date,
      start_time: b.start_time,
      end_time: b.end_time,
      status: b.status,
      total_price: b.total_price
    }));
}

export function getCourtUtilization(courtId: string): number {
  const bookings = getAllMockBookings();
  const courtBookings = bookings.filter(b => b.court_id === courtId && (b.status === 'confirmed' || b.status === 'completed'));
  return Math.round((courtBookings.length / 8) * 100);
}