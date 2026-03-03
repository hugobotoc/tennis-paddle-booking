-- ============================================================================
-- Tennis Paddle Booking System - PostgreSQL Database Schema
-- ============================================================================
--
-- RELATIONSHIP DIAGRAM:
--
--     users
--       |
--       ├── paddles (owner_id FK)
--       ├── bookings (user_id FK)
--       └── reviews (reviewer_id FK)
--
--     bookings
--       ├── paddle_id FK → paddles
--       └── user_id FK → users
--
--     reviews
--       ├── booking_id FK → bookings
--       └── reviewer_id FK → users
--
-- All IDs are UUIDs (auto-generated with uuid_generate_v4())
-- All timestamps use CURRENT_TIMESTAMP
-- All foreign keys use ON DELETE CASCADE
--
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
-- Stores user accounts and profiles
--
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS 'User accounts and profiles';
COMMENT ON COLUMN users.id IS 'Unique user identifier (UUID)';
COMMENT ON COLUMN users.email IS 'User email address (unique)';
COMMENT ON COLUMN users.name IS 'User display name';
COMMENT ON COLUMN users.created_at IS 'Account creation timestamp';

-- ============================================================================
-- PADDLES TABLE
-- ============================================================================
-- Stores paddle inventory with owner (renter) information
--
CREATE TABLE paddles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  brand VARCHAR(100) NOT NULL,
  condition VARCHAR(50) NOT NULL, -- 'excellent', 'good', 'fair', 'poor'
  hourly_rate DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

COMMENT ON TABLE paddles IS 'Paddle inventory with owner (renter) information';
COMMENT ON COLUMN paddles.id IS 'Unique paddle identifier (UUID)';
COMMENT ON COLUMN paddles.owner_id IS 'User ID of paddle owner/renter';
COMMENT ON COLUMN paddles.name IS 'Paddle model name';
COMMENT ON COLUMN paddles.description IS 'Detailed description of paddle';
COMMENT ON COLUMN paddles.brand IS 'Paddle brand (e.g., Babolat, Wilson)';
COMMENT ON COLUMN paddles.condition IS 'Paddle condition (excellent, good, fair, poor)';
COMMENT ON COLUMN paddles.hourly_rate IS 'Hourly rental rate in USD';
COMMENT ON COLUMN paddles.image_url IS 'URL to paddle image (Supabase Storage)';
COMMENT ON COLUMN paddles.created_at IS 'Paddle listing creation timestamp';

-- ============================================================================
-- BOOKINGS TABLE
-- ============================================================================
-- Stores paddle rental bookings with dates and pricing
--
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paddle_id UUID NOT NULL,
  user_id UUID NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paddle_id) REFERENCES paddles(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

COMMENT ON TABLE bookings IS 'Paddle rental bookings with dates and pricing';
COMMENT ON COLUMN bookings.id IS 'Unique booking identifier (UUID)';
COMMENT ON COLUMN bookings.paddle_id IS 'ID of paddle being booked';
COMMENT ON COLUMN bookings.user_id IS 'ID of user making the booking';
COMMENT ON COLUMN bookings.start_time IS 'Booking start date/time';
COMMENT ON COLUMN bookings.end_time IS 'Booking end date/time';
COMMENT ON COLUMN bookings.total_price IS 'Total booking price in USD';
COMMENT ON COLUMN bookings.status IS 'Booking status (pending, confirmed, cancelled, completed)';
COMMENT ON COLUMN bookings.created_at IS 'Booking creation timestamp';

-- ============================================================================
-- REVIEWS TABLE
-- ============================================================================
-- Stores user reviews of completed bookings
--
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL,
  reviewer_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE
);

COMMENT ON TABLE reviews IS 'User reviews of completed bookings';
COMMENT ON COLUMN reviews.id IS 'Unique review identifier (UUID)';
COMMENT ON COLUMN reviews.booking_id IS 'ID of booking being reviewed';
COMMENT ON COLUMN reviews.reviewer_id IS 'ID of user leaving the review';
COMMENT ON COLUMN reviews.rating IS 'Star rating (1-5)';
COMMENT ON COLUMN reviews.comment IS 'Review comment text';
COMMENT ON COLUMN reviews.created_at IS 'Review creation timestamp';

-- ============================================================================
-- INDEXES
-- ============================================================================
-- Performance indexes for common query patterns
--

-- Bookings queries
CREATE INDEX idx_bookings_paddle_id ON bookings(paddle_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Paddles queries
CREATE INDEX idx_paddles_owner_id ON paddles(owner_id);

-- Reviews queries
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);

-- ============================================================================
-- SEED DATA - Demo User & Paddles
-- ============================================================================
-- Insert one demo user and 5 sample paddles for testing
--

-- Demo user (account owner)
INSERT INTO users (id, email, name, created_at) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'demo@example.com',
  'Demo User',
  CURRENT_TIMESTAMP
);

-- Sample paddles (different brands, conditions, price points)
INSERT INTO paddles (id, owner_id, name, description, brand, condition, hourly_rate, image_url, created_at) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440001',
    'Babolat Pure Drive',
    'Professional-grade paddle with excellent control and power. Lightly used, in pristine condition.',
    'Babolat',
    'excellent',
    15.00,
    'https://via.placeholder.com/300?text=Babolat+Pure+Drive',
    CURRENT_TIMESTAMP
  ),
  (
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440001',
    'Wilson Pro Staff',
    'Classic professional paddle with great feel. Well-maintained, some cosmetic wear.',
    'Wilson',
    'good',
    12.50,
    'https://via.placeholder.com/300?text=Wilson+Pro+Staff',
    CURRENT_TIMESTAMP
  ),
  (
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440001',
    'Yonex Ezone',
    'Lightweight paddle ideal for beginners and intermediate players.',
    'Yonex',
    'good',
    10.00,
    'https://via.placeholder.com/300?text=Yonex+Ezone',
    CURRENT_TIMESTAMP
  ),
  (
    '550e8400-e29b-41d4-a716-446655440014',
    '550e8400-e29b-41d4-a716-446655440001',
    'Head Graphene',
    'Advanced graphene composite paddle. Minor cosmetic damage, fully functional.',
    'Head',
    'fair',
    8.00,
    'https://via.placeholder.com/300?text=Head+Graphene',
    CURRENT_TIMESTAMP
  ),
  (
    '550e8400-e29b-41d4-a716-446655440013',
    '550e8400-e29b-41d4-a716-446655440001',
    'Dunlop Biomimetic',
    'Budget-friendly paddle. Shows signs of use but still performs well.',
    'Dunlop',
    'fair',
    5.00,
    'https://via.placeholder.com/300?text=Dunlop+Biomimetic',
    CURRENT_TIMESTAMP
  );

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES - TEMPLATE
-- ============================================================================
-- FUTURE: Enable RLS on all tables when Supabase is configured
-- Uncomment and enable the following policies in Supabase dashboard
--
-- INSTRUCTIONS:
-- 1. Go to Supabase dashboard > SQL Editor
-- 2. Copy each policy block and execute
-- 3. Policies will enforce data isolation per user
--
-- ============================================================================

-- -- Enable RLS on all tables
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE paddles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
--
-- -- USERS POLICIES
-- -- Users can only view their own profile
-- CREATE POLICY "Users can view own profile" ON users
--   FOR SELECT
--   USING (auth.uid()::text = id::text);
--
-- -- Users can update their own profile
-- CREATE POLICY "Users can update own profile" ON users
--   FOR UPDATE
--   USING (auth.uid()::text = id::text);
--
-- -- PADDLES POLICIES
-- -- All users can view all paddles (public listing)
-- CREATE POLICY "Paddles are publicly readable" ON paddles
--   FOR SELECT
--   USING (true);
--
-- -- Users can only create paddles (own paddles)
-- CREATE POLICY "Users can create paddles" ON paddles
--   FOR INSERT
--   WITH CHECK (auth.uid()::text = owner_id::text);
--
-- -- Users can update their own paddles
-- CREATE POLICY "Users can update own paddles" ON paddles
--   FOR UPDATE
--   USING (auth.uid()::text = owner_id::text);
--
-- -- Users can delete their own paddles
-- CREATE POLICY "Users can delete own paddles" ON paddles
--   FOR DELETE
--   USING (auth.uid()::text = owner_id::text);
--
-- -- BOOKINGS POLICIES
-- -- Users can view their own bookings
-- CREATE POLICY "Users can view own bookings" ON bookings
--   FOR SELECT
--   USING (auth.uid()::text = user_id::text);
--
-- -- Users can create bookings for themselves
-- CREATE POLICY "Users can create own bookings" ON bookings
--   FOR INSERT
--   WITH CHECK (auth.uid()::text = user_id::text);
--
-- -- Users can update their own bookings
-- CREATE POLICY "Users can update own bookings" ON bookings
--   FOR UPDATE
--   USING (auth.uid()::text = user_id::text);
--
-- -- REVIEWS POLICIES
-- -- All users can view all reviews (public feedback)
-- CREATE POLICY "Reviews are publicly readable" ON reviews
--   FOR SELECT
--   USING (true);
--
-- -- Users can create reviews for their own bookings
-- CREATE POLICY "Users can create reviews for own bookings" ON reviews
--   FOR INSERT
--   WITH CHECK (auth.uid()::text = reviewer_id::text);
--
-- -- Users can only update their own reviews
-- CREATE POLICY "Users can update own reviews" ON reviews
--   FOR UPDATE
--   USING (auth.uid()::text = reviewer_id::text);

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
