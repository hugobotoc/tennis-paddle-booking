/**
 * Mock reviews data and review management functions
 * This will be replaced with real Supabase queries once the backend is ready
 */

import type { Booking } from './bookings';

export interface Review {
  id: string;
  booking_id: string;
  paddle_id: string;
  reviewer_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: Date;
}

/**
 * Mock reviews data - initialized with some sample reviews
 */
export const MOCK_REVIEWS: Review[] = [
  {
    id: 'review-1',
    booking_id: 'booking-3',
    paddle_id: '550e8400-e29b-41d4-a716-446655440002',
    reviewer_id: 'user-456',
    reviewer_name: 'Jane Smith',
    rating: 5,
    comment: 'Excellent paddle! Played great and arrived on time.',
    created_at: new Date('2026-02-20')
  },
  {
    id: 'review-2',
    booking_id: 'booking-4',
    paddle_id: '550e8400-e29b-41d4-a716-446655440004',
    reviewer_id: 'user-789',
    reviewer_name: 'Mike Johnson',
    rating: 4,
    comment: 'Very good for beginners. Great quality and easy to use.',
    created_at: new Date('2026-02-15')
  },
  {
    id: 'review-3',
    booking_id: 'booking-2',
    paddle_id: '550e8400-e29b-41d4-a716-446655440003',
    reviewer_id: 'user-321',
    reviewer_name: 'Sarah Williams',
    rating: 5,
    comment: 'Perfect balance and control! Highly recommend.',
    created_at: new Date('2026-02-10')
  },
  {
    id: 'review-4',
    booking_id: 'booking-1',
    paddle_id: '550e8400-e29b-41d4-a716-446655440001',
    reviewer_id: 'user-654',
    reviewer_name: 'Alex Brown',
    rating: 4,
    comment: 'Great paddle with excellent power. Minor wear on grip.',
    created_at: new Date('2026-02-05')
  },
  {
    id: 'review-5',
    booking_id: 'booking-6',
    paddle_id: '550e8400-e29b-41d4-a716-446655440001',
    reviewer_id: 'user-987',
    reviewer_name: 'Emma Davis',
    rating: 5,
    comment: 'Absolutely love this paddle! Best rental experience ever.',
    created_at: new Date('2026-01-30')
  }
];

/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get all reviews for a specific paddle
 * Sorted by newest first
 */
export function getReviewsForPaddle(paddleId: string): Review[] {
  return MOCK_REVIEWS
    .filter(r => r.paddle_id === paddleId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * Calculate the average rating for a paddle
 * Returns 0 if no reviews
 */
export function getAverageRating(paddleId: string): number {
  const reviews = getReviewsForPaddle(paddleId);
  if (reviews.length === 0) return 0;

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return parseFloat((sum / reviews.length).toFixed(1));
}

/**
 * Get the total review count for a paddle
 */
export function getReviewCount(paddleId: string): number {
  return MOCK_REVIEWS.filter(r => r.paddle_id === paddleId).length;
}

/**
 * Add a new review
 * Returns the created review object
 */
export function addReview(
  bookingId: string,
  paddleId: string,
  reviewerId: string,
  reviewerName: string,
  rating: number,
  comment: string
): Review {
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  if (comment && comment.length > 500) {
    throw new Error('Comment must be 500 characters or less');
  }

  const review: Review = {
    id: generateUUID(),
    booking_id: bookingId,
    paddle_id: paddleId,
    reviewer_id: reviewerId,
    reviewer_name: reviewerName,
    rating,
    comment,
    created_at: new Date()
  };

  MOCK_REVIEWS.push(review);
  console.log('[Review Added]', review);
  return review;
}

/**
 * Check if a user can review a specific booking
 * Returns true if:
 * - Booking status is 'completed'
 * - User hasn't already reviewed this booking
 */
export function canReviewBooking(booking: Booking, _userId: string): boolean {
  // Can only review if booking status is 'completed'
  if (booking.status !== 'completed') {
    return false;
  }

  // Check if user has already reviewed this booking
  const alreadyReviewed = MOCK_REVIEWS.find(r => r.booking_id === booking.id);
  return !alreadyReviewed;
}

/**
 * Check if a review already exists for a booking
 */
export function hasReviewForBooking(bookingId: string): boolean {
  return MOCK_REVIEWS.some(r => r.booking_id === bookingId);
}

/**
 * Get a review by booking ID
 */
export function getReviewByBookingId(bookingId: string): Review | undefined {
  return MOCK_REVIEWS.find(r => r.booking_id === bookingId);
}

/**
 * Format date for display
 */
export function formatReviewDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
