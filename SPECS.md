# Tennis Paddle Booking System - Specifications

## Product Overview

A web-based booking system for tennis paddle rentals. Users can register, browse available paddles, check availability, make bookings, manage their reservations, and leave reviews. Admins manage inventory, pricing, and business analytics.

---

## Prioritized Building Blocks

### Phase 1: Core Infrastructure (Foundation)

#### **1.1 Project Setup & Authentication**

- **Status:** TODO
- **Priority:** P0 (Critical)
- **Description:** Initialize SvelteKit project with TypeScript, TailwindCSS, Supabase, and Auth.js setup.
- **User Requirements:**
  - System must support user registration and login
  - Sessions must persist across page reloads
  - Support email/password authentication initially
- **Feature Requirements:**
  - Auth.js configured with Supabase provider
  - Login/Register pages styled with TailwindCSS (DaisyUI)
  - Protected routes for authenticated users only
  - Error handling for auth failures
  - Toast notifications for feedback
- **Tech Stack:** SvelteKit, Svelte, TypeScript, TailwindCSS, Auth.js, Supabase
- **Acceptance Criteria:**
  - User can register with email/password
  - User can log in and see username in UI
  - Session persists on page reload
  - Unauthenticated users redirected to login
  - No sensitive data in client-side storage

---

#### **1.2 Database Schema & Supabase Setup**

- **Status:** TODO
- **Priority:** P0 (Critical)
- **Description:** Create PostgreSQL schema SQL file for Supabase (coordinator will execute in SQLEditor when account is ready).
- **User Requirements:**
  - System must track paddle inventory, bookings, and users
  - Support for multiple paddle types/brands
  - Booking availability checking
- **Feature Requirements:**
  - **SQL Migration File** (`src/lib/db/schema.sql`):
    - CREATE TABLE statements: `users`, `paddles`, `bookings`, `reviews`, `paddle_availability`
    - Proper indexes on `user_id`, `paddle_id`, `booking_dates`
    - Foreign key relationships with CASCADE rules
    - Row-level security (RLS) policy templates (commented, ready to enable)
    - Audit columns (created_at, updated_at, created_by)
    - Insert 2-3 seed paddle records for testing
  - **Placeholder Config** (`src/lib/config.ts`):
    - Export Supabase URL, anon key, service role key as empty strings or env vars
    - Environment variables in `.env.example` (no real values)
  - **Frontend Auth Placeholder** (`src/lib/auth.ts`):
    - Mock auth functions that return dummy user data
    - Console logs instead of actual Supabase calls
    - Ready to swap for real Supabase when account exists
- **Tech Stack:** SQL + TypeScript stubs
- **Acceptance Criteria:**
  - `schema.sql` is valid PostgreSQL (syntax-checked)
  - Can be copy-pasted into Supabase SQLEditor without errors
  - All tables, indexes, FKs defined
  - RLS policies included (commented, with enabling instructions)
  - 2-3 seed paddle records included
  - `.env.example` has placeholders for Supabase keys
  - Frontend auth is mocked (no actual Supabase calls until account exists)
  - Documentation in `schema.sql` explains what coordinator needs to do

---

### Phase 2: User-Facing Features

#### **2.1 Paddle Inventory Browse**

- **Status:** TODO
- **Priority:** P1 (High)
- **Description:** Display list of available paddles with details (brand, model, price, images, ratings).
- **User Requirements:**
  - Users must see all available paddles with prices
  - Users want to filter by type/brand
  - Users want to see paddle ratings and availability
- **Feature Requirements:**
  - Grid/list view of paddles with images
  - Filter controls (paddle type, price range, brand)
  - Search functionality
  - Display current availability status
  - Average rating badge
  - "View Details" link to paddle page
- **Tech Stack:** SvelteKit, Svelte, TailwindCSS (DaisyUI cards)
- **Acceptance Criteria:**
  - Paddles load from Supabase
  - Filters work (apply, reset)
  - Search is case-insensitive and works on brand/model
  - Images load correctly
  - Mobile responsive
  - Page loads in <2 seconds

---

#### **2.2 Paddle Detail Page**

- **Status:** TODO
- **Priority:** P1 (High)
- **Description:** Single paddle detail view with full specs, images, reviews, and booking form.
- **User Requirements:**
  - Users want to see complete paddle specs
  - Users want to read other users' reviews
  - Users want to book directly from this page
- **Feature Requirements:**
  - Image carousel/gallery
  - Full paddle specifications (model, brand, weight, grip type, etc.)
  - Review section with ratings and comments
  - Calendar/date picker for availability check
  - "Book Now" button
  - Related paddles section
- **Tech Stack:** SvelteKit, Svelte, TailwindCSS
- **Acceptance Criteria:**
  - All paddle info displays correctly
  - Reviews render with proper formatting
  - Calendar shows available/unavailable dates
  - "Book Now" takes user to booking checkout
  - Page is fully responsive

---

#### **2.3 Booking Checkout Flow**

- **Status:** TODO
- **Priority:** P1 (High)
- **Description:** Multi-step checkout: select dates, enter delivery details, confirm, process payment.
- **User Requirements:**
  - Users must be able to book paddles for specific dates
  - Users must provide delivery address
  - Users want to see total cost breakdown
- **Feature Requirements:**
  - Step 1: Date range picker (start/end date)
  - Step 2: Delivery address form
  - Step 3: Order summary with cost calculation
  - Step 4: Payment method selection (placeholder for Stripe integration)
  - Order confirmation page
  - Email confirmation sent to user
  - Booking stored in database
- **Tech Stack:** SvelteKit, Svelte, TailwindCSS, Supabase
- **Acceptance Criteria:**
  - All form validations work
  - Cost calculation is correct (price × days)
  - Booking created in database with user reference
  - Confirmation email triggered (dev: log to console)
  - User redirected to confirmation page
  - No double-booking (validate availability before create)

---

#### **2.4 User Dashboard & Booking History**

- **Status:** TODO
- **Priority:** P2 (Medium)
- **Description:** User dashboard showing active bookings, past bookings, and ability to cancel/modify.
- **User Requirements:**
  - Users want to see their bookings
  - Users want to cancel upcoming bookings
  - Users want to review completed bookings
- **Feature Requirements:**
  - Tabs: Active Bookings, Past Bookings
  - Each booking card shows paddle, dates, status, total cost
  - "Cancel Booking" button with confirmation dialog
  - "Leave Review" button for completed bookings
  - Booking details modal/page
  - Status indicators (Confirmed, In Progress, Completed, Cancelled)
- **Tech Stack:** SvelteKit, Svelte, TailwindCSS
- **Acceptance Criteria:**
  - Shows only user's own bookings
  - Cancel button updates status to Cancelled
  - Can't cancel within 24 hours of start date
  - All booking info displays accurately
  - Responsive layout

---

#### **2.5 Review & Rating System**

- **Status:** TODO
- **Priority:** P2 (Medium)
- **Description:** Allow users to leave 1-5 star ratings and text reviews on rented paddles.
- **User Requirements:**
  - Users want to rate paddles they've rented
  - Users want to read reviews from other renters
  - System must calculate and display average rating
- **Feature Requirements:**
  - Review submission form (stars + text)
  - Review validation (user can only review completed bookings, one per booking)
  - Review listing on paddle detail page
  - Average rating calculation
  - Sort reviews by date/rating
  - Edit/delete own review
- **Tech Stack:** SvelteKit, Svelte, TailwindCSS, Supabase
- **Acceptance Criteria:**
  - User can submit review only for completed bookings
  - Rating displays as stars
  - Average rating updates immediately
  - User can edit/delete their own review
  - Reviews sorted by newest first
  - No duplicate reviews for same booking

---

### Phase 3: Admin & Business Features

#### **3.1 Admin Dashboard**

- **Status:** TODO
- **Priority:** P3 (Medium)
- **Description:** Admin-only dashboard with overview of bookings, revenue, and paddle stats.
- **User Requirements:**
  - Admins need to monitor bookings and revenue
  - Admins need to see inventory status
  - Admins want quick business metrics
- **Feature Requirements:**
  - Welcome card with key metrics (total bookings, revenue this month, active bookings)
  - Quick access links to admin sections
  - Recent bookings table
  - Paddle status overview
  - Chart: monthly revenue trend (optional)
- **Tech Stack:** SvelteKit, Svelte, TailwindCSS, Supabase
- **Acceptance Criteria:**
  - Only admins can access (role-based guard)
  - Metrics load correctly
  - Responsive layout
  - Data updates in real-time or on refresh

---

#### **3.2 Paddle Inventory Management**

- **Status:** TODO
- **Priority:** P3 (Medium)
- **Description:** CRUD operations for paddles (create, read, update, delete) with image uploads.
- **User Requirements:**
  - Admins must add new paddles to system
  - Admins must update paddle info and pricing
  - Admins must remove paddles
- **Feature Requirements:**
  - Table of all paddles with inline edit/delete
  - "Add Paddle" form (brand, model, type, price, weight, grip, description)
  - Image upload (single image)
  - Form validation
  - Delete confirmation dialog
  - Success/error notifications
- **Tech Stack:** SvelteKit, Svelte, TailwindCSS, Supabase (storage)
- **Acceptance Criteria:**
  - Add paddle form submits correctly
  - Images upload to Supabase Storage
  - Update form prefills current data
  - Delete removes paddle and image
  - Validation prevents bad data
  - Images display correctly in inventory table

---

#### **3.3 Booking Management**

- **Status:** TODO
- **Priority:** P3 (Medium)
- **Description:** Admin view of all bookings with ability to update status, view details, and manage issues.
- **User Requirements:**
  - Admins need to see all bookings (not just their own)
  - Admins need to update booking status
  - Admins need to handle cancellations/disputes
- **Feature Requirements:**
  - Sortable/filterable table: date range, status, user, paddle
  - Booking detail modal with full info
  - Status update dropdown (Pending → Confirmed → In Progress → Completed / Cancelled)
  - Email notification on status change
  - Search by user/paddle
  - Export bookings as CSV (optional)
- **Tech Stack:** SvelteKit, Svelte, TailwindCSS, Supabase
- **Acceptance Criteria:**
  - All bookings display in table
  - Filters work correctly
  - Status updates reflect in database
  - Email notifications sent on status change
  - Responsive table (overflow handling on mobile)

---

#### **3.4 Analytics & Reporting**

- **Status:** TODO
- **Priority:** P4 (Low)
- **Description:** Revenue, occupancy, and paddle performance reports.
- **User Requirements:**
  - Admins want to understand business performance
  - Admins want to know which paddles are popular
  - Admins want revenue breakdowns
- **Feature Requirements:**
  - Date range selector
  - Monthly revenue chart
  - Paddle popularity ranking (most booked)
  - Occupancy rate (booked days / total days %)
  - Booking summary stats
  - Download report as PDF
- **Tech Stack:** SvelteKit, Svelte, TailwindCSS, Chart library (Chart.js or Recharts)
- **Acceptance Criteria:**
  - Charts render correctly
  - Date filters work
  - Numbers are accurate
  - PDF export functional
  - Responsive on mobile

---

## Dependencies & Sequencing

```
1.1 (Auth) → 1.2 (DB Schema)
     ↓
     ├→ 2.1 (Browse Paddles)
     ├→ 2.2 (Paddle Detail)
     ├→ 2.3 (Booking Checkout)
     └→ 3.2 (Paddle Inventory Mgmt)

2.3 (Booking) → 2.4 (Dashboard)
             → 2.5 (Reviews)

3.2 (Inventory) → 3.1 (Admin Dashboard)
               → 3.3 (Booking Mgmt)

3.1, 3.3 → 3.4 (Analytics)
```

---

## Testing Requirements (Per Block)

- Unit tests for utility functions
- Integration tests for API calls (Supabase)
- E2E test scenarios:
  - User registration → login → browse → book → review
  - Admin add paddle → edit → delete
- Manual testing on mobile (iOS/Android)

---

## Success Metrics

- All P0/P1 features completed and tested
- Mobile responsive (viewport 320px - 1920px)
- Page load time <3 seconds
- No console errors
- Accessibility: WCAG AA compliance for text/buttons
