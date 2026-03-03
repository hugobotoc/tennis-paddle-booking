// Mock paddle data for development
// This will be replaced with real Supabase queries once the backend is ready

export interface Paddle {
  id: string;
  name: string;
  brand: string;
  model: string;
  price_per_hour: number;
  condition: 'excellent' | 'good' | 'fair';
  image_url: string;
  weight: string;
  grip_type: string;
  material: string;
  frame_thickness: string;
  avg_rating: number;
  total_reviews: number;
  available_now: boolean;
  description: string;
}

export interface Review {
  id: string;
  paddle_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export const MOCK_PADDLES: Paddle[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Pro Power Paddle',
    brand: 'Wilson',
    model: 'Pro Power Pro',
    price_per_hour: 15,
    condition: 'excellent',
    image_url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34c8?w=400&h=400&fit=crop',
    weight: '88-100g',
    grip_type: 'Oversize',
    material: 'Graphite Composite',
    frame_thickness: '16mm',
    avg_rating: 4.8,
    total_reviews: 23,
    available_now: true,
    description: 'Premium paddle for advanced players. Excellent control and power.'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Speed Storm',
    brand: 'Head',
    model: 'Prestige Speed',
    price_per_hour: 12,
    condition: 'good',
    image_url: 'https://images.unsplash.com/photo-1521575107034-e3978ccf0ee5?w=400&h=400&fit=crop',
    weight: '95-105g',
    grip_type: 'Standard',
    material: 'Carbon Fiber',
    frame_thickness: '18mm',
    avg_rating: 4.5,
    total_reviews: 15,
    available_now: true,
    description: 'Fast and responsive paddle for intermediate players.'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Classic Touch',
    brand: 'Yonex',
    model: 'Vcore 98',
    price_per_hour: 18,
    condition: 'excellent',
    image_url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34c8?w=400&h=400&fit=crop',
    weight: '82-92g',
    grip_type: 'Mid Size',
    material: 'Aluminum Alloy',
    frame_thickness: '14mm',
    avg_rating: 4.9,
    total_reviews: 31,
    available_now: true,
    description: 'Perfect balance of control and power for all skill levels.'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Beginner Buddy',
    brand: 'Dunlop',
    model: 'Nitro Beginners',
    price_per_hour: 8,
    condition: 'good',
    image_url: 'https://images.unsplash.com/photo-1461986672716-aa6ffd9453a7?w=400&h=400&fit=crop',
    weight: '100-110g',
    grip_type: 'Large',
    material: 'Fiberglass',
    frame_thickness: '20mm',
    avg_rating: 4.2,
    total_reviews: 8,
    available_now: true,
    description: 'Ideal for beginners learning the game. Forgiving and easy to use.'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Pro Tour Elite',
    brand: 'Babolat',
    model: 'Pure Aero',
    price_per_hour: 20,
    condition: 'excellent',
    image_url: 'https://images.unsplash.com/photo-1504674900769-7b8f3e3accc9?w=400&h=400&fit=crop',
    weight: '88-92g',
    grip_type: 'Oversize',
    material: 'Graphite Composite',
    frame_thickness: '16mm',
    avg_rating: 4.7,
    total_reviews: 42,
    available_now: false,
    description: 'Tournament-grade paddle used by professionals worldwide.'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'All Court Master',
    brand: 'Prince',
    model: 'Beast 100',
    price_per_hour: 14,
    condition: 'fair',
    image_url: 'https://images.unsplash.com/photo-1537746727612-245e4a92ef08?w=400&h=400&fit=crop',
    weight: '95-100g',
    grip_type: 'Mid Size',
    material: 'Graphite',
    frame_thickness: '17mm',
    avg_rating: 4.3,
    total_reviews: 12,
    available_now: true,
    description: 'Versatile paddle for all playing styles. Slightly worn but fully functional.'
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    paddle_id: '550e8400-e29b-41d4-a716-446655440001',
    reviewer_name: 'John D.',
    rating: 5,
    comment: 'Great paddle, played perfectly! Excellent control and power.',
    created_at: '2026-02-28'
  },
  {
    id: '2',
    paddle_id: '550e8400-e29b-41d4-a716-446655440001',
    reviewer_name: 'Sarah M.',
    rating: 5,
    comment: 'Best paddle I have ever used. Highly recommend!',
    created_at: '2026-02-25'
  },
  {
    id: '3',
    paddle_id: '550e8400-e29b-41d4-a716-446655440001',
    reviewer_name: 'Mike T.',
    rating: 4,
    comment: 'Very good paddle. Only minor wear on the grip.',
    created_at: '2026-02-20'
  },
  {
    id: '4',
    paddle_id: '550e8400-e29b-41d4-a716-446655440002',
    reviewer_name: 'Emma L.',
    rating: 5,
    comment: 'Incredibly fast! Perfect for my playing style.',
    created_at: '2026-02-27'
  },
  {
    id: '5',
    paddle_id: '550e8400-e29b-41d4-a716-446655440002',
    reviewer_name: 'David K.',
    rating: 4,
    comment: 'Good paddle, responsive. Worth the rental price.',
    created_at: '2026-02-22'
  },
  {
    id: '6',
    paddle_id: '550e8400-e29b-41d4-a716-446655440003',
    reviewer_name: 'Lisa P.',
    rating: 5,
    comment: 'Outstanding balance! Great for all playing styles.',
    created_at: '2026-02-26'
  },
  {
    id: '7',
    paddle_id: '550e8400-e29b-41d4-a716-446655440003',
    reviewer_name: 'Alex R.',
    rating: 5,
    comment: 'Perfect paddle for intermediate players like me.',
    created_at: '2026-02-24'
  },
  {
    id: '8',
    paddle_id: '550e8400-e29b-41d4-a716-446655440004',
    reviewer_name: 'Tom B.',
    rating: 4,
    comment: 'Great for beginners. Easy to control.',
    created_at: '2026-02-23'
  }
];

// Helper function to get paddle by ID
export function getPaddleById(id: string): Paddle | undefined {
  return MOCK_PADDLES.find(p => p.id === id);
}

// Helper function to get reviews for a paddle
export function getReviewsForPaddle(paddleId: string): Review[] {
  return MOCK_REVIEWS.filter(r => r.paddle_id === paddleId);
}

// Helper function to get related paddles (excluding the current one)
export function getRelatedPaddles(paddleId: string, limit: number = 4): Paddle[] {
  return MOCK_PADDLES
    .filter(p => p.id !== paddleId)
    .slice(0, limit);
}

// Helper to calculate average rating for a paddle
export function getAverageRating(paddleId: string): number {
  const reviews = getReviewsForPaddle(paddleId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
