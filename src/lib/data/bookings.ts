// Mock bookings data for development
// This will be replaced with real Supabase queries once the backend is ready

export interface DeliveryAddress {
  full_name: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

export interface Booking {
  id: string;
  paddle_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  delivery_address: DeliveryAddress;
  daily_rate: number;
  total_price: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  created_at: Date;
}

// In-memory storage for mock bookings
const MOCK_BOOKINGS: Booking[] = [];

// Generate UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Create a new mock booking
 */
export function createMockBooking(
  paddle_id: string,
  user_id: string,
  start_date: string,
  end_date: string,
  daily_rate: number,
  total_price: number,
  delivery_address: DeliveryAddress
): Booking {
  const booking: Booking = {
    id: generateUUID(),
    paddle_id,
    user_id,
    start_date,
    end_date,
    delivery_address,
    daily_rate,
    total_price,
    status: 'confirmed',
    created_at: new Date()
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
