<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="min-h-screen flex items-center justify-center bg-base-100 p-4">
  <div class="card bg-base-200 shadow-xl max-w-md">
    <div class="card-body">
      <h1 class="card-title text-3xl">Error {$page.status}</h1>
      <p class="text-lg opacity-75">
        {$page.error?.message || 'Something went wrong'}
      </p>
      <div class="card-actions justify-start mt-4">
        <a href="/login" class="btn btn-primary">Go to Login</a>
      </div>
    </div>
  </div>
</div>
