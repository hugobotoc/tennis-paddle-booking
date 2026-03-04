<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { clubStore } from '$lib/stores/club-auth';
  import { getPricingRulesByClub, togglePricingRuleActive, PRICING_TEMPLATES } from '$lib/data/pricing-rules';

  let club = $clubStore;
  let rules = [];
  let templates = PRICING_TEMPLATES;
  let isLoading = true;
  let showNewRuleForm = false;
  let successMessage = '';
  let errorMessage = '';

  let newRule = {
    name: '',
    days: [],
    start_hour: 8,
    start_minute: 0,
    end_hour: 10,
    end_minute: 0,
    price: 5000,
    season: 'all',
    priority: 20
  };

  const daysOfWeek = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' }
  ];

  const seasons = ['all', 'summer', 'winter', 'spring', 'fall'];

  onMount(() => {
    if (!club) {
      goto('/club-login');
      return;
    }

    loadRules();
  });

  function loadRules() {
    rules = getPricingRulesByClub(club.id);
    isLoading = false;
  }

  function toggleDay(day) {
    const index = newRule.days.indexOf(day);
    if (index === -1) {
      newRule.days = [...newRule.days, day];
    } else {
      newRule.days = newRule.days.filter(d => d !== day);
    }
  }

  function isDaySelected(day) {
    return newRule.days.includes(day);
  }

  function handleToggleRule(ruleId) {
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      togglePricingRuleActive(ruleId);
      loadRules();
      successMessage = `Rule "${rule.name}" ${rule.is_active ? 'disabled' : 'enabled'}`;
      setTimeout(() => (successMessage = ''), 3000);
    }
  }

  function handleAddRule() {
    errorMessage = '';

    if (!newRule.name.trim()) {
      errorMessage = 'Rule name required';
      return;
    }

    if (newRule.days.length === 0) {
      errorMessage = 'Select at least one day';
      return;
    }

    if (newRule.price <= 0) {
      errorMessage = 'Price must be greater than 0';
      return;
    }

    successMessage = `Rule "${newRule.name}" created successfully`;
    resetForm();
    loadRules();
    setTimeout(() => (successMessage = ''), 3000);
  }

  function resetForm() {
    newRule = {
      name: '',
      days: [],
      start_hour: 8,
      start_minute: 0,
      end_hour: 10,
      end_minute: 0,
      price: 5000,
      season: 'all',
      priority: 20
    };
    showNewRuleForm = false;
  }

  function formatPrice(cents) {
    return (cents / 100).toFixed(2);
  }

  function formatTime(hour, minute) {
    const h = String(hour).padStart(2, '0');
    const m = String(minute).padStart(2, '0');
    return `${h}:${m}`;
  }

  function getDaysLabel(days) {
    if (days.length === 7) return 'Every day';
    if (days.length === 5 && !days.includes('saturday') && !days.includes('sunday'))
      return 'Mon-Fri';
    if (days.length === 2 && days.includes('saturday') && days.includes('sunday'))
      return 'Sat-Sun';
    return days.map(d => d.slice(0, 3)).join(', ');
  }
</script>

{#if isLoading}
  <div class="min-h-screen flex items-center justify-center bg-base-100">
    <div class="loading loading-spinner loading-lg" />
  </div>
{:else if club}
  <div class="min-h-screen bg-base-100">
    <!-- Navigation -->
    <div class="navbar bg-base-200 shadow-lg">
      <div class="flex-1">
        <a href="/club/dashboard" class="btn btn-ghost text-xl font-bold">← {club.name}</a>
      </div>
      <div class="flex-none">
        <h2 class="text-lg font-semibold">Pricing Rules</h2>
      </div>
    </div>

    <div class="p-4 md:p-8 max-w-5xl mx-auto">
      {#if successMessage}
        <div class="alert alert-success mb-6" role="status" aria-live="polite">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{successMessage}</span>
        </div>
      {/if}

      {#if errorMessage}
        <div class="alert alert-error mb-6" role="alert" aria-live="polite">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      {/if}

      <!-- Current Rules Section -->
      <div class="card bg-base-200 shadow-lg mb-8">
        <div class="card-body">
          <h2 class="card-title mb-4">Active Pricing Rules ({rules.filter(r => r.is_active).length})</h2>

          {#if rules.length === 0}
            <p class="text-base-content/70">No pricing rules configured yet. Create one below or use a template.</p>
          {:else}
            <div class="space-y-3">
              {#each rules as rule (rule.id)}
                <div class="bg-base-100 p-4 rounded flex items-center justify-between">
                  <div class="flex-1">
                    <h3 class="font-bold text-lg">{rule.name}</h3>
                    <p class="text-sm text-base-content/70">
                      {getDaysLabel(rule.days)} • {formatTime(rule.start_hour, rule.start_minute)}-{formatTime(
                        rule.end_hour,
                        rule.end_minute
                      )}
                    </p>
                    <p class="text-sm">
                      <span class="badge badge-primary">{club.currency_symbol}{formatPrice(rule.price)}</span>
                      {#if rule.season !== 'all'}
                        <span class="badge badge-secondary ml-2">{rule.season}</span>
                      {/if}
                      <span class="badge badge-outline ml-2">Priority: {rule.priority}</span>
                    </p>
                  </div>
                  <button
                    class="btn btn-sm {rule.is_active ? 'btn-success' : 'btn-ghost'}"
                    on:click={() => handleToggleRule(rule.id)}
                  >
                    {rule.is_active ? '✓ Active' : '○ Inactive'}
                  </button>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <!-- Suggested Templates -->
      {#if rules.length === 0}
        <div class="card bg-base-200 shadow-lg mb-8">
          <div class="card-body">
            <h2 class="card-title mb-4">📋 Suggested Templates</h2>
            <p class="text-sm text-base-content/70 mb-4">
              Quick-start with pre-built pricing templates. You can customize them later.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {#each templates as template (template.id)}
                <div class="card bg-base-100 border border-base-300">
                  <div class="card-body">
                    <h3 class="card-title text-base">{template.name}</h3>
                    <p class="text-xs text-base-content/70">{template.description}</p>
                    <p class="text-xs mt-2">
                      <strong>Court types:</strong> {template.court_types.join(', ')}
                    </p>
                    <div class="card-actions justify-end mt-4">
                      <button class="btn btn-sm btn-primary" on:click={() => alert('Use template - coming in next update')}>
                        Use Template
                      </button>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}

      <!-- Add New Rule Form -->
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h2 class="card-title mb-4">{showNewRuleForm ? 'Create New Pricing Rule' : 'Add New Rule'}</h2>

          {#if !showNewRuleForm}
            <button class="btn btn-primary w-full" on:click={() => (showNewRuleForm = true)}>
              + Create Custom Rule
            </button>
          {:else}
            <form on:submit|preventDefault={handleAddRule} class="space-y-4">
              <!-- Rule Name -->
              <div class="form-control">
                <label class="label" for="rule-name">
                  <span class="label-text font-semibold">Rule Name</span>
                </label>
                <input
                  id="rule-name"
                  type="text"
                  placeholder="e.g., Evening Peak"
                  class="input input-bordered"
                  bind:value={newRule.name}
                />
              </div>

              <!-- Days Selection -->
              <div class="form-control">
                <span class="label-text font-semibold mb-2 block">Days</span>
                <div class="grid grid-cols-7 gap-2">
                  {#each daysOfWeek as day (day.value)}
                    <button
                      type="button"
                      class="btn btn-sm {isDaySelected(day.value) ? 'btn-primary' : 'btn-outline'}"
                      on:click={() => toggleDay(day.value)}
                    >
                      {day.label}
                    </button>
                  {/each}
                </div>
              </div>

              <!-- Time Range -->
              <div class="grid grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label" for="start-hour">
                    <span class="label-text text-sm">Start Time</span>
                  </label>
                  <div class="flex gap-2">
                    <select id="start-hour" class="select select-bordered select-sm flex-1" bind:value={newRule.start_hour}>
                      {#each Array.from({ length: 24 }, (_, i) => i) as hour}
                        <option value={hour}>{String(hour).padStart(2, '0')}</option>
                      {/each}
                    </select>
                    <select class="select select-bordered select-sm flex-1" bind:value={newRule.start_minute}>
                      <option value={0}>00</option>
                      <option value={15}>15</option>
                      <option value={30}>30</option>
                      <option value={45}>45</option>
                    </select>
                  </div>
                </div>

                <div class="form-control">
                  <label class="label" for="end-hour">
                    <span class="label-text text-sm">End Time</span>
                  </label>
                  <div class="flex gap-2">
                    <select id="end-hour" class="select select-bordered select-sm flex-1" bind:value={newRule.end_hour}>
                      {#each Array.from({ length: 24 }, (_, i) => i) as hour}
                        <option value={hour}>{String(hour).padStart(2, '0')}</option>
                      {/each}
                    </select>
                    <select class="select select-bordered select-sm flex-1" bind:value={newRule.end_minute}>
                      <option value={0}>00</option>
                      <option value={15}>15</option>
                      <option value={30}>30</option>
                      <option value={45}>45</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Price -->
              <div class="form-control">
                <label class="label" for="price">
                  <span class="label-text font-semibold">Price ({club.currency_symbol})</span>
                </label>
                <div class="input-group">
                  <span>{club.currency_symbol}</span>
                  <input
                    id="price"
                    type="number"
                    placeholder="50.00"
                    step="0.01"
                    class="input input-bordered flex-1"
                    bind:value={newRule.price}
                    on:change={() => (newRule.price = parseFloat(newRule.price) * 100)}
                  />
                </div>
                <p class="text-xs text-base-content/60 mt-1">Enter in {club.currency} (e.g., 50.00)</p>
              </div>

              <!-- Season & Priority -->
              <div class="grid grid-cols-2 gap-4">
                <div class="form-control">
                  <span class="label-text text-sm block mb-2">Season</span>
                  <select class="select select-bordered select-sm" bind:value={newRule.season}>
                    {#each seasons as season}
                      <option value={season}>{season}</option>
                    {/each}
                  </select>
                </div>

                <div class="form-control">
                  <span class="label-text text-sm block mb-2">Priority</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    class="input input-bordered input-sm"
                    bind:value={newRule.priority}
                  />
                  <p class="text-xs text-base-content/60 mt-1">Higher = takes precedence</p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3 mt-6">
                <button type="submit" class="btn btn-primary flex-1">Create Rule</button>
                <button type="button" class="btn btn-ghost flex-1" on:click={resetForm}>Cancel</button>
              </div>
            </form>
          {/if}
        </div>
      </div>

      <!-- Info Box -->
      <div class="alert mt-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="font-bold">How Pricing Works</h3>
          <p class="text-sm">
            Rules are matched by day of week, time range, and season. If multiple rules match, the one with highest
            priority is used.
          </p>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="min-h-screen flex items-center justify-center bg-base-100">
    <div class="card bg-base-200 shadow-xl">
      <div class="card-body text-center">
        <h1 class="card-title">Not Logged In</h1>
        <p>Please log in to manage pricing rules.</p>
        <a href="/club-login" class="btn btn-primary mt-4">Go to Login</a>
      </div>
    </div>
  </div>
{/if}
