<script lang="ts">
  import { onMount } from 'svelte';
  import { getTodayRevenue, getActiveBookingCount, getAvailablePaddleCount, getTotalUserCount, getRecentBookings } from '$lib/data/admin';

  /** @type {{ todayRevenue: number; activeBookingCount: number; availablePaddleCount: number; totalUserCount: number }} */
  let metrics = {
    todayRevenue: 0,
    activeBookingCount: 0,
    availablePaddleCount: 0,
    totalUserCount: 0
  };
  /** @type {{ id: string; paddle_name: string; user_name: string; start_date: string; status: string; total_price: number }[]} */
  let recentBookings = [];

  onMount(() => {
    metrics = {
      todayRevenue: getTodayRevenue(),
      activeBookingCount: getActiveBookingCount(),
      availablePaddleCount: getAvailablePaddleCount(),
      totalUserCount: getTotalUserCount()
    };
    recentBookings = getRecentBookings(5);
  });

  /**
   * @param {string} dateStr
   * @returns {string}
   */
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
</script>

<div class="min-h-screen bg-base-100">
  <div class="bg-base-200 px-4 py-6 border-b border-base-300">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-4xl font-bold">Admin Dashboard</h1>
      <p class="text-base-content/70 mt-2">{new Date().toLocaleDateString()}</p>
    </div>
  </div>

  <div class="p-4 md:p-8 max-w-6xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h2 class="card-title text-lg">Today Revenue</h2>
          <p class="text-4xl font-bold text-primary">${metrics.todayRevenue.toFixed(2)}</p>
        </div>
      </div>
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h2 class="card-title text-lg">Active Bookings</h2>
          <p class="text-4xl font-bold text-info">{metrics.activeBookingCount}</p>
        </div>
      </div>
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h2 class="card-title text-lg">Available Paddles</h2>
          <p class="text-4xl font-bold text-success">{metrics.availablePaddleCount}</p>
        </div>
      </div>
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h2 class="card-title text-lg">Total Users</h2>
          <p class="text-4xl font-bold text-warning">{metrics.totalUserCount}</p>
        </div>
      </div>
    </div>

    <div class="card bg-base-200 shadow-lg mb-8">
      <div class="card-body">
        <h2 class="card-title mb-4">Quick Actions</h2>
        <div class="grid grid-cols-3 gap-4">
          <a href="/admin/inventory" class="btn btn-primary w-full">Manage Inventory</a>
          <a href="/admin/bookings" class="btn btn-primary w-full">Manage Bookings</a>
          <a href="/admin/analytics" class="btn btn-primary w-full">View Analytics</a>
        </div>
      </div>
    </div>

    <div class="card bg-base-200 shadow-lg">
      <div class="card-body">
        <h2 class="card-title mb-4">Recent Bookings</h2>
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead><tr><th>Paddle</th><th>User</th><th>Start Date</th><th>Status</th><th>Cost</th></tr></thead>
            <tbody>
              {#each recentBookings as booking}
                <tr>
                  <td>{booking.paddle_name}</td>
                  <td>{booking.user_name}</td>
                  <td>{formatDate(booking.start_date)}</td>
                  <td><span class="badge">{booking.status}</span></td>
                  <td>${booking.total_price.toFixed(2)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
