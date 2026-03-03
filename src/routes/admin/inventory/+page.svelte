<script lang="ts">
  import { onMount } from 'svelte';
  import { getAllCourts, createCourt, updateCourt, deleteCourt, validateCourtInput } from '$lib/data/inventory';

  /** @type {import('$lib/data/paddles').Paddle[]} */
  let paddles = [];
  let showModal = false;
  let isEditing = false;
  let editingId = '';
  let formErrors = [];
  let successMessage = '';

  /** @type {import('$lib/data/inventory').CreatePaddleInput} */
  let formData = {
    name: '',
    brand: '',
    model: '',
    description: '',
    weight: '',
    grip_type: '',
    material: '',
    frame_thickness: '',
    price_per_hour: 0,
    condition: 'good',
    available_now: true,
    image_url: 'https://via.placeholder.com/400x300?text=Tennis+Paddle'
  };

  onMount(() => {
    loadPaddles();
  });

  function loadPaddles() {
    paddles = getAllCourts();
  }

  /**
   * @param {import('$lib/data/paddles').Paddle} [paddle]
   */
  function openModal(paddle) {
    if (paddle) {
      isEditing = true;
      editingId = paddle.id;
      formData = { ...paddle };
    } else {
      isEditing = false;
      editingId = '';
      formData = {
        name: '',
        brand: '',
        model: '',
        description: '',
        weight: '',
        grip_type: '',
        material: '',
        frame_thickness: '',
        price_per_hour: 0,
        condition: 'good',
        available_now: true,
        image_url: 'https://via.placeholder.com/400x300?text=Tennis+Paddle'
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
        successMessage = 'Paddle updated successfully!';
      } else {
        createCourt(formData);
        successMessage = 'Paddle created successfully!';
      }

      loadPaddles();
      closeModal();

      setTimeout(() => {
        successMessage = '';
      }, 3000);
    } catch (error) {
      formErrors = [error instanceof Error ? error.message : 'An error occurred'];
    }
  }

  /**
   * @param {string} id
   */
  function handleDelete(id) {
    if (confirm('Are you sure you want to delete this paddle?')) {
      try {
        deleteCourt(id);
        loadPaddles();
        successMessage = 'Paddle deleted successfully!';
        setTimeout(() => {
          successMessage = '';
        }, 3000);
      } catch (error) {
        formErrors = [error instanceof Error ? error.message : 'Failed to delete paddle'];
      }
    }
  }
</script>

<div class="min-h-screen bg-base-100">
  <div class="bg-base-200 px-4 py-6 border-b border-base-300">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold">Manage Inventory</h1>
        <p class="text-base-content/70 mt-2">Add, edit, or delete paddles</p>
      </div>
      <button
        class="btn btn-primary"
        on:click={() => openModal()}
        aria-label="Add new paddle"
      >
        + Add Paddle
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

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each paddles as paddle (paddle.id)}
        <div class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
          <figure class="h-48 bg-base-300 overflow-hidden">
            <img src={paddle.image_url} alt={paddle.name} class="w-full h-full object-cover" />
          </figure>
          <div class="card-body">
            <h3 class="card-title text-lg">{paddle.name}</h3>
            <p class="text-sm text-base-content/70">{paddle.brand} {paddle.model}</p>
            <p class="text-sm text-base-content/60 line-clamp-2">{paddle.description}</p>

            <div class="mt-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-base-content/70">Price:</span>
                <span class="font-bold">${paddle.price_per_hour}/hr</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-base-content/70">Condition:</span>
                <span class="badge badge-sm capitalize">{paddle.condition}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-base-content/70">Available:</span>
                <span class="badge badge-sm" class:badge-success={paddle.available_now} class:badge-error={!paddle.available_now}>
                  {paddle.available_now ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <div class="card-actions gap-2 mt-6">
              <button
                class="btn btn-sm btn-primary flex-1"
                on:click={() => openModal(paddle)}
                aria-label="Edit {paddle.name}"
              >
                Edit
              </button>
              <button
                class="btn btn-sm btn-error flex-1"
                on:click={() => handleDelete(paddle.id)}
                aria-label="Delete {paddle.name}"
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
        <h2 class="text-2xl font-bold mb-4">{isEditing ? 'Edit Paddle' : 'Add New Paddle'}</h2>

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
              <span class="label-text font-semibold">Paddle Name *</span>
            </label>
            <input
              type="text"
              id="name"
              class="input input-bordered"
              bind:value={formData.name}
              placeholder="e.g., Pro Power 3000"
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="form-control">
              <label class="label" for="brand">
                <span class="label-text font-semibold">Brand *</span>
              </label>
              <input
                type="text"
                id="brand"
                class="input input-bordered"
                bind:value={formData.brand}
                placeholder="e.g., Wilson"
                required
              />
            </div>
            <div class="form-control">
              <label class="label" for="model">
                <span class="label-text font-semibold">Model</span>
              </label>
              <input
                type="text"
                id="model"
                class="input input-bordered"
                bind:value={formData.model}
                placeholder="e.g., WRT"
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
              placeholder="Paddle details..."
              rows="3"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="form-control">
              <label class="label" for="weight">
                <span class="label-text font-semibold">Weight</span>
              </label>
              <input
                type="text"
                id="weight"
                class="input input-bordered"
                bind:value={formData.weight}
                placeholder="e.g., 7.5 oz"
              />
            </div>
            <div class="form-control">
              <label class="label" for="price">
                <span class="label-text font-semibold">Price/Hour *</span>
              </label>
              <input
                type="number"
                id="price"
                class="input input-bordered"
                bind:value={formData.price_per_hour}
                min="0"
                step="0.01"
                placeholder="15.00"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="form-control">
              <label class="label" for="grip">
                <span class="label-text font-semibold">Grip Type</span>
              </label>
              <input
                type="text"
                id="grip"
                class="input input-bordered"
                bind:value={formData.grip_type}
                placeholder="e.g., Cushion"
              />
            </div>
            <div class="form-control">
              <label class="label" for="material">
                <span class="label-text font-semibold">Material</span>
              </label>
              <input
                type="text"
                id="material"
                class="input input-bordered"
                bind:value={formData.material}
                placeholder="e.g., Graphite"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="form-control">
              <label class="label" for="thickness">
                <span class="label-text font-semibold">Frame Thickness</span>
              </label>
              <input
                type="text"
                id="thickness"
                class="input input-bordered"
                bind:value={formData.frame_thickness}
                placeholder="e.g., 17mm"
              />
            </div>
            <div class="form-control">
              <label class="label" for="condition">
                <span class="label-text font-semibold">Condition</span>
              </label>
              <select id="condition" class="select select-bordered" bind:value={formData.condition}>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
          </div>

          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Available for Booking</span>
              <input type="checkbox" class="checkbox" bind:checked={formData.available_now} />
            </label>
          </div>

          <div class="flex gap-3 mt-6">
            <button type="button" class="btn btn-ghost flex-1" on:click={closeModal}>
              Cancel
            </button>
            <button type="submit" class="btn btn-primary flex-1">
              {isEditing ? 'Update' : 'Create'} Paddle
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}
</div>
