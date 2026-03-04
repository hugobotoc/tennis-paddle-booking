<script lang="ts">
  import { onMount } from 'svelte';
  import { getAllMockBookings } from '$lib/data/bookings';
  import { getAllCourts } from '$lib/data/courts';

  let bookings = [];
  let filteredBookings = [];
  let statusFilter = 'all';
  let dateStart = '';
  let dateEnd = '';
  let successMessage = '';
  let errorMessage = '';
  let selectedBooking = null;
  let showModal = false;

  const statuses = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

  onMount(() => {
    loadBookings();
  });

  function loadBookings() {
    bookings = getAllMockBookings();
    applyFilter();
  }

  function applyFilter() {
    let filtered = bookings;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }

    if (dateStart) {
      filtered = filtered.filter(b => b.booking_date >= dateStart);
    }

    if (dateEnd) {
      filtered = filtered.filter(b => b.booking_date <= dateEnd);
    }

    filteredBookings = filtered.sort((a, b) => {
      const dateA = new Date(`${a.booking_date}T${a.start_time}`).getTime();
      const dateB = new Date(`${b.booking_date}T${b.start_time}`).getTime();
      return dateB - dateA;
    });
  }

  function calculateRefund(booking) {
    const bookingDate = new Date(booking.booking_date);
    const now = new Date();
    const hoursUntil = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntil >= 24) {
      return Math.round(booking.total_price * 0.9);
    } else if (hoursUntil > 0) {
      return 0;
    }
    return 0;
  }

  function handleStatusChange(bookingId, newStatus) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const courts = getAllCourts();
    const court = courts.find(c => c.id === booking.court_id);

    if (newStatus === 'confirmed' && !court?.available_now) {
      errorMessage = 'Cannot confirm - court unavailable';
      setTimeout(() => (errorMessage = ''), 3000);
      return;
    }

    booking.status = newStatus;
    successMessage = `Booking updated to ${newStatus}`;
    loadBookings();
    if (selectedBooking?.id === bookingId) {
      selectedBooking = { ...booking };
    }
    setTimeout(() => (successMessage = ''), 3000);
  }

  function handleCancel(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    if (booking.status === 'completed') {
      errorMessage = 'Cannot cancel completed booking';
      setTimeout(() => (errorMessage = ''), 3000);
      return;
    }

    const refund = calculateRefund(booking);
    booking.status = 'cancelled';
    successMessage = `Booking cancelled. Refund: $${refund}`;
    loadBookings();
    if (selectedBooking?.id === bookingId) {
      closeModal();
    }
    setTimeout(() => (successMessage = ''), 3000);
  }

  function openModal(booking) {
    selectedBooking = booking;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    selectedBooking = null;
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }


</script>

<div class="min-h-screen bg-base-100">
  <div class="bg-base-200 px-4 py-6 border-b border-base-300">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold">Booking Management</h1>
      <p class="text-base-content/70 mt-2">View and manage all bookings</p>
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2" />
        </svg>
        <span>{errorMessage}</span>
      </div>
    {/if}

    <div class="mb-6 space-y-3">
      <div class="flex flex-col md:flex-row gap-3">
        <select class="select select-bordered flex-1" bind:value={statusFilter} on:change={() => applyFilter()}>
          {#each statuses as status}
            <option value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
          {/each}
        </select>
        <input
          type="date"
          class="input input-bordered"
          bind:value={dateStart}
          on:change={() => applyFilter()}
          placeholder="Start date"
        />
        <input
          type="date"
          class="input input-bordered"
          bind:value={dateEnd}
          on:change={() => applyFilter()}
          placeholder="End date"
        />
      </div>
    </div>

    <div class="overflow-x-auto hidden md:block">
      <table class="table table-zebra w-full">
        <thead class="bg-base-200">
          <tr>
            <th>ID</th>
            <th>Court</th>
            <th>User</th>
            <th>Date</th>
            <th>Time</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredBookings as booking (booking.id)}
            <tr class="hover">
              <td class="font-mono text-xs">{booking.id.slice(0, 8)}</td>
              <td class="font-semibold">{booking.court_id}</td>
              <td>{booking.user_name}</td>
              <td class="text-sm">{formatDate(booking.booking_date)}</td>
              <td class="text-sm">
                {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
              </td>
              <td class="font-bold">${booking.total_price}</td>
              <td>
                <span
                  class="badge badge-sm"
                  class:badge-pending={booking.status === 'pending'}
                  class:badge-success={booking.status === 'confirmed'}
                  class:badge-info={booking.status === 'completed'}
                  class:badge-error={booking.status === 'cancelled'}
                >
                  {booking.status}
                </span>
              </td>
              <td class="flex gap-1">
                <button
                  class="btn btn-xs btn-ghost"
                  on:click={() => openModal(booking)}
                  aria-label="View details"
                >
                  View
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="grid grid-cols-1 md:hidden gap-4">
      {#each filteredBookings as booking (booking.id)}
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h3 class="card-title text-sm">{booking.court_id}</h3>
            <p class="text-xs text-base-content/70">User: {booking.user_name}</p>
            <div class="divider my-2" />
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-base-content/70">Date:</span>
                <span class="font-mono">{formatDate(booking.booking_date)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-base-content/70">Time:</span>
                <span class="font-mono">{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-base-content/70">Price:</span>
                <span class="font-bold">${booking.total_price}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-base-content/70">Status:</span>
                <span class="badge badge-xs" class:badge-pending={booking.status === 'pending'} class:badge-success={booking.status === 'confirmed'} class:badge-info={booking.status === 'completed'} class:badge-error={booking.status === 'cancelled'}>
                  {booking.status}
                </span>
              </div>
            </div>
            <button class="btn btn-sm btn-primary mt-4" on:click={() => openModal(booking)}>
              View Details
            </button>
          </div>
        </div>
      {/each}
    </div>

    {#if filteredBookings.length === 0}
      <div class="text-center py-12">
        <p class="text-base-content/60">No bookings found</p>
      </div>
    {/if}
  </div>

  {#if showModal && selectedBooking}
    <div
      class="fixed inset-0 bg-black/50 z-40"
      on:click={closeModal}
      on:keydown={(e) => e.key === 'Escape' && closeModal()}
      role="button"
      tabindex="-1"
    />
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-base-100 rounded-lg shadow-2xl z-50 w-96 max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-4">Booking Details</h2>

        <div class="space-y-3 mb-6">
          <div class="divider my-2" />
          <div class="flex justify-between text-sm">
            <span class="text-base-content/70">Booking ID:</span>
            <span class="font-mono">{selectedBooking.id.slice(0, 12)}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-base-content/70">Court:</span>
            <span class="font-semibold">{selectedBooking.court_id}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-base-content/70">User:</span>
            <span class="font-semibold">{selectedBooking.user_name}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-base-content/70">Date:</span>
            <span class="font-mono">{formatDate(selectedBooking.booking_date)}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-base-content/70">Time:</span>
            <span class="font-mono">{formatTime(selectedBooking.start_time)} - {formatTime(selectedBooking.end_time)}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-base-content/70">Hourly Rate:</span>
            <span class="font-bold">${selectedBooking.hourly_rate}</span>
          </div>
          <div class="flex justify-between text-sm font-bold text-lg">
            <span>Total Price:</span>
            <span class="text-primary">${selectedBooking.total_price}</span>
          </div>
          <div class="divider my-2" />

          {#if selectedBooking.status !== 'completed' && selectedBooking.status !== 'cancelled'}
            <div class="bg-base-200 p-3 rounded">
              <p class="text-xs text-base-content/70 mb-2">Refund if cancelled:</p>
              <p class="text-lg font-bold">${calculateRefund(selectedBooking)}</p>
              <p class="text-xs text-base-content/60 mt-1">90% if &gt;24hrs before, 0% if &lt;24hrs</p>
            </div>
          {/if}
        </div>

        <div class="space-y-3">
          <div class="form-control">
            <label class="label" for="status-select">
              <span class="label-text font-semibold">Status</span>
            </label>
            <select
              id="status-select"
              class="select select-bordered"
              value={selectedBooking.status}
              on:change={(e) => handleStatusChange(selectedBooking.id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div class="flex gap-3">
            <button class="btn btn-ghost flex-1" on:click={closeModal}> Close </button>
            {#if selectedBooking.status !== 'completed' && selectedBooking.status !== 'cancelled'}
              <button
                class="btn btn-error flex-1"
                on:click={() => {
                  handleCancel(selectedBooking.id);
                }}
              >
                Cancel Booking
              </button>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
