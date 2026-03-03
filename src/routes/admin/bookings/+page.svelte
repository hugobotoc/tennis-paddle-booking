<script lang="ts">
  import { onMount } from 'svelte';
  import { getAllBookingsWithPaddles, updateBookingStatus } from '$lib/data/bookings-admin';

  let bookings = [];
  let filteredBookings = [];
  let statusFilter = 'all';
  let successMessage = '';
  let errorMessage = '';

  const statuses = ['all', 'pending', 'active', 'completed', 'cancelled'];

  onMount(() => {
    loadBookings();
  });

  function loadBookings() {
    bookings = getAllBookingsWithPaddles();
    applyFilter();
  }

  function applyFilter() {
    if (statusFilter === 'all') {
      filteredBookings = bookings;
    } else {
      filteredBookings = bookings.filter(b => b.status === statusFilter);
    }
  }

  function handleStatusChange(bookingId, newStatus) {
    try {
      updateBookingStatus(bookingId, newStatus);
      successMessage = `Booking status updated to ${newStatus}`;
      loadBookings();
      setTimeout(() => {
        successMessage = '';
      }, 3000);
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Failed to update booking';
      setTimeout(() => {
        errorMessage = '';
      }, 3000);
    }
  }

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
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold">Manage Bookings</h1>
      <p class="text-base-content/70 mt-2">View and update booking status</p>
    </div>
  </div>

  <div class="p-4 md:p-8 max-w-7xl mx-auto">
    {#if successMessage}
      <div class="alert alert-success mb-6" role="status" aria-live="polite">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{successMessage}</span>
      </div>
    {/if}

    {#if errorMessage}
      <div class="alert alert-error mb-6" role="alert" aria-live="polite">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m2-2l2 2m-2-2l-2-2" />
        </svg>
        <span>{errorMessage}</span>
      </div>
    {/if}

    <div class="mb-6">
      <h2 class="text-xl font-bold mb-3">Filter by Status</h2>
      <div class="flex gap-2 flex-wrap">
        {#each statuses as status}
          <button
            class="btn btn-sm {statusFilter === status ? 'btn-primary' : 'btn-ghost'}"
            on:click={() => {
              statusFilter = status;
              applyFilter();
            }}
            aria-pressed={statusFilter === status}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        {/each}
      </div>
    </div>

    <div class="overflow-x-auto bg-base-200 rounded-lg shadow">
      <table class="table w-full">
        <thead>
          <tr class="bg-base-300">
            <th>ID</th>
            <th>Paddle</th>
            <th>User</th>
            <th>Dates</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredBookings as booking (booking.id)}
            <tr class="hover:bg-base-300">
              <td class="font-mono text-sm">{booking.id.substring(0, 8)}...</td>
              <td class="font-semibold">{booking.paddle_name}</td>
              <td>{booking.user_name}</td>
              <td class="text-sm">
                <div>{formatDate(booking.start_date)}</div>
                <div class="text-base-content/60">to {formatDate(booking.end_date)}</div>
              </td>
              <td class="font-bold text-lg">${formatCurrency(booking.total_price)}</td>
              <td>
                <span
                  class={`badge ${
                    booking.status === 'active'
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
              <td>
                <select
                  class="select select-sm select-bordered"
                  value={booking.status}
                  on:change={(e) => handleStatusChange(booking.id, e.currentTarget.value)}
                  aria-label="Update status for booking {booking.id}"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if filteredBookings.length === 0}
      <div class="alert alert-info mt-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 w-6 h-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>No bookings found with the selected filter.</span>
      </div>
    {/if}
  </div>
</div>
