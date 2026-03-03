<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth';
  import { browser } from '$app/environment';

  onMount(async () => {
    if (!browser) return;

    // Small delay to ensure auth store is populated
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Redirect based on auth status
    if ($authStore) {
      await goto('/dashboard');
    } else {
      await goto('/login');
    }
  });
</script>

<!-- Loading state while redirecting -->
<div class="min-h-screen flex items-center justify-center bg-base-100">
  <div class="flex flex-col items-center gap-4">
    <div class="loading loading-spinner loading-lg" />
    <p class="text-lg opacity-70">Redirecting...</p>
  </div>
</div>
