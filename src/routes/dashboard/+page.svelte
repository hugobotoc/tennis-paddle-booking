<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { onMount } from 'svelte';

  let isLoading = true;

  onMount(() => {
    // Client-side auth check (only runs in browser, not on SSR)
    if (!$authStore) {
      goto('/login');
    }
    isLoading = false;
  });

  async function handleLogout() {
    await authStore.logout();
    await goto('/login');
  }
</script>

{#if isLoading}
  <div class="min-h-screen flex items-center justify-center bg-base-100">
    <div class="flex flex-col items-center gap-4">
      <div class="loading loading-spinner loading-lg" />
      <p class="text-lg opacity-70">Loading...</p>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-base-100">
    <!-- Navigation Bar -->
  <div class="navbar bg-base-200 shadow">
    <div class="flex-1">
      <a href="/dashboard" class="btn btn-ghost normal-case text-xl"> 🎾 Tennis Paddle Booking </a>
    </div>
    <div class="flex-none gap-2">
      <div class="dropdown dropdown-end">
        <button tabindex="0" class="btn btn-ghost btn-circle avatar">
          <div
            class="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center"
          >
            {#if $authStore?.name}
              {$authStore.name.charAt(0).toUpperCase()}
            {:else}
              U
            {/if}
          </div>
        </button>
        <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <div>{$authStore?.name || 'User'}</div>
          </li>
          <li>
            <div>{$authStore?.email || 'email'}</div>
          </li>
          <li>
            <a href="/profile">Profile</a>
          </li>
          <li>
            <button on:click={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="p-4 md:p-8 max-w-6xl mx-auto">
    <!-- Welcome Section -->
    <div class="card bg-gradient-to-r from-primary to-primary-focus shadow-xl mb-8">
      <div class="card-body text-white">
        <h1 class="card-title text-3xl md:text-4xl">
          Welcome, {$authStore?.name || 'User'}! 👋
        </h1>
        <p class="opacity-90">You are logged in as {$authStore?.email}</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div class="card bg-base-200 shadow-md">
        <div class="card-body">
          <h2 class="card-title text-lg">Browse Paddles</h2>
          <p class="opacity-75">Coming soon: Browse available tennis paddles for rental</p>
          <div class="card-actions justify-start">
            <button class="btn btn-primary btn-sm" disabled>Browse</button>
          </div>
        </div>
      </div>

      <div class="card bg-base-200 shadow-md">
        <div class="card-body">
          <h2 class="card-title text-lg">My Bookings</h2>
          <p class="opacity-75">Coming soon: View your rental bookings and history</p>
          <div class="card-actions justify-start">
            <button class="btn btn-primary btn-sm" disabled>View Bookings</button>
          </div>
        </div>
      </div>

      <div class="card bg-base-200 shadow-md">
        <div class="card-body">
          <h2 class="card-title text-lg">Account Settings</h2>
          <p class="opacity-75">Coming soon: Manage your profile and preferences</p>
          <div class="card-actions justify-start">
            <button class="btn btn-primary btn-sm" disabled>Settings</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Placeholder Section -->
    <div class="card bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Getting Started</h2>
        <p>
          This is your dashboard! Here you'll be able to browse paddles, manage bookings, and view
          your rental history. More features coming soon!
        </p>
        <div class="card-actions justify-start">
          <button class="btn btn-outline btn-primary" on:click={handleLogout}> Logout </button>
        </div>
      </div>
    </div>
  </div>
  </div>
{/if}

<style>
  /* Mobile-first responsive adjustments */
  @media (max-width: 640px) {
    :global(.navbar) {
      padding: 0.5rem;
    }

    :global(.card-title) {
      font-size: 1.25rem;
    }
  }
</style>
