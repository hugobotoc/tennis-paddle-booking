/**
 * Auth Store
 *
 * Writable store for managing the current user state.
 * Ready to be replaced with real Supabase auth.js when available.
 */

import { writable, type Writable } from 'svelte/store';
import { getCurrentUser, mockLogout, type User } from '$lib/auth';

/**
 * Custom store interface that extends Writable with auth methods
 */
interface AuthStore extends Writable<User | null> {
  login(user: User): Promise<void>;
  logout(): Promise<void>;
}

/**
 * Create the auth store with proper TypeScript support
 */
function createAuthStore(): AuthStore {
  const { subscribe, set } = writable<User | null>(getCurrentUser());

  return {
    subscribe,
    set,
    update: (fn) => {
      // update is exposed but not recommended; use login/logout instead
      const current = getCurrentUser();
      const updated = fn(current);
      if (updated !== current) {
        set(updated);
      }
    },
    async login(user: User) {
      set(user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mockAuthUser', JSON.stringify(user));
      }
    },
    async logout() {
      set(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mockAuthUser');
        localStorage.removeItem('mockAuthSessionId');
      }
      await mockLogout();
    },
  };
}

export const authStore: AuthStore = createAuthStore();
