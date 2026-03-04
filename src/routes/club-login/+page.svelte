<script>
  import { goto } from '$app/navigation';
  import { clubLogin } from '$lib/stores/club-auth';

  let formData = {
    email: 'admin@downtowntennisclub.com', // pre-filled for demo
    password: 'demo123' // pre-filled for demo
  };

  let errors = [];
  let isLoading = false;
  let successMessage = '';

  async function handleSubmit() {
    errors = [];
    isLoading = true;

    try {
      // Validate
      if (!formData.email.trim()) errors.push('Email required');
      if (!formData.password) errors.push('Password required');

      if (errors.length > 0) {
        isLoading = false;
        return;
      }

      await clubLogin(formData.email, formData.password);
      successMessage = 'Login successful! Redirecting to dashboard...';
      setTimeout(() => goto('/club/dashboard'), 1500);
    } catch (error) {
      errors = [error instanceof Error ? error.message : 'Login failed'];
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-primary to-primary-focus flex items-center justify-center p-4">
  <div class="card bg-base-100 shadow-2xl max-w-md w-full">
    <div class="card-body">
      <h1 class="card-title text-3xl mb-2 text-center">Club Login</h1>
      <p class="text-center text-base-content/70 mb-6">Sign in to manage your courts and bookings</p>

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
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn btn-primary w-full mt-6" disabled={isLoading}>
          {#if isLoading}
            <span class="loading loading-spinner loading-sm" />
            Signing in...
          {:else}
            Login
          {/if}
        </button>
      </form>

      <div class="divider my-4">OR</div>

      <a href="/club-signup" class="btn btn-ghost w-full"> Don't have an account? Register </a>

      <a href="/signup" class="btn btn-ghost btn-sm w-full mt-2"> Looking to book? Switch to Player </a>

      <div class="mt-6 p-3 bg-info/10 rounded text-sm">
        <p class="font-semibold mb-1">Demo Credentials:</p>
        <p><strong>Club 1:</strong> admin@downtowntennisclub.com / demo123</p>
        <p><strong>Club 2:</strong> contact@padelparadise.com / padel456</p>
      </div>
    </div>
  </div>
</div>

<style>
  :global(body) {
    @apply bg-base-100;
  }
</style>
