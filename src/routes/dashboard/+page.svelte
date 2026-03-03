<script>
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { onMount } from 'svelte';
  import { MOCK_COURTS } from '$lib/data/courts';
  import { canReviewBooking, hasReviewForBooking } from '$lib/data/reviews';
  import ReviewModal from '$lib/components/ReviewModal.svelte';
  import {
    getActiveBookings,
    getPastBookings,
    getCancelledBookings,
    cancelBooking,
    calculateBookingDays,
    CURRENT_USER
  } from '$lib/data/user';

  let isLoading = true;
  let activeTab = 'active';
  let activeBookings = [];
  let pastBookings = [];
  let cancelledBookings = [];
  let showCancelDialog = false;
  let bookingToCancel = null;
  let cancelError = '';
  let showReviewModal = false;
  let reviewBooking = null;

  onMount(() => {
    // Client-side auth check
    if (!$authStore) {
      goto('/login');
    }

    // Load bookings for current user
    activeBookings = getActiveBookings(CURRENT_USER.id);
    pastBookings = getPastBookings(CURRENT_USER.id);
    cancelledBookings = getCancelledBookings(CURRENT_USER.id);

    isLoading = false;
  });

  async function handleLogout() {
    await authStore.logout();
    await goto('/login');
  }

  function getCourtInfo(courtId) {
    return MOCK_COURTS.find(p => p.id === courtId);
  }

  function handleCancelClick(booking) {
    bookingToCancel = booking;
    cancelError = '';
    showCancelDialog = true;
  }

  function confirmCancel() {
    if (!bookingToCancel) return;

    const result = cancelBooking(bookingToCancel.id, CURRENT_USER.id);

    if (result.success) {
      // Move booking to cancelled tab
      activeBookings = getActiveBookings(CURRENT_USER.id);
      pastBookings = getPastBookings(CURRENT_USER.id);
      cancelledBookings = getCancelledBookings(CURRENT_USER.id);
      showCancelDialog = false;
      bookingToCancel = null;
      cancelError = '';
    } else {
      cancelError = result.message;
    }
  }

  function closeCancelDialog() {
    showCancelDialog = false;
    bookingToCancel = null;
    cancelError = '';
  }

  function getFormattedAddress(address) {
    if (!address) return 'N/A';
    return `${address.street_address}, ${address.city}, ${address.state} ${address.zip}`;
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function openReviewModal(booking) {
    if (canReviewBooking(booking, CURRENT_USER.id)) {
      reviewBooking = booking;
      showReviewModal = true;
    }
  }

  function handleReviewSubmit(_event) {
    // Review has been added, just close the modal and refresh the list
    showReviewModal = false;
    reviewBooking = null;
    // Reload past bookings to reflect the new state
    pastBookings = getPastBookings(CURRENT_USER.id);
  }

  function closeReviewModal() {
    showReviewModal = false;
    reviewBooking = null;
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
        <a href="/dashboard" class="btn btn-ghost normal-case text-xl">
          🎾 Tennis Court Booking
        </a>
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
              <a href="/courts">Browse Courts</a>
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
          <h1 class="card-title text-3xl md:text-4xl">My Bookings</h1>
          <p class="opacity-90">Welcome back, {$authStore?.name || 'User'}! 👋</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs tabs-bordered mb-6" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'active'}
          aria-label="Active Bookings tab"
          class="tab {activeTab === 'active' ? 'tab-active' : ''}"
          on:click={() => (activeTab = 'active')}
        >
          Active Bookings ({activeBookings.length})
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'past'}
          aria-label="Past Bookings tab"
          class="tab {activeTab === 'past' ? 'tab-active' : ''}"
          on:click={() => (activeTab = 'past')}
        >
          Past Bookings ({pastBookings.length})
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'cancelled'}
          aria-label="Cancelled Bookings tab"
          class="tab {activeTab === 'cancelled' ? 'tab-active' : ''}"
          on:click={() => (activeTab = 'cancelled')}
        >
          Cancelled Bookings ({cancelledBookings.length})
        </button>
      </div>

      <!-- Tab Content: Active Bookings -->
      {#if activeTab === 'active'}
        <div class="space-y-4">
          {#if activeBookings.length === 0}
            <div class="card bg-base-200 shadow-lg">
              <div class="card-body text-center py-12">
                <h2 class="card-title justify-center">No Active Bookings</h2>
                <p class="opacity-75">You don't have any active bookings right now.</p>
                <div class="card-actions justify-center">
                  <a href="/courts" class="btn btn-primary">Start Exploring Courts</a>
                </div>
              </div>
            </div>
          {:else}
            {#each activeBookings as booking (booking.id)}
              {@const court = getCourtInfo(booking.court_id)}
              {@const daysCount = calculateBookingDays(booking.start_date, booking.end_date)}
              <div class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
                <div class="card-body">
                  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <!-- Court Image & Name -->
                    <div class="flex flex-col items-start gap-3">
                      {#if court}
                        <img
                          src={court.image_url}
                          alt={court.name}
                          class="w-full h-40 object-cover rounded-lg"
                        />
                        <div>
                          <h3 class="card-title text-lg">{court.name}</h3>
                          <p class="text-sm opacity-75">
                            {court.brand} {court.model}
                          </p>
                        </div>
                      {:else}
                        <div class="w-full h-40 bg-base-300 rounded-lg flex items-center justify-center">
                          <span class="opacity-50">No image</span>
                        </div>
                      {/if}
                    </div>

                    <!-- Booking Details -->
                    <div class="md:col-span-2 flex flex-col gap-3">
                      <!-- Dates -->
                      <div>
                        <p class="text-sm opacity-75 mb-1">Booking Dates</p>
                        <p class="font-semibold">
                          {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                        </p>
                      </div>

                      <!-- Status Badge -->
                      <div>
                        <p class="text-sm opacity-75 mb-1">Status</p>
                        <div class="badge badge-lg badge-primary capitalize">
                          {booking.status}
                        </div>
                      </div>

                      <!-- Price Breakdown -->
                      <div>
                        <p class="text-sm opacity-75 mb-1">Price Breakdown</p>
                        <p class="text-sm">
                          ${booking.daily_rate} × {daysCount} day{daysCount > 1 ? 's' : ''} = ${(booking.daily_rate * daysCount).toFixed(2)}
                        </p>
                      </div>

                      <!-- Delivery Address -->
                      <div>
                        <p class="text-sm opacity-75 mb-1">Delivery Address</p>
                        <p class="text-sm truncate">{getFormattedAddress(booking.delivery_address)}</p>
                      </div>
                    </div>

                    <!-- Total Price & Actions -->
                    <div class="flex flex-col justify-between items-end gap-2">
                      <div class="text-right">
                        <p class="text-sm opacity-75">Total Cost</p>
                        <p class="text-2xl font-bold text-primary">${booking.total_price.toFixed(2)}</p>
                      </div>

                      <div class="flex flex-col w-full gap-2">
                        <a
                          href={`/courts/${booking.court_id}`}
                          class="btn btn-sm btn-outline btn-primary w-full"
                          aria-label="View court details for {court?.name || 'this court'}"
                        >
                          View Court
                        </a>
                        <button
                          class="btn btn-sm btn-outline btn-error w-full"
                          on:click={() => handleCancelClick(booking)}
                          aria-label="Cancel booking for {court?.name || 'this court'}"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          {/if}
        </div>
      {/if}

      <!-- Tab Content: Past Bookings -->
      {#if activeTab === 'past'}
        <div class="space-y-4">
          {#if pastBookings.length === 0}
            <div class="card bg-base-200 shadow-lg">
              <div class="card-body text-center py-12">
                <h2 class="card-title justify-center">No Past Bookings</h2>
                <p class="opacity-75">You don't have any completed bookings yet.</p>
              </div>
            </div>
          {:else}
            {#each pastBookings as booking (booking.id)}
              {@const court = getCourtInfo(booking.court_id)}
              {@const daysCount = calculateBookingDays(booking.start_date, booking.end_date)}
              <div class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
                <div class="card-body">
                  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <!-- Court Image & Name -->
                    <div class="flex flex-col items-start gap-3">
                      {#if court}
                        <img
                          src={court.image_url}
                          alt={court.name}
                          class="w-full h-40 object-cover rounded-lg"
                        />
                        <div>
                          <h3 class="card-title text-lg">{court.name}</h3>
                          <p class="text-sm opacity-75">
                            {court.brand} {court.model}
                          </p>
                        </div>
                      {:else}
                        <div class="w-full h-40 bg-base-300 rounded-lg flex items-center justify-center">
                          <span class="opacity-50">No image</span>
                        </div>
                      {/if}
                    </div>

                    <!-- Booking Details -->
                    <div class="md:col-span-2 flex flex-col gap-3">
                      <!-- Dates -->
                      <div>
                        <p class="text-sm opacity-75 mb-1">Booking Dates</p>
                        <p class="font-semibold">
                          {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                        </p>
                      </div>

                      <!-- Status Badge -->
                      <div>
                        <p class="text-sm opacity-75 mb-1">Status</p>
                        <div class="badge badge-lg badge-success capitalize">
                          {booking.status}
                        </div>
                      </div>

                      <!-- Price Breakdown -->
                      <div>
                        <p class="text-sm opacity-75 mb-1">Price Breakdown</p>
                        <p class="text-sm">
                          ${booking.daily_rate} × {daysCount} day{daysCount > 1 ? 's' : ''} = ${(booking.daily_rate * daysCount).toFixed(2)}
                        </p>
                      </div>

                      <!-- Delivery Address -->
                      <div>
                        <p class="text-sm opacity-75 mb-1">Delivery Address</p>
                        <p class="text-sm truncate">{getFormattedAddress(booking.delivery_address)}</p>
                      </div>
                    </div>

                    <!-- Total Price & Actions -->
                    <div class="flex flex-col justify-between items-end gap-2">
                      <div class="text-right">
                        <p class="text-sm opacity-75">Total Cost</p>
                        <p class="text-2xl font-bold text-success">${booking.total_price.toFixed(2)}</p>
                      </div>

                      <div class="flex flex-col w-full gap-2">
                        <a
                          href={`/courts/${booking.court_id}`}
                          class="btn btn-sm btn-outline btn-primary w-full"
                          aria-label="View court details for {court?.name || 'this court'}"
                        >
                          View Court
                        </a>
                        {#if canReviewBooking(booking, CURRENT_USER.id)}
                          <button
                            class="btn btn-sm btn-outline btn-warning w-full"
                            on:click={() => openReviewModal(booking)}
                            aria-label="Leave review for {court?.name || 'this court'}"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-4 h-4"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                              />
                            </svg>
                            Leave Review
                          </button>
                        {:else if hasReviewForBooking(booking.id)}
                          <button
                            class="btn btn-sm btn-disabled w-full"
                            disabled
                            aria-label="Already reviewed"
                          >
                            ✓ Reviewed
                          </button>
                        {/if}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          {/if}
        </div>
      {/if}

      <!-- Tab Content: Cancelled Bookings -->
      {#if activeTab === 'cancelled'}
        <div class="space-y-4">
          {#if cancelledBookings.length === 0}
            <div class="card bg-base-200 shadow-lg">
              <div class="card-body text-center py-12">
                <h2 class="card-title justify-center">No Cancelled Bookings</h2>
                <p class="opacity-75">You don't have any cancelled bookings.</p>
              </div>
            </div>
          {:else}
            {#each cancelledBookings as booking (booking.id)}
              {@const court = getCourtInfo(booking.court_id)}
              {@const daysCount = calculateBookingDays(booking.start_date, booking.end_date)}
              <div class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow opacity-75">
                <div class="card-body">
                  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <!-- Court Image & Name -->
                    <div class="flex flex-col items-start gap-3">
                      {#if court}
                        <img
                          src={court.image_url}
                          alt={court.name}
                          class="w-full h-40 object-cover rounded-lg"
                        />
                        <div>
                          <h3 class="card-title text-lg">{court.name}</h3>
                          <p class="text-sm opacity-75">
                            {court.brand} {court.model}
                          </p>
                        </div>
                      {:else}
                        <div class="w-full h-40 bg-base-300 rounded-lg flex items-center justify-center">
                          <span class="opacity-50">No image</span>
                        </div>
                      {/if}
                    </div>

                    <!-- Booking Details -->
                    <div class="md:col-span-2 flex flex-col gap-3">
                      <!-- Dates -->
                      <div>
                        <p class="text-sm opacity-75 mb-1">Booking Dates</p>
                        <p class="font-semibold">
                          {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                        </p>
                      </div>

                      <!-- Status Badge -->
                      <div>
                        <p class="text-sm opacity-75 mb-1">Status</p>
                        <div class="badge badge-lg badge-error capitalize">
                          {booking.status}
                        </div>
                      </div>

                      <!-- Price Breakdown -->
                      <div>
                        <p class="text-sm opacity-75 mb-1">Price Breakdown</p>
                        <p class="text-sm">
                          ${booking.daily_rate} × {daysCount} day{daysCount > 1 ? 's' : ''} = ${(booking.daily_rate * daysCount).toFixed(2)}
                        </p>
                      </div>

                      <!-- Delivery Address -->
                      <div>
                        <p class="text-sm opacity-75 mb-1">Delivery Address</p>
                        <p class="text-sm truncate">{getFormattedAddress(booking.delivery_address)}</p>
                      </div>
                    </div>

                    <!-- Total Price & Actions -->
                    <div class="flex flex-col justify-between items-end gap-2">
                      <div class="text-right">
                        <p class="text-sm opacity-75">Total Cost</p>
                        <p class="text-2xl font-bold">${booking.total_price.toFixed(2)}</p>
                      </div>

                      <div class="flex flex-col w-full gap-2">
                        <a
                          href={`/courts/${booking.court_id}`}
                          class="btn btn-sm btn-outline btn-primary w-full"
                          aria-label="View court details for {court?.name || 'this court'}"
                        >
                          View Court
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          {/if}
        </div>
      {/if}
    </div>

    <!-- Cancel Booking Confirmation Dialog -->
    {#if showCancelDialog && bookingToCancel}
      <button
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        on:click={closeCancelDialog}
        on:keydown={(e) => e.key === 'Escape' && closeCancelDialog()}
        aria-label="Close dialog by clicking background"
      />
      <div
        class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-base-100 rounded-lg shadow-2xl z-50 w-96"
        role="alertdialog"
        aria-label="Cancel booking confirmation dialog"
        aria-describedby="cancel-dialog-description"
      >
        <div class="p-6">
          <h3 class="font-bold text-lg mb-4">Cancel Booking?</h3>
          <p id="cancel-dialog-description" class="mb-4 opacity-75">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </p>

          {#if cancelError}
            <div class="alert alert-error mb-4" role="status" aria-live="polite">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m6-6l2 2m0 0l2 2m-2-2l-2-2m2 2l2-2"
                />
              </svg>
              <span>{cancelError}</span>
            </div>
          {/if}

          <div class="flex gap-3 justify-end">
            <button
              class="btn btn-ghost"
              on:click={closeCancelDialog}
              aria-label="Close dialog"
            >
              Keep Booking
            </button>
            <button
              class="btn btn-error"
              on:click={confirmCancel}
              aria-label="Confirm cancellation"
            >
              Yes, Cancel Booking
            </button>
          </div>
        </div>
      </div>
    {/if}

    <!-- Review Modal -->
    {#if reviewBooking}
      <ReviewModal
        isOpen={showReviewModal}
        bookingId={reviewBooking.id}
        courtId={reviewBooking.court_id}
        reviewerId={CURRENT_USER.id}
        reviewerName={CURRENT_USER.name}
        courtName={getCourtInfo(reviewBooking.court_id)?.name || 'Court'}
        on:submit={handleReviewSubmit}
        on:close={closeReviewModal}
      />
    {/if}
  </div>
{/if}

<style>
  /* Mobile-first responsive adjustments */
  @media (max-width: 640px) {
    :global(.navbar) {
      padding: 0.5rem;
    }

    :global(.card-title) {
      font-size: 1.125rem;
    }
  }
</style>
