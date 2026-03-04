export type Currency = 'USD' | 'EUR' | 'SEK' | 'GBP' | 'NOK' | 'DKK' | 'CHF';

export interface Club {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  phone: string;
  location: string; // address
  city: string;
  logo_url: string;
  description: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  currency: Currency;
  currency_symbol: string;
  booker_visibility: boolean; // show names in public calendar?
  stripe_account_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClubSignupInput {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  city: string;
  currency: Currency;
}

export interface ClubProfileUpdate {
  name: string;
  phone: string;
  location: string;
  city: string;
  logo_url: string;
  description: string;
  booker_visibility: boolean;
}

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  SEK: 'kr',
  GBP: '£',
  NOK: 'kr',
  DKK: 'kr',
  CHF: 'CHF'
};

// Password hashing with bcryptjs
// Note: This is server-side code. Never call these from client components.
import bcryptjs from 'bcryptjs';

function hashPassword(password: string): string {
  // Synchronous hash (acceptable for mock data initialization)
  const salt = bcryptjs.genSaltSync(10);
  return bcryptjs.hashSync(password, salt);
}

function verifyPassword(password: string, hash: string): boolean {
  return bcryptjs.compareSync(password, hash);
}

// Mock clubs storage
// eslint-disable-next-line prefer-const
export let MOCK_CLUBS: Club[] = [
  {
    id: 'club-001',
    name: 'Downtown Tennis Club',
    email: 'admin@downtowntennisclub.com',
    password_hash: hashPassword('demo123'),
    phone: '+46123456789',
    location: '123 Main Street',
    city: 'Stockholm',
    logo_url: 'https://images.unsplash.com/photo-1554224311-beee415c15c7?w=300&h=300&fit=crop',
    description: 'Premier indoor and outdoor tennis facilities',
    subscription_tier: 'pro',
    currency: 'SEK',
    currency_symbol: 'kr',
    booker_visibility: false,
    stripe_account_id: null,
    created_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-03-04T12:00:00Z'
  },
  {
    id: 'club-002',
    name: 'Padel Paradise',
    email: 'contact@padelparadise.com',
    password_hash: hashPassword('padel456'),
    phone: '+46987654321',
    location: '456 Sport Avenue',
    city: 'Gothenburg',
    logo_url: 'https://images.unsplash.com/photo-1554224311-beee415c15c7?w=300&h=300&fit=crop',
    description: 'Top-rated padel courts for all levels',
    subscription_tier: 'free',
    currency: 'SEK',
    currency_symbol: 'kr',
    booker_visibility: true,
    stripe_account_id: null,
    created_at: '2026-02-15T14:30:00Z',
    updated_at: '2026-03-04T12:00:00Z'
  }
];

// Club CRUD Operations
export function createClub(input: ClubSignupInput): Club {
  const id = `club-${Date.now()}`;
  const club: Club = {
    id,
    name: input.name,
    email: input.email,
    password_hash: hashPassword(input.password),
    phone: input.phone,
    location: input.location,
    city: input.city,
    logo_url: '',
    description: '',
    subscription_tier: 'free', // default tier for new clubs
    currency: input.currency,
    currency_symbol: CURRENCY_SYMBOLS[input.currency],
    booker_visibility: false, // default: private
    stripe_account_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  MOCK_CLUBS.push(club);
  return club;
}

export function getClubById(id: string): Club | undefined {
  return MOCK_CLUBS.find(c => c.id === id);
}

export function getClubByEmail(email: string): Club | undefined {
  return MOCK_CLUBS.find(c => c.email === email);
}

export function updateClubProfile(id: string, updates: ClubProfileUpdate): Club | null {
  const club = getClubById(id);
  if (!club) return null;

  club.name = updates.name;
  club.phone = updates.phone;
  club.location = updates.location;
  club.city = updates.city;
  club.logo_url = updates.logo_url;
  club.description = updates.description;
  club.booker_visibility = updates.booker_visibility;
  club.updated_at = new Date().toISOString();

  return club;
}

export function updateClubCurrency(id: string, currency: Currency): Club | null {
  const club = getClubById(id);
  if (!club) return null;

  club.currency = currency;
  club.currency_symbol = CURRENCY_SYMBOLS[currency];
  club.updated_at = new Date().toISOString();

  return club;
}

export function authenticateClub(email: string, password: string): Club | null {
  const club = getClubByEmail(email);
  if (!club || !verifyPassword(password, club.password_hash)) {
    return null;
  }
  return club;
}

export function validateClubSignup(input: ClubSignupInput): string[] {
  const errors: string[] = [];

  if (!input.name || input.name.trim().length < 2) {
    errors.push('Club name must be at least 2 characters');
  }

  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.push('Valid email required');
  }

  if (getClubByEmail(input.email)) {
    errors.push('Email already registered');
  }

  if (!input.password || input.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (!input.phone || input.phone.trim().length < 5) {
    errors.push('Valid phone number required');
  }

  if (!input.location || input.location.trim().length < 3) {
    errors.push('Location required');
  }

  if (!input.city || input.city.trim().length < 2) {
    errors.push('City required');
  }

  return errors;
}

export function getAllClubs(): Club[] {
  return MOCK_CLUBS;
}
