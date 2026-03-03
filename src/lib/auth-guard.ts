/**
 * Auth Guard for Protected Routes
 *
 * Use this in +layout.ts files to protect routes from unauthenticated access.
 */

import { redirect } from '@sveltejs/kit';
import { isAuthenticated } from '$lib/auth';

/**
 * Guard function to protect routes
 * Redirects unauthenticated users to login page
 */
export function protectRoute(): void {
  if (!isAuthenticated()) {
    console.log('[AUTH] Unauthenticated access attempt - redirecting to login');
    redirect(303, '/login');
  }
}
