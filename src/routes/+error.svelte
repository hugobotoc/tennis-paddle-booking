<script lang="ts">
  import { page } from '$app/stores';
</script>

<div
  class="min-h-screen bg-gradient-to-br from-error to-error-focus flex items-center justify-center p-4"
>
  <div class="w-full max-w-md">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="card-title text-center text-3xl mb-4">⚠️ Error</div>

        <div class="space-y-4">
          <div>
            <h2 class="text-2xl font-bold mb-2">{$page.status}</h2>
            <p class="text-lg opacity-75">
              {$page.error?.message || 'Something went wrong'}
            </p>
          </div>

          {#if $page.status === 404}
            <p class="text-sm opacity-60">The page you're looking for doesn't exist.</p>
          {:else if $page.status === 500}
            <p class="text-sm opacity-60">
              Something went wrong on our end. Please try again later.
            </p>
          {/if}

          <div class="card-actions justify-center pt-4">
            <a href="/login" class="btn btn-primary">Go to Login</a>
            <a href="/" class="btn btn-ghost">Go Home</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @media (max-width: 640px) {
    :global(.min-h-screen) {
      padding: 1rem;
    }
  }
</style>
