<script lang="ts">
  import { goto } from '$app/navigation';
  import { mockRegister } from '$lib/auth';
  import { authStore } from '$lib/stores/auth';

  let email = '';
  let password = '';
  let confirmPassword = '';
  let name = '';
  let error = '';
  let isLoading = false;
  let showPassword = false;
  let showConfirmPassword = false;

  function validateForm() {
    if (!email || !password || !confirmPassword || !name) {
      return 'All fields are required';
    }

    if (!email.includes('@') || !email.includes('.')) {
      return 'Please enter a valid email address';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }

    return '';
  }

  async function handleRegister() {
    error = '';
    isLoading = true;

    const validationError = validateForm();
    if (validationError) {
      error = validationError;
      isLoading = false;
      return;
    }

    const { user, error: authError } = await mockRegister(email, password, name);

    if (authError) {
      error = authError;
      isLoading = false;
      return;
    }

    if (user) {
      authStore.login(user);
      await goto('/dashboard');
    }
  }

  async function handleKeydown(e) {
    if (e.key === 'Enter' && !isLoading) {
      await handleRegister();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div
  class="min-h-screen bg-gradient-to-br from-primary to-primary-focus flex items-center justify-center p-4"
>
  <div class="w-full max-w-md">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="card-title justify-center text-2xl mb-2">🎾 Tennis Paddle Booking</div>
        <p class="text-center text-sm opacity-70 mb-6">Create your account</p>

        {#if error}
          <div class="alert alert-error" role="alert" aria-live="polite" aria-atomic="true">
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
                d="M10 14l4-4m0 0l4-4m-4 4l-4-4m4 4l4 4M4 12a8 8 0 1116 0 8 8 0 01-16 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        {/if}

        <form on:submit|preventDefault={handleRegister} class="space-y-4">
          <div class="form-control">
            <label class="label" for="name">
              <span class="label-text">Full Name</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              class="input input-bordered"
              bind:value={name}
              disabled={isLoading}
              required
            />
          </div>

          <div class="form-control">
            <label class="label" for="email">
              <span class="label-text">Email</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              class="input input-bordered"
              bind:value={email}
              disabled={isLoading}
              required
            />
          </div>

          <div class="form-control">
            <label class="label" for="password">
              <span class="label-text">Password</span>
            </label>
            <div class="relative">
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                class="input input-bordered w-full password-input"
                class:show-password={showPassword}
                bind:value={password}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                class="absolute right-3 top-3 text-sm opacity-60 hover:opacity-100"
                on:click={() => (showPassword = !showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabindex="-1"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <label class="label" for="password">
              <span class="label-text-alt">Minimum 6 characters</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label" for="confirmPassword">
              <span class="label-text">Confirm Password</span>
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                class="input input-bordered w-full password-input"
                class:show-password={showConfirmPassword}
                bind:value={confirmPassword}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                class="absolute right-3 top-3 text-sm opacity-60 hover:opacity-100"
                on:click={() => (showConfirmPassword = !showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                tabindex="-1"
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-full" disabled={isLoading}>
            {#if isLoading}
              <span class="loading loading-spinner loading-sm" />
              Creating account...
            {:else}
              Create Account
            {/if}
          </button>
        </form>

        <div class="divider">OR</div>

        <p class="text-center text-sm">
          Already have an account?
          <a href="/login" class="link link-primary font-semibold">Login here</a>
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  /* Password visibility toggle using CSS (no DOM recreation) */
  :global(input.password-input.show-password) {
    -webkit-text-security: none;
  }

  /* Mobile-first responsive adjustments */
  @media (max-width: 640px) {
    :global(.min-h-screen) {
      min-height: 100vh;
      padding: 1rem;
    }
  }
</style>
