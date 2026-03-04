<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { clubStore } from '$lib/stores/club-auth';
  import { getCourtBlocksByClub, toggleCourtBlockActive, createCourtBlock } from '$lib/data/court-blocking';
  import { getCourtsByClub } from '$lib/data/courts';

  let club = $clubStore;
  let blocks = [];
  let courts = [];
  let isLoading = true;
  let showNewBlockForm = false;
  let successMessage = '';
  let errorMessage = '';

  let newBlock = {
    name: '',
    description: '',
    block_type: 'maintenance',
    start_date: '',
    end_date: '',
    start_time: '08:00',
    end_time: '10:00',
    recurrence: 'none',
    reason: '',
    court_id: null
  };

  const blockTypes = [
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'event', label: 'Event' },
    { value: 'special_occasion', label: 'Special Occasion' },
    { value: 'holiday', label: 'Holiday' }
  ];

  const recurrenceOptions = [
    { value: 'none', label: 'One-time' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  onMount(() => {
    if (!club) {
      goto('/club-login');
      return;
    }

    loadBlocks();
  });

  function loadBlocks() {
    blocks = getCourtBlocksByClub(club.id);
    courts = getCourtsByClub(club.id);
    isLoading = false;
  }

  function toggleBlock(blockId) {
    toggleCourtBlockActive(blockId);
    loadBlocks();
    // Note: The UI will update with the new state after reload
  }

  function handleAddBlock() {
    errorMessage = '';

    if (!newBlock.name.trim()) {
      errorMessage = 'Block name required';
      return;
    }

    if (!newBlock.start_date) {
      errorMessage = 'Start date required';
      return;
    }

    if (!newBlock.end_date) {
      errorMessage = 'End date required';
      return;
    }

    if (newBlock.start_date > newBlock.end_date) {
      errorMessage = 'Start date cannot be after end date';
      return;
    }

    if (!newBlock.start_time || !newBlock.end_time) {
      errorMessage = 'Start and end times required';
      return;
    }

    if (newBlock.start_time >= newBlock.end_time) {
      errorMessage = 'Start time cannot be after or equal to end time';
      return;
    }

    if (!newBlock.reason.trim()) {
      errorMessage = 'Reason required';
      return;
    }

    createCourtBlock({
      ...newBlock,
      club_id: club.id,
      created_by: club.email
    });

    successMessage = `Block "${newBlock.name}" created successfully`;
    resetForm();
    loadBlocks();
    setTimeout(() => (successMessage = ''), 3000);
  }

  function resetForm() {
    newBlock = {
      name: '',
      description: '',
      block_type: 'maintenance',
      start_date: '',
      end_date: '',
      start_time: '08:00',
      end_time: '10:00',
      recurrence: 'none',
      reason: '',
      court_id: null
    };
    showNewBlockForm = false;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHours = h % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
  }

  function getBlockTypeLabel(type) {
    const found = blockTypes.find(bt => bt.value === type);
    return found ? found.label : type;
  }

  function getRecurrenceLabel(recurrence) {
    const found = recurrenceOptions.find(ro => ro.value === recurrence);
    return found ? found.label : recurrence;
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
        <a href="/club/dashboard" class="btn btn-ghost text-xl font-bold">← {club.name}</a>
      </div>
      <div class="flex-none">
        <h2 class="text-lg font-semibold">Court Blocking</h2>
      </div>
    </div>

    <div class="p-4 md:p-8 max-w-5xl mx-auto">
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

      <!-- Current Blocks Section -->
      <div class="card bg-base-200 shadow-lg mb-8">
        <div class="card-body">
          <h2 class="card-title mb-4">Active Court Blocks ({blocks.length})</h2>

          {#if blocks.length === 0}
            <p class="text-base-content/70">No court blocks configured yet. Create one below.</p>
          {:else}
            <div class="space-y-4">
              {#each blocks as block (block.id)}
                <div class="bg-base-100 p-4 rounded-lg border border-base-300">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h3 class="font-bold text-lg">{block.name}</h3>
                      <p class="text-sm text-base-content/70 mb-2">{block.description}</p>
                      <div class="flex flex-wrap gap-2 mb-2">
                        <span class="badge badge-primary">{getBlockTypeLabel(block.block_type)}</span>
                        <span class="badge badge-secondary">{getRecurrenceLabel(block.recurrence)}</span>
                        {#if block.court_id}
                          <span class="badge badge-outline">Court: {block.court_id}</span>
                        {:else}
                          <span class="badge badge-outline">All Courts</span>
                        {/if}
                      </div>
                      <div class="text-sm">
                        <p><strong>Date:</strong> {formatDate(block.start_date)} to {formatDate(block.end_date)}</p>
                        <p><strong>Time:</strong> {formatTime(block.start_time)} - {formatTime(block.end_time)}</p>
                        <p><strong>Reason:</strong> {block.reason}</p>
                      </div>
                    </div>
                    <button
                      class="btn btn-sm {block.is_active ? 'btn-success' : 'btn-ghost'}"
                      on:click={() => toggleBlock(block.id)}
                    >
                      {block.is_active ? '✓ Active' : '○ Inactive'}
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <!-- Add New Block Form -->
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h2 class="card-title mb-4">{showNewBlockForm ? 'Create New Court Block' : 'Add New Block'}</h2>

          {#if !showNewBlockForm}
            <button class="btn btn-primary w-full" on:click={() => (showNewBlockForm = true)}>
              + Create Court Block
            </button>
          {:else}
            <form on:submit|preventDefault={handleAddBlock} class="space-y-4">
              <!-- Block Name -->
              <div class="form-control">
                <label class="label" for="block-name">
                  <span class="label-text font-semibold">Block Name</span>
                </label>
                <input
                  id="block-name"
                  type="text"
                  placeholder="e.g., Annual Maintenance"
                  class="input input-bordered"
                  bind:value={newBlock.name}
                />
              </div>

              <!-- Description -->
              <div class="form-control">
                <label class="label" for="block-description">
                  <span class="label-text font-semibold">Description</span>
                </label>
                <textarea
                  id="block-description"
                  placeholder="Brief description of the block"
                  class="textarea textarea-bordered"
                  bind:value={newBlock.description}
                ></textarea>
              </div>

              <!-- Block Type -->
              <div class="form-control">
                <label class="label" for="block-type">
                  <span class="label-text font-semibold">Block Type</span>
                </label>
                <select id="block-type" class="select select-bordered" bind:value={newBlock.block_type}>
                  {#each blockTypes as type}
                    <option value={type.value}>{type.label}</option>
                  {/each}
                </select>
              </div>

              <!-- Date Range -->
              <div class="grid grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label" for="start-date">
                    <span class="label-text font-semibold">Start Date</span>
                  </label>
                  <input
                    id="start-date"
                    type="date"
                    class="input input-bordered"
                    bind:value={newBlock.start_date}
                  />
                </div>

                <div class="form-control">
                  <label class="label" for="end-date">
                    <span class="label-text font-semibold">End Date</span>
                  </label>
                  <input
                    id="end-date"
                    type="date"
                    class="input input-bordered"
                    bind:value={newBlock.end_date}
                  />
                </div>
              </div>

              <!-- Time Range -->
              <div class="grid grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label" for="start-time">
                    <span class="label-text font-semibold">Start Time</span>
                  </label>
                  <input
                    id="start-time"
                    type="time"
                    class="input input-bordered"
                    bind:value={newBlock.start_time}
                  />
                </div>

                <div class="form-control">
                  <label class="label" for="end-time">
                    <span class="label-text font-semibold">End Time</span>
                  </label>
                  <input
                    id="end-time"
                    type="time"
                    class="input input-bordered"
                    bind:value={newBlock.end_time}
                  />
                </div>
              </div>

              <!-- Recurrence -->
              <div class="form-control">
                <label class="label" for="recurrence">
                  <span class="label-text font-semibold">Recurrence</span>
                </label>
                <select id="recurrence" class="select select-bordered" bind:value={newBlock.recurrence}>
                  {#each recurrenceOptions as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </div>

              <!-- Court Selection -->
              <div class="form-control">
                <label class="label" for="court-id">
                  <span class="label-text font-semibold">Court (optional)</span>
                </label>
                <select id="court-id" class="select select-bordered" bind:value={newBlock.court_id}>
                  <option value={null}>All Courts</option>
                  {#each courts as court}
                    <option value={court.id}>{court.name}</option>
                  {/each}
                </select>
              </div>

              <!-- Reason -->
              <div class="form-control">
                <label class="label" for="reason">
                  <span class="label-text font-semibold">Reason</span>
                </label>
                <textarea
                  id="reason"
                  placeholder="Why is this court blocked? (5+ characters)"
                  class="textarea textarea-bordered"
                  bind:value={newBlock.reason}
                ></textarea>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3 mt-6">
                <button type="submit" class="btn btn-primary flex-1">Create Block</button>
                <button type="button" class="btn btn-ghost flex-1" on:click={resetForm}>Cancel</button>
              </div>
            </form>
          {/if}
        </div>
      </div>

      <!-- Info Box -->
      <div class="alert mt-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="font-bold">How Court Blocking Works</h3>
          <p class="text-sm">
            Blocks prevent bookings for courts during specific time periods. You can block specific courts or all courts in your club.
            Blocks can be one-time or recurring (weekly/monthly/yearly).
          </p>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="min-h-screen flex items-center justify-center bg-base-100">
    <div class="card bg-base-200 shadow-xl">
      <div class="card-body text-center">
        <h1 class="card-title">Not Logged In</h1>
        <p>Please log in to manage court blocking.</p>
        <a href="/club-login" class="btn btn-primary mt-4">Go to Login</a>
      </div>
    </div>
  </div>
{/if}
