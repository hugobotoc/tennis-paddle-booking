<script lang="ts">
  import { onMount } from 'svelte';
  import { getAllCourts, createCourt, updateCourt, deleteCourt, validateCourtInput } from '$lib/data/courts';
  import { getAllMockBookings } from '$lib/data/bookings';

  /** @type {import('$lib/data/courts').Court[]} */
  let courts = [];
  let showModal = false;
  let isEditing = false;
  let editingId = '';
  let formErrors = [];
  let successMessage = '';
  let sortBy = 'name';

  /** @type {Partial<import('$lib/data/courts').CreateCourtInput>} */
  let formData = {
    name: '',
    location: '',
    type: 'tennis',
    surface: '',
    hourly_rate: 0,
    total_slots: 0,
    description: ''
  };

  onMount(() => {
    loadCourts();
  });

  function loadCourts() {
    courts = getAllCourts().sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'type') return a.type.localeCompare(b.type);
      if (sortBy === 'location') return a.location.localeCompare(b.location);
      return 0;
    });
  }

  function openModal(court) {
    if (court) {
      isEditing = true;
      editingId = court.id;
      formData = { ...court };
    } else {
      isEditing = false;
      editingId = '';
      formData = {
        name: '',
        location: '',
        type: 'tennis',
        surface: '',
        hourly_rate: 0,
        total_slots: 0,
        description: ''
      };
    }
    formErrors = [];
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    formErrors = [];
  }

  function handleSubmit() {
    formErrors = validateCourtInput(formData);

    if (formErrors.length > 0) {
      return;
    }

    try {
      if (isEditing) {
        updateCourt(editingId, formData);
        successMessage = 'Court updated successfully!';
      } else {
        createCourt(formData);
        successMessage = 'Court created successfully!';
      }

      loadCourts();
      closeModal();

      setTimeout(() => {
        successMessage = '';
      }, 3000);
    } catch (error) {
      formErrors = [error instanceof Error ? error.message : 'An error occurred'];
    }
  }

  function handleDelete(id) {
    const bookings = getAllMockBookings();
    const hasBookings = bookings.some(b => b.court_id === id && (b.status === 'confirmed' || b.status === 'pending'));
    
    if (hasBookings) {
      alert('Cannot delete court with active bookings');
      return;
    }

    if (confirm('Are you sure you want to delete this court?')) {
      try {
        deleteCourt(id);
        loadCourts();
        successMessage = 'Court deleted successfully!';
        setTimeout(() => {
          successMessage = '';
        }, 3000);
      } catch (error) {
        formErrors = [error instanceof Error ? error.message : 'Failed to delete court'];
      }
    }
  }

  function handleSort(field) {
    sortBy = field;
    loadCourts();
  }
</script>

<div class="min-h-screen bg-base-100">
  <div class="bg-base-200 px-4 py-6 border-b border-base-300">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold">Court Management</h1>
        <p class="text-base-content/70 mt-2">Add, edit, or delete courts</p>
      </div>
      <button
        class="btn btn-primary"
        on:click={() => openModal(null)}
        aria-label="Add new court"
      >
        + Add Court
      </button>
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

    <div class="mb-6 flex gap-2">
      <button class="btn btn-sm" class:btn-primary={sortBy === 'name'} on:click={() => handleSort('name')}>Sort by Name</button>
      <button class="btn btn-sm" class:btn-primary={sortBy === 'type'} on:click={() => handleSort('type')}>Sort by Type</button>
      <button class="btn btn-sm" class:btn-primary={sortBy === 'location'} on:click={() => handleSort('location')}>Sort by Location</button>
    </div>

    <div class="overflow-x-auto hidden md:block">
      <table class="table table-zebra w-full">
        <thead class="bg-base-200">
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Type</th>
            <th>Surface</th>
            <th>Rate/hr</th>
            <th>Slots</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each courts as court (court.id)}
            <tr class="hover">
              <td class="font-semibold">{court.name}</td>
              <td class="text-sm text-base-content/70">{court.location}</td>
              <td>
                <span class="badge" class:badge-primary={court.type === 'tennis'} class:badge-secondary={court.type === 'padel'}>
                  {court.type}
                </span>
              </td>
              <td class="text-sm">{court.surface}</td>
              <td class="font-mono font-bold">${court.hourly_rate}</td>
              <td class="text-center font-mono">{court.total_slots}</td>
              <td>
                <span class="badge" class:badge-success={court.available_now} class:badge-error={!court.available_now}>
                  {court.available_now ? 'Available' : 'Unavailable'}
                </span>
              </td>
              <td class="flex gap-2">
                <button
                  class="btn btn-xs btn-primary"
                  on:click={() => openModal(court)}
                  aria-label="Edit {court.name}"
                >
                  Edit
                </button>
                <button
                  class="btn btn-xs btn-error"
                  on:click={() => handleDelete(court.id)}
                  aria-label="Delete {court.name}"
                >
                  Delete
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="grid grid-cols-1 md:hidden gap-4">
      {#each courts as court (court.id)}
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h3 class="card-title text-lg">{court.name}</h3>
            <p class="text-sm text-base-content/70">{court.location}</p>
            <div class="divider my-2" />
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-base-content/70">Type:</span>
                <span class="badge badge-sm" class:badge-primary={court.type === 'tennis'} class:badge-secondary={court.type === 'padel'}>
                  {court.type}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-base-content/70">Surface:</span>
                <span class="font-mono">{court.surface}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-base-content/70">Rate:</span>
                <span class="font-bold">${court.hourly_rate}/hr</span>
              </div>
              <div class="flex justify-between">
                <span class="text-base-content/70">Slots:</span>
                <span class="font-mono">{court.total_slots}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-base-content/70">Status:</span>
                <span class="badge badge-sm" class:badge-success={court.available_now} class:badge-error={!court.available_now}>
                  {court.available_now ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
            <div class="card-actions gap-2 mt-4">
              <button
                class="btn btn-sm btn-primary flex-1"
                on:click={() => openModal(court)}
                aria-label="Edit {court.name}"
              >
                Edit
              </button>
              <button
                class="btn btn-sm btn-error flex-1"
                on:click={() => handleDelete(court.id)}
                aria-label="Delete {court.name}"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  {#if showModal}
    <div class="fixed inset-0 bg-black/50 z-40" on:click={closeModal} on:keydown={(e) => e.key === 'Escape' && closeModal()} role="button" tabindex="-1" />
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-base-100 rounded-lg shadow-2xl z-50 w-96 max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-4">{isEditing ? 'Edit Court' : 'Add New Court'}</h2>

        {#if formErrors.length > 0}
          <div class="alert alert-error mb-4" role="alert">
            <ul class="list-disc list-inside">
              {#each formErrors as error}
                <li>{error}</li>
              {/each}
            </ul>
          </div>
        {/if}

        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
          <div class="form-control">
            <label class="label" for="name">
              <span class="label-text font-semibold">Court Name *</span>
            </label>
            <input
              type="text"
              id="name"
              class="input input-bordered"
              bind:value={formData.name}
              placeholder="e.g., Central Court 1"
              required
            />
          </div>

          <div class="form-control">
            <label class="label" for="location">
              <span class="label-text font-semibold">Location *</span>
            </label>
            <input
              type="text"
              id="location"
              class="input input-bordered"
              bind:value={formData.location}
              placeholder="e.g., 123 Sports Lane, Downtown"
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="form-control">
              <label class="label" for="type">
                <span class="label-text font-semibold">Type *</span>
              </label>
              <select id="type" class="select select-bordered" bind:value={formData.type} required>
                <option value="tennis">Tennis</option>
                <option value="padel">Padel</option>
              </select>
            </div>
            <div class="form-control">
              <label class="label" for="surface">
                <span class="label-text font-semibold">Surface *</span>
              </label>
              <input
                type="text"
                id="surface"
                class="input input-bordered"
                bind:value={formData.surface}
                placeholder="e.g., Hard Court"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="form-control">
              <label class="label" for="hourly_rate">
                <span class="label-text font-semibold">Hourly Rate *</span>
              </label>
              <input
                type="number"
                id="hourly_rate"
                class="input input-bordered"
                bind:value={formData.hourly_rate}
                min="0"
                step="0.01"
                placeholder="25.00"
                required
              />
            </div>
            <div class="form-control">
              <label class="label" for="total_slots">
                <span class="label-text font-semibold">Total Slots *</span>
              </label>
              <input
                type="number"
                id="total_slots"
                class="input input-bordered"
                bind:value={formData.total_slots}
                min="1"
                step="1"
                placeholder="8"
                required
              />
            </div>
          </div>

          <div class="form-control">
            <label class="label" for="description">
              <span class="label-text font-semibold">Description</span>
            </label>
            <textarea
              id="description"
              class="textarea textarea-bordered"
              bind:value={formData.description}
              placeholder="Court details..."
              rows="3"
            />
          </div>

          <div class="flex gap-3 mt-6">
            <button type="button" class="btn btn-ghost flex-1" on:click={closeModal}>
              Cancel
            </button>
            <button type="submit" class="btn btn-primary flex-1">
              {isEditing ? 'Update' : 'Create'} Court
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}
</div>
