<script lang="ts">
  import { onMount } from 'svelte';
  import { getAdminMetrics, getRecentBookings } from '$lib/data/admin-courts';

  let metrics = {
    totalCourts: 0,
    availableCourts: 0,
    slotsBookedToday: 0,
    totalRevenue: 0,
    utilizationRate: 0
  };
  let recentBookings = [];

  onMount(() => {
    metrics = getAdminMetrics();
    recentBookings = getRecentBookings(5);
    console.log('[Court Admin Dashboard]', metrics, recentBookings);
  });

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function formatCurrency(amount) {
    return amount.toFixed(2);
  }
</script>

<div class="min-h-screen bg-base-100">
  <div class="bg-base-200 px-4 py-6 border-b border-base-300">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-4xl font-bold">Court Booking Admin</h1>
      <p class="text-base-content/70 mt-2">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
  </div>

  <div class="p-4 md:p-8 max-w-6xl mx-auto">
    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h2 class="card-title text-lg">Total Courts</h2>
          <p class="text-4xl font-bold text-primary">{metrics.totalCourts}</p>
        </div>
      </div>

      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h2 class="card-title text-lg">Available Now</h2>
          <p class="text-4xl font-bold text-success">{metrics.availableCourts}</p>
        </div>
      </div>

      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h2 class="card-title text-lg">Slots Booked</h2>
          <p class="text-4xl font-bold text-info">{metrics.slotsBookedToday}</p>
          <p class="text-xs text-base-content/60">Today</p>
        </div>
      </div>

      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h2 class="card-title text-lg">Utilization</h2>
          <p class="text-4xl font-bold text-warning">{metrics.utilizationRate}%</p>
        </div>
      </div>

      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h2 class="card-title text-lg">Total Revenue</h2>
          <p class="text-3xl font-bold text-accent">${formatCurrency(metrics.totalRevenue)}</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card bg-base-200 shadow-lg mb-8">
      <div class="card-body">
        <h2 class="card-title mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/admin/courts" class="btn btn-primary w-full">
            🏌️ Manage Courts
          </a>
          <a href="/admin/bookings" class="btn btn-primary w-full">
            📅 Manage Bookings
          </a>
          <a href="/admin/analytics" class="btn btn-primary w-full">
            📊 View Analytics
          </a>
        </div>
      </div>
    </div>

    <!-- Recent Bookings -->
    <div class="card bg-base-200 shadow-lg">
      <div class="card-body">
        <h2 class="card-title mb-4">Recent Bookings</h2>
        <div class="overflow-x-auto">
          <table class="table table-zebra w-full">
            <thead>
              <tr>
                <th>Court</th>
                <th>User</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {#each recentBookings as booking (booking.id)}
                <tr>
                  <td class="font-semibold">{booking.court_name}</td>
                  <td>{booking.user_name}</td>
                  <td class="text-sm">
                    <div>{formatDate(booking.booking_date)}</div>
                    <div class="text-base-content/60">{booking.start_time} - {booking.end_time}</div>
                  </td>
                  <td>
                    <span
                      class={`badge ${
                        booking.status === 'confirmed'
                          ? 'badge-primary'
                          : booking.status === 'completed'
                            ? 'badge-success'
                            : booking.status === 'cancelled'
                              ? 'badge-error'
                              : 'badge-warning'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td class="font-bold">${formatCurrency(booking.total_price)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>