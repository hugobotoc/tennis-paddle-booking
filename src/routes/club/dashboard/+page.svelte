<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { clubStore } from '$lib/stores/club-auth';
  import { getAllCourts } from '$lib/data/courts';
  import { getAllMockBookings } from '$lib/data/bookings';

  let club = $clubStore;
  let isLoading = true;
  let stats = {
    totalCourts: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeBookings: 0
  };

  onMount(() => {
    if (!club) {
      goto('/club-login');
      return;
    }

    // Calculate stats for this club
    const courts = getAllCourts().filter(c => c.club_id === club.id);
    const bookings = getAllMockBookings().filter(b => b.club_id === club.id);

    stats.totalCourts = courts.length;
    stats.totalBookings = bookings.length;
    stats.activeBookings = bookings.filter(b => b.status === 'confirmed').length;
    stats.totalRevenue = bookings
      .filter(b => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, b) => sum + b.total_price, 0);

    isLoading = false;
  });

  async function handleLogout() {
    clubStore.set(null);
    await goto('/club-login');
  }
</script>

{#if isLoading}
  <div class="min-h-screen flex items-center justify-center bg-base-100">
    <div class="loading loading-spinner loading-lg" />
  </div>
{:else if club}
  <div class="min-h-screen bg-base-100">
    <!-- Navigation -->
    <div class="navbar bg-base-200 shadow-lg">
      <div class="flex-1">
        <a href="/club/dashboard" class="btn btn-ghost text-2xl font-bold">
          🎾 {club.name}
        </a>
      </div>
      <div class="flex-none gap-2">
        <div class="dropdown dropdown-end">
          <button tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
              {club.name.charAt(0)}
            </div>
          </button>
          <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><div>{club.name}</div></li>
            <li><div class="text-sm opacity-75">{club.email}</div></li>
            <li><a href="/club/profile">Edit Profile</a></li>
            <li><button on:click={handleLogout}>Logout</button></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="p-4 md:p-8 max-w-7xl mx-auto">
      <!-- Welcome Section -->
      <div class="card bg-gradient-to-r from-primary to-primary-focus shadow-xl mb-8">
        <div class="card-body text-white">
          <h1 class="card-title text-4xl">Welcome Back, {club.name}!</h1>
          <p class="opacity-90">Manage your tennis courts, bookings, and revenue all in one place.</p>
          <p class="text-sm opacity-75">Currency: {club.currency_symbol} ({club.currency}) | Tier: {club.subscription_tier}</p>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h2 class="card-title text-lg">Total Courts</h2>
            <p class="text-4xl font-bold text-primary">{stats.totalCourts}</p>
            <a href="/club/courts" class="text-sm link link-primary mt-2">Manage courts →</a>
          </div>
        </div>

        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h2 class="card-title text-lg">Total Bookings</h2>
            <p class="text-4xl font-bold text-success">{stats.totalBookings}</p>
            <a href="/club/bookings" class="text-sm link link-primary mt-2">View all →</a>
          </div>
        </div>

        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h2 class="card-title text-lg">Active Now</h2>
            <p class="text-4xl font-bold text-info">{stats.activeBookings}</p>
            <p class="text-xs opacity-75">Confirmed bookings</p>
          </div>
        </div>

        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h2 class="card-title text-lg">Total Revenue</h2>
            <p class="text-3xl font-bold text-accent">{club.currency_symbol}{stats.totalRevenue.toFixed(2)}</p>
            <p class="text-xs opacity-75">From completed bookings</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card bg-base-200 shadow-lg mb-8">
        <div class="card-body">
          <h2 class="card-title mb-4">Quick Actions</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <a href="/club/courts" class="btn btn-primary">
              📍 Manage Courts
            </a>
            <a href="/club/pricing" class="btn btn-primary">
              💰 Set Pricing
            </a>
            <a href="/club/blocks" class="btn btn-primary">
              🚫 Block Courts
            </a>
            <a href="/club/bookings" class="btn btn-primary">
              📅 View Bookings
            </a>
          </div>
        </div>
      </div>

      <!-- Club Info Card -->
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h2 class="card-title mb-4">Club Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm opacity-75">Club Name</p>
              <p class="font-semibold text-lg">{club.name}</p>
            </div>
            <div>
              <p class="text-sm opacity-75">Email</p>
              <p class="font-semibold text-lg">{club.email}</p>
            </div>
            <div>
              <p class="text-sm opacity-75">Phone</p>
              <p class="font-semibold text-lg">{club.phone}</p>
            </div>
            <div>
              <p class="text-sm opacity-75">Location</p>
              <p class="font-semibold text-lg">{club.location}, {club.city}</p>
            </div>
            <div>
              <p class="text-sm opacity-75">Currency</p>
              <p class="font-semibold text-lg">{club.currency} ({club.currency_symbol})</p>
            </div>
            <div>
              <p class="text-sm opacity-75">Subscription</p>
              <p class="font-semibold text-lg capitalize badge badge-primary">{club.subscription_tier}</p>
            </div>
          </div>
          <div class="mt-6">
            <a href="/club/profile" class="btn btn-outline btn-primary w-full">
              Edit Club Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="min-h-screen flex items-center justify-center bg-base-100">
    <div class="card bg-base-200 shadow-xl">
      <div class="card-body text-center">
        <h1 class="card-title">Not Logged In</h1>
        <p>Please log in to access the club dashboard.</p>
        <a href="/club-login" class="btn btn-primary mt-4">Go to Login</a>
      </div>
    </div>
  </div>
{/if}
