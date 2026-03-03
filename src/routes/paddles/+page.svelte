<script>
	import { MOCK_PADDLES } from '$lib/data/paddles';

	let filteredPaddles = MOCK_PADDLES;

	let searchTerm = '';
	let selectedBrand = 'all';
	let maxPrice = 20;

	// Get unique brands for filter
	const brands = Array.from(new Set(MOCK_PADDLES.map(p => p.brand))).sort();

	function filterPaddles() {
		filteredPaddles = MOCK_PADDLES.filter(paddle => {
			const matchesSearch =
				searchTerm === '' ||
				paddle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
				paddle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
				paddle.name.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesBrand = selectedBrand === 'all' || paddle.brand === selectedBrand;
			const matchesPrice = paddle.price_per_hour <= maxPrice;

			return matchesSearch && matchesBrand && matchesPrice;
		});
	}

	function handleSearch(e) {
		searchTerm = e.target.value;
		filterPaddles();
	}

	function handleBrandChange(e) {
		selectedBrand = e.target.value;
		filterPaddles();
	}

	function handlePriceChange(e) {
		maxPrice = parseInt(e.target.value);
		filterPaddles();
	}

	function resetFilters() {
		searchTerm = '';
		selectedBrand = 'all';
		maxPrice = 20;
		filterPaddles();
	}
</script>

<div class="min-h-screen bg-base-100">
	<!-- Header -->
	<div class="bg-primary text-primary-content py-8">
		<div class="container mx-auto px-4">
			<h1 class="text-4xl font-bold mb-2">Available Paddles</h1>
			<p class="text-lg opacity-90">Find and rent the perfect paddle for your next game</p>
		</div>
	</div>

	<div class="container mx-auto px-4 py-8">
		<!-- Filters -->
		<div class="card bg-base-200 shadow-md mb-8">
			<div class="card-body">
				<h2 class="card-title mb-4">Filters</h2>
				<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
					<!-- Search -->
					<div class="form-control">
						<label class="label" for="search">
							<span class="label-text font-semibold">Search</span>
						</label>
						<input
							id="search"
							type="text"
							placeholder="Brand or model..."
							class="input input-bordered"
							value={searchTerm}
							on:input={handleSearch}
							aria-label="Search paddles by brand or model"
						/>
					</div>

					<!-- Brand Filter -->
					<div class="form-control">
						<label class="label" for="brand">
							<span class="label-text font-semibold">Brand</span>
						</label>
						<select
							id="brand"
							class="select select-bordered"
							value={selectedBrand}
							on:change={handleBrandChange}
							aria-label="Filter by paddle brand"
						>
							<option value="all">All Brands</option>
							{#each brands as brand}
								<option value={brand}>{brand}</option>
							{/each}
						</select>
					</div>

					<!-- Price Filter -->
					<div class="form-control">
						<label class="label" for="price">
							<span class="label-text font-semibold">Max Price per Hour</span>
						</label>
						<div class="flex items-center gap-2">
							<input
								id="price"
								type="range"
								min="5"
								max="20"
								step="1"
								class="range range-primary flex-1"
								value={maxPrice}
								on:change={handlePriceChange}
								aria-label="Filter by maximum price per hour"
							/>
							<span class="font-bold text-lg w-12">${maxPrice}</span>
						</div>
					</div>

					<!-- Reset Button -->
					<div class="form-control flex justify-end pt-7">
						<button
							class="btn btn-outline"
							on:click={resetFilters}
							aria-label="Reset all filters to default values"
						>
							Reset Filters
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Results Count -->
		<p class="text-lg font-semibold mb-6" aria-live="polite">
			Showing {filteredPaddles.length} of {MOCK_PADDLES.length} paddles
		</p>

		<!-- Paddle Grid -->
		{#if filteredPaddles.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each filteredPaddles as paddle (paddle.id)}
					<div class="card bg-base-100 shadow-lg hover:shadow-2xl transition-shadow">
						<!-- Image Container -->
						<figure class="relative h-48 overflow-hidden bg-base-300">
							<img
								src={paddle.image_url}
								alt="{paddle.name} - {paddle.brand} {paddle.model}"
								class="w-full h-full object-cover hover:scale-105 transition-transform"
							/>
							<!-- Condition Badge -->
							<div class="absolute top-2 right-2">
								<span
									class={`badge font-semibold capitalize ${
										paddle.condition === 'excellent'
											? 'badge-success'
											: paddle.condition === 'good'
												? 'badge-info'
												: 'badge-warning'
									}`}
								>
									{paddle.condition}
								</span>
							</div>
							<!-- Availability Badge -->
							<div class="absolute bottom-2 left-2">
								{#if paddle.available_now}
									<span class="badge badge-success gap-2">
										<span class="inline-block w-2 h-2 bg-white rounded-full"></span>
										Available Now
									</span>
								{:else}
									<span class="badge badge-error gap-2">
										<span class="inline-block w-2 h-2 bg-white rounded-full"></span>
										Unavailable
									</span>
								{/if}
							</div>
						</figure>

						<div class="card-body">
							<!-- Brand and Model -->
							<h2 class="card-title text-xl">{paddle.name}</h2>
							<p class="text-sm text-base-content/70">
								{paddle.brand} {paddle.model}
							</p>

							<!-- Rating -->
							<div class="flex items-center gap-2 mb-2">
								<div class="flex gap-0.5" aria-label="{paddle.avg_rating} out of 5 stars">
									{#each Array(5) as _, i}
										<span
											class={`text-lg ${
												i < Math.floor(paddle.avg_rating)
													? 'text-warning'
													: i < Math.ceil(paddle.avg_rating)
														? 'text-warning/50'
														: 'text-base-300'
											}`}
										>
											★
										</span>
									{/each}
								</div>
								<span class="text-sm font-semibold">{paddle.avg_rating}</span>
								<span class="text-xs text-base-content/50">({paddle.total_reviews})</span>
							</div>

							<!-- Price -->
							<div class="text-2xl font-bold text-primary mb-4">${paddle.price_per_hour}/hr</div>

							<!-- View Details Button -->
							<div class="card-actions justify-end">
								<a
									href={`/paddles/${paddle.id}`}
									class="btn btn-primary"
									aria-label="View details for {paddle.name}"
								>
									View Details
								</a>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="alert alert-info">
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
					></path>
				</svg>
				<span>No paddles match your filters. Try adjusting your search.</span>
			</div>
		{/if}
	</div>
</div>
