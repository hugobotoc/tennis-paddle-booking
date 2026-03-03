/**
 * Auth Guard for Protected Routes
 *
 * This module is kept for backward compatibility but is deprecated.
 * Server-side auth checks with localStorage don't work on SSR.
 * 
 * Instead, use client-side checks in your page components:
 * ```svelte
 * <script lang="ts">
 *   import { goto } from '$app/navigation';
 *   import { authStore } from '$lib/stores/auth';
 *   import { onMount } from 'svelte';
 *
 *   onMount(() => {
 *     if (!$authStore) {
 *       goto('/login');
 *     }
 *   });
 * </script>
 * ```
 */

// This file is deprecated. Use client-side checks instead.
