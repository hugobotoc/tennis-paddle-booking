<script lang="ts">
  import { onMount } from 'svelte';
  import { getAllCourts } from '$lib/data/courts';
  import { getAllMockBookings } from '$lib/data/bookings';

  let metrics = {
    totalCourts: 0,
    totalBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    occupancyRate: 0,
    avgBookingValue: 0
  };

  let courtPopularity = [];
  let recentBookings = [];

  onMount(() => {
    loadMetrics();
  });

  function loadMetrics() {
    const courts = getAllCourts();
    const bookings = getAllMockBookings();
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    metrics.totalCourts = courts.length;
    metrics.totalBookings = bookings.length;
    metrics.totalRevenue = bookings
      .filter(b => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, b) => sum + b.total_price, 0);

    const monthlyBookings = bookings.filter(b => {
      const bookingDate = new Date(b.booking_date);
      return bookingDate >= monthStart && (b.status === 'completed' || b.status === 'confirmed');
    });

    metrics.monthlyRevenue = monthlyBookings.reduce((sum, b) => sum + b.total_price, 0);

    const totalSlots = courts.reduce((sum, c) => sum + c.total_slots, 0);
    const bookedSlots = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length;
    metrics.occupancyRate = totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0;

    metrics.avgBookingValue = bookings.length > 0 ? metrics.totalRevenue / bookings.length : 0;

    // Court popularity
    const courtBookingCounts = {};
    bookings.forEach(b => {
      courtBookingCounts[b.court_id] = (courtBookingCounts[b.court_id] || 0) + 1;
    });

    courtPopularity = Object.entries(courtBookingCounts)
      .map(([courtId, count]) => ({
        courtId,
        count,
        revenue: bookings
          .filter(b => b.court_id === courtId && (b.status === 'confirmed' || b.status === 'completed'))
          .reduce((sum, b) => sum + b.total_price, 0)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Recent bookings
    recentBookings = bookings
      .sort((a, b) => {
        const dateA = new Date(`${a.booking_date}T${a.start_time}`).getTime();
        const dateB = new Date(`${b.booking_date}T${b.start_time}`).getTime();
        return dateB - dateA;
      })
      .slice(0, 8);
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes}`;
  }

  function formatCurrency(amount) {
    return amount.toFixed(2);
  }
</script>

<div class="min-h-screen bg-base-100">
  <div class="bg-base-200 px-4 py-6 border-b border-base-300">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold">Court Booking Dashboard</h1>
      <p class="text-base-content/70 mt-2">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    </div>
  </div>

  <div class="p-4 md:p-8 max-w-7xl mx-auto">
    <!-- Top Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="card bg-gradient-to-br from-primary to-primary-focus shadow-lg">
        <div class="card-body text-primary-content">
          <h2 class="card-title text-lg">Total Courts</h2>
          <p class="text-4xl font-bold">{metrics.totalCourts}</p>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-success to-success-focus shadow-lg">
        <div class="card-body text-success-content">
          <h2 class="card-title text-lg">Total Bookings</h2>
          <p class="text-4xl font-bold">{metrics.totalBookings}</p>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-accent to-accent-focus shadow-lg">
        <div class="card-body text-accent-content">
          <h2 class="card-title text-lg">Total Revenue</h2>
          <p class="text-3xl font-bold">${formatCurrency(metrics.totalRevenue)}</p>
        </div>
      </div>

      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h2 class="card-title text-lg">Monthly Revenue</h2>
          <p class="text-3xl font-bold text-info">${formatCurrency(metrics.monthlyRevenue)}</p>
        </div>
      </div>

      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h2 class="card-title text-lg">Occupancy Rate</h2>
          <p class="text-3xl font-bold text-warning">{metrics.occupancyRate}%</p>
        </div>
      </div>

      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h2 class="card-title text-lg">Avg Booking Value</h2>
          <p class="text-3xl font-bold text-info">${formatCurrency(metrics.avgBookingValue)}</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card bg-base-200 shadow-lg mb-8">
      <div class="card-body">
        <h2 class="card-title mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/admin/inventory" class="btn btn-primary">📍 Manage Courts</a>
          <a href="/admin/bookings" class="btn btn-primary">📅 Manage Bookings</a>
          <a href="/admin/reports" class="btn btn-primary">📊 Generate Reports</a>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Court Popularity -->
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h2 class="card-title mb-4">Top Courts by Bookings</h2>
          <div class="space-y-3">
            {#each courtPopularity as court, idx}
              <div class="bg-base-100 p-3 rounded flex justify-between items-center hover:shadow-md transition">
                <div>
                  <div class="font-semibold">#{idx + 1} {court.courtId}</div>
                  <div class="text-xs text-base-content/60">{court.count} bookings</div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-info">${formatCurrency(court.revenue)}</div>
                  <div class="progress progress-sm w-24 h-2">
                    <div
                      class="progress-bar bg-info"
                      style="width: {(court.count / (courtPopularity[0]?.count || 1)) * 100}%"
                    />
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Recent Bookings -->
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h2 class="card-title mb-4">Recent Bookings</h2>
          <div class="space-y-2 max-h-80 overflow-y-auto">
            {#each recentBookings as booking}
              <div class="bg-base-100 p-3 rounded flex justify-between items-center text-sm hover:shadow-md transition">
                <div class="flex-1">
                  <div class="font-semibold">{booking.court_id}</div>
                  <div class="text-xs text-base-content/60">
                    {formatDate(booking.booking_date)} {formatTime(booking.start_time)}
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-bold">${formatCurrency(booking.total_price)}</div>
                  <div class="badge badge-xs" class:badge-success={booking.status === 'confirmed'} class:badge-info={booking.status === 'completed'} class:badge-error={booking.status === 'cancelled'} class:badge-warning={booking.status === 'pending'}>
                    {booking.status}
                  </div>
                </div>
              </div>
            {/each}
          </div>
          <a href="/admin/bookings" class="btn btn-sm btn-ghost w-full mt-4">View All Bookings →</a>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  :global(body) {
    @apply bg-base-100;
  }
</style>
