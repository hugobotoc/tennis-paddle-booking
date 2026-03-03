import { seedMockUsers } from '$lib/auth';

/**
 * Root layout load function
 * Runs once when the app first loads
 * Seeds mock users for testing (demo@example.com / demo123, test@example.com / test123)
 * This will be removed when real Supabase auth is integrated
 */
export function load() {
  // Initialize mock authentication
  // Logs to browser console showing available demo credentials
  seedMockUsers();
}
