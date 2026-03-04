<script>
  import { goto } from '$app/navigation';
  import { clubSignup } from '$lib/stores/club-auth';

  let formData = {
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    city: '',
    currency: 'SEK'
  };

  let errors = [];
  let isLoading = false;
  let successMessage = '';

  const currencies = [
    { value: 'USD', label: 'USD ($) - United States Dollar' },
    { value: 'EUR', label: 'EUR (€) - Euro' },
    { value: 'SEK', label: 'SEK (kr) - Swedish Krona' },
    { value: 'GBP', label: 'GBP (£) - British Pound' },
    { value: 'NOK', label: 'NOK (kr) - Norwegian Krone' },
    { value: 'DKK', label: 'DKK (kr) - Danish Krone' },
    { value: 'CHF', label: 'CHF - Swiss Franc' }
  ];

  async function handleSubmit() {
    errors = [];
    isLoading = true;

    try {
      // Basic client-side validation
      if (!formData.name.trim()) errors.push('Club name required');
      if (!formData.email.trim()) errors.push('Email required');
      if (formData.password.length < 6) errors.push('Password must be at least 6 characters');
      if (!formData.phone.trim()) errors.push('Phone required');
      if (!formData.location.trim()) errors.push('Location required');
      if (!formData.city.trim()) errors.push('City required');

      if (errors.length > 0) {
        isLoading = false;
        return;
      }

      await clubSignup(formData);
      successMessage = 'Signup successful! Redirecting to dashboard...';
      setTimeout(() => goto('/club/dashboard'), 1500);
    } catch (error) {
      errors = [error instanceof Error ? error.message : 'Signup failed'];
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-primary to-primary-focus flex items-center justify-center p-4">
  <div class="card bg-base-100 shadow-2xl max-w-md w-full">
    <div class="card-body">
      <h1 class="card-title text-3xl mb-2 text-center">Register Your Club</h1>
      <p class="text-center text-base-content/70 mb-6">Create a tennis club account and start managing bookings</p>

      {#if successMessage}
        <div class="alert alert-success mb-4" role="status" aria-live="polite">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{successMessage}</span>
        </div>
      {/if}

      {#if errors.length > 0}
        <div class="alert alert-error mb-4" role="alert" aria-live="polite">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0-10a8 8 0 100 16 8 8 0 000-16z" />
          </svg>
          <div>
            {#each errors as error}
              <div>{error}</div>
            {/each}
          </div>
        </div>
      {/if}

      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <!-- Club Name -->
        <div class="form-control">
          <label class="label" for="name">
            <span class="label-text font-semibold">Club Name</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g., Downtown Tennis Club"
            class="input input-bordered"
            bind:value={formData.name}
            disabled={isLoading}
          />
        </div>

        <!-- Email -->
        <div class="form-control">
          <label class="label" for="email">
            <span class="label-text font-semibold">Email</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="admin@tennisclub.com"
            class="input input-bordered"
            bind:value={formData.email}
            disabled={isLoading}
          />
        </div>

        <!-- Password -->
        <div class="form-control">
          <label class="label" for="password">
            <span class="label-text font-semibold">Password</span>
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            class="input input-bordered"
            bind:value={formData.password}
            disabled={isLoading}
          />
          <label class="label" for="password">
            <span class="label-text-alt">Min. 6 characters</span>
          </label>
        </div>

        <!-- Phone -->
        <div class="form-control">
          <label class="label" for="phone">
            <span class="label-text font-semibold">Phone</span>
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+46123456789"
            class="input input-bordered"
            bind:value={formData.phone}
            disabled={isLoading}
          />
        </div>

        <!-- Location -->
        <div class="form-control">
          <label class="label" for="location">
            <span class="label-text font-semibold">Address</span>
          </label>
          <input
            id="location"
            type="text"
            placeholder="123 Main Street"
            class="input input-bordered"
            bind:value={formData.location}
            disabled={isLoading}
          />
        </div>

        <!-- City -->
        <div class="form-control">
          <label class="label" for="city">
            <span class="label-text font-semibold">City</span>
          </label>
          <input
            id="city"
            type="text"
            placeholder="Stockholm"
            class="input input-bordered"
            bind:value={formData.city}
            disabled={isLoading}
          />
        </div>

        <!-- Currency Selection -->
        <div class="form-control">
          <label class="label" for="currency">
            <span class="label-text font-semibold">Currency</span>
          </label>
          <select
            id="currency"
            class="select select-bordered"
            bind:value={formData.currency}
            disabled={isLoading}
          >
            {#each currencies as curr}
              <option value={curr.value}>{curr.label}</option>
            {/each}
          </select>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="btn btn-primary w-full mt-6"
          disabled={isLoading}
        >
          {#if isLoading}
            <span class="loading loading-spinner loading-sm" />
            Creating Club...
          {:else}
            Register Club
          {/if}
        </button>
      </form>

      <div class="divider my-4">OR</div>

      <a href="/club-login" class="btn btn-ghost w-full">
        Already have an account? Login
      </a>

      <a href="/signup" class="btn btn-ghost btn-sm w-full mt-2">
        Looking to book? Switch to Player
      </a>
    </div>
  </div>
</div>

<style>
  :global(body) {
    @apply bg-base-100;
  }
</style>
