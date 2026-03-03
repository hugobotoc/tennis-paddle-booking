<script lang="ts">
  import { goto } from '$app/navigation';
  import { mockLogin } from '$lib/auth';
  import { authStore } from '$lib/stores/auth';

  let email = '';
  let password = '';
  let error = '';
  let isLoading = false;
  let showPassword = false;

  async function handleLogin() {
    error = '';
    isLoading = true;

    if (!email || !password) {
      error = 'Email and password are required';
      isLoading = false;
      return;
    }

    const { user, error: authError } = await mockLogin(email, password);

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
      await handleLogin();
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
        <p class="text-center text-sm opacity-70 mb-6">Log in to your account</p>

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

        <form on:submit|preventDefault={handleLogin} class="space-y-4">
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
          </div>

          <button type="submit" class="btn btn-primary w-full" disabled={isLoading}>
            {#if isLoading}
              <span class="loading loading-spinner loading-sm" />
              Logging in...
            {:else}
              Login
            {/if}
          </button>
        </form>

        <div class="divider">OR</div>

        <p class="text-center text-sm">
          Don't have an account?
          <a href="/register" class="link link-primary font-semibold">Register here</a>
        </p>

        <div class="alert alert-info mt-4 text-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="stroke-current shrink-0 w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p class="font-bold">Demo Credentials:</p>
            <p>Email: demo@example.com</p>
            <p>Password: demo123</p>
          </div>
        </div>
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
