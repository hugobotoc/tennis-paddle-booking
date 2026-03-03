<script>
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { onMount } from 'svelte';

  let isLoading = true;

  onMount(() => {
    if (!$authStore) {
      goto('/login');
    }
    isLoading = false;
  });
</script>

{#if !isLoading}
  <div>
    <div class="navbar bg-base-200 shadow">
      <div class="flex-1">
        <a href="/dashboard" class="btn btn-ghost normal-case text-xl">
          🎾 Admin
        </a>
      </div>
      <div class="flex-none gap-2">
        <div class="dropdown dropdown-end">
          <button tabindex="0" class="btn btn-ghost">
            Admin Menu
          </button>
          <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><a href="/admin">Dashboard</a></li>
            <li><a href="/admin/inventory">Manage Inventory</a></li>
            <li><a href="/admin/bookings">Manage Bookings</a></li>
            <li><a href="/admin/analytics">View Analytics</a></li>
            <li><button on:click={() => goto('/login')}>Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
    <slot />
  </div>
{/if}
