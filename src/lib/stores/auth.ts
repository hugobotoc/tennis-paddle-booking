/**
 * Auth Store
 *
 * Writable store for managing the current user state.
 * Ready to be replaced with real Supabase auth.js when available.
 */

import { writable, type Writable } from 'svelte/store';
import { getCurrentUser, type User } from '$lib/auth';

function createAuthStore(): Writable<User | null> {
  const { subscribe, set, update } = writable<User | null>(null);

  // Initialize with current user on store creation
  if (typeof window !== 'undefined') {
    const user = getCurrentUser();
    set(user);
  }

  return {
    subscribe,
    set,
    update,
    login: async (user: User) => {
      set(user);
    },
    logout: async () => {
      set(null);
    },
  };
}

export const authStore = createAuthStore();
