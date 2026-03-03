<script lang="ts">
  import '../app.css';
</script>

<div class="min-h-screen bg-base-100">
  <div class="navbar bg-base-200 shadow">
    <div class="flex-1">
      <a href="/dashboard" class="btn btn-ghost normal-case text-xl">
        🎾 Tennis Paddle Booking
      </a>
    </div>
    <div class="flex-none gap-2">
      <a href="/admin" class="link link-primary">Admin</a>
    </div>
  </div>
  <slot />
</div>
