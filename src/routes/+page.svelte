<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { isAuthenticated } from '$lib/auth';

  onMount(async () => {
    // If user is authenticated, redirect to dashboard
    if (isAuthenticated()) {
      await goto('/dashboard');
    } else {
      // Otherwise redirect to login
      await goto('/login');
    }
  });
</script>

<!-- Loading state while redirecting -->
<div class="min-h-screen flex items-center justify-center">
  <div class="flex flex-col items-center gap-4">
    <div class="loading loading-spinner loading-lg" />
    <p class="text-lg opacity-70">Loading...</p>
  </div>
</div>
