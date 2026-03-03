/**
 * Mock Authentication Module
 *
 * This is a placeholder authentication system that uses mock data.
 * When Supabase account is created and configured, this will be replaced
 * with real Supabase Auth.js calls.
 */

export interface User {
  id: string;
  email: string;
  name: string;
}

interface MockSession {
  user: User | null;
}

// In-memory store for mock sessions
const mockSessions = new Map<string, MockSession>();

// Mock registered users (in-memory storage for development)
const mockUsers = new Map<string, { email: string; password: string; name: string }>();

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Mock login function
 * Returns a mock user object if credentials are valid
 */
export async function mockLogin(
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> {
  console.log('[AUTH] Login attempt:', { email });

  if (!isValidEmail(email)) {
    console.log('[AUTH] Login failed: Invalid email format');
    return { user: null, error: 'Invalid email format' };
  }

  // Check if user exists in mock users
  const userRecord = mockUsers.get(email);
  if (!userRecord || userRecord.password !== password) {
    console.log('[AUTH] Login failed: Invalid credentials');
    return { user: null, error: 'Invalid email or password' };
  }

  const user: User = {
    id: `mock-user-${email.split('@')[0]}`,
    email,
    name: userRecord.name,
  };

  // Store session
  const sessionId = `session-${Date.now()}`;
  mockSessions.set(sessionId, { user });

  // Store in localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockAuthUser', JSON.stringify(user));
    localStorage.setItem('mockAuthSessionId', sessionId);
  }

  console.log('[AUTH] Login successful:', user);
  return { user, error: null };
}

/**
 * Mock register function
 * Creates a new mock user and returns the user object
 */
export async function mockRegister(
  email: string,
  password: string,
  name: string
): Promise<{ user: User | null; error: string | null }> {
  console.log('[AUTH] Register attempt:', { email, name });

  if (!isValidEmail(email)) {
    console.log('[AUTH] Register failed: Invalid email format');
    return { user: null, error: 'Invalid email format' };
  }

  if (password.length < 6) {
    console.log('[AUTH] Register failed: Password too short');
    return { user: null, error: 'Password must be at least 6 characters' };
  }

  if (mockUsers.has(email)) {
    console.log('[AUTH] Register failed: Email already exists');
    return { user: null, error: 'Email already registered' };
  }

  // Create new user
  const user: User = {
    id: `mock-user-${email.split('@')[0]}`,
    email,
    name,
  };

  mockUsers.set(email, { email, password, name });

  // Automatically log in after registration
  const sessionId = `session-${Date.now()}`;
  mockSessions.set(sessionId, { user });

  if (typeof window !== 'undefined') {
    localStorage.setItem('mockAuthUser', JSON.stringify(user));
    localStorage.setItem('mockAuthSessionId', sessionId);
  }

  console.log('[AUTH] Register successful:', user);
  return { user, error: null };
}

/**
 * Mock logout function
 * Clears the mock session
 */
export async function mockLogout(): Promise<void> {
  console.log('[AUTH] Logout');

  if (typeof window !== 'undefined') {
    localStorage.removeItem('mockAuthUser');
    localStorage.removeItem('mockAuthSessionId');
  }

  // Clear all sessions
  mockSessions.clear();
}

/**
 * Get current mock user from localStorage
 * Called on app load to restore session
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedUser = localStorage.getItem('mockAuthUser');
  if (!storedUser) {
    return null;
  }

  try {
    const user = JSON.parse(storedUser) as User;
    console.log('[AUTH] Retrieved user from session:', user);
    return user;
  } catch {
    console.log('[AUTH] Failed to parse stored user');
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

/**
 * Seed mock users for development
 * Call this once during app initialization
 */
export function seedMockUsers(): void {
  console.log('[AUTH] Seeding mock users');

  mockUsers.set('demo@example.com', {
    email: 'demo@example.com',
    password: 'demo123',
    name: 'Demo User',
  });

  mockUsers.set('test@example.com', {
    email: 'test@example.com',
    password: 'test123',
    name: 'Test User',
  });

  console.log('[AUTH] Mock users seeded. Available accounts:');
  console.log('  - demo@example.com / demo123');
  console.log('  - test@example.com / test123');
}
