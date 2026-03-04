// Mock bookings data for development
// This will be replaced with real Supabase queries once the backend is ready

export interface Booking {
  id: string;
  club_id: string; // NEW: which club this booking is for
  court_id: string;
  user_id: string;
  user_name: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  court_name: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_price: number;
  hourly_rate: number;
}

// Generate UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// In-memory storage for mock bookings
const MOCK_BOOKINGS: Booking[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440101',
    club_id: 'club-001',
    court_id: '550e8400-e29b-41d4-a716-446655440001',
    user_id: 'user-001',
    user_name: 'John Smith',
    booking_date: '2026-03-05',
    start_time: '10:00',
    end_time: '11:00',
    court_name: 'Central Court 1',
    status: 'confirmed',
    total_price: 25,
    hourly_rate: 25
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440102',
    club_id: 'club-001',
    court_id: '550e8400-e29b-41d4-a716-446655440002',
    user_id: 'user-002',
    user_name: 'Jane Doe',
    booking_date: '2026-03-05',
    start_time: '14:00',
    end_time: '15:00',
    court_name: 'Central Court 2',
    status: 'confirmed',
    total_price: 30,
    hourly_rate: 30
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440103',
    club_id: 'club-002',
    court_id: '550e8400-e29b-41d4-a716-446655440003',
    user_id: 'user-001',
    user_name: 'John Smith',
    booking_date: '2026-03-06',
    start_time: '09:00',
    end_time: '10:00',
    court_name: 'Padel Court A',
    status: 'pending',
    total_price: 20,
    hourly_rate: 20
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440104',
    club_id: 'club-001',
    court_id: '550e8400-e29b-41d4-a716-446655440001',
    user_id: 'user-003',
    user_name: 'Mike Johnson',
    booking_date: '2026-03-06',
    start_time: '15:00',
    end_time: '17:00',
    court_name: 'Central Court 1',
    status: 'confirmed',
    total_price: 50,
    hourly_rate: 25
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440105',
    club_id: 'club-002',
    court_id: '550e8400-e29b-41d4-a716-446655440004',
    user_id: 'user-002',
    user_name: 'Jane Doe',
    booking_date: '2026-03-07',
    start_time: '11:00',
    end_time: '12:00',
    court_name: 'Padel Court B',
    status: 'confirmed',
    total_price: 20,
    hourly_rate: 20
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440106',
    club_id: 'club-001',
    court_id: '550e8400-e29b-41d4-a716-446655440002',
    user_id: 'user-003',
    user_name: 'Mike Johnson',
    booking_date: '2026-03-07',
    start_time: '16:00',
    end_time: '17:00',
    court_name: 'Central Court 2',
    status: 'pending',
    total_price: 30,
    hourly_rate: 30
  }
];

/**
 * Create a new mock booking
 */
export function createMockBooking(
  court_id: string,
  user_id: string,
  user_name: string,
  booking_date: string,
  start_time: string,
  end_time: string,
  court_name: string,
  hourly_rate: number,
  total_price: number
): Booking {
  const booking: Booking = {
    id: generateUUID(),
    court_id,
    user_id,
    user_name,
    booking_date,
    start_time,
    end_time,
    court_name,
    hourly_rate,
    total_price,
    status: 'confirmed'
  };

  MOCK_BOOKINGS.push(booking);
  console.log('[Booking Created]', booking);
  return booking;
}

/**
 * Get a booking by ID
 */
export function getMockBooking(id: string): Booking | undefined {
  return MOCK_BOOKINGS.find((b) => b.id === id);
}

/**
 * Get all bookings for a user
 */
export function getUserBookings(user_id: string): Booking[] {
  return MOCK_BOOKINGS.filter((b) => b.user_id === user_id);
}

/**
 * Get all mock bookings (for admin)
 */
export function getAllMockBookings(): Booking[] {
  return MOCK_BOOKINGS;
}
