import { seedMockUsers } from '$lib/auth';

export function load() {
  // Seed mock users once on app load
  seedMockUsers();
}
