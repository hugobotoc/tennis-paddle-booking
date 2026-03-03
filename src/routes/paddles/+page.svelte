<script>
	import { MOCK_COURTS } from '$lib/data/courts';

	let filteredCourts = MOCK_COURTS;

	let searchTerm = '';
	let selectedType = 'all';
	let maxPrice = 35;

	// Get unique court types
	const courtTypes = Array.from(new Set(MOCK_COURTS.map(c => c.type))).sort();

	function filterCourts() {
		filteredCourts = MOCK_COURTS.filter(court => {
			const matchesSearch =
				searchTerm === '' ||
				court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				court.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
				court.surface.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesType = selectedType === 'all' || court.type === selectedType;
			const matchesPrice = court.hourly_rate <= maxPrice;

			return matchesSearch && matchesType && matchesPrice;
		});
	}

	function handleSearch(e) {
		searchTerm = e.target.value;
		filterCourts();
	}

	function handleTypeChange(e) {
		selectedType = e.target.value;
		filterCourts();
	}

	function handlePriceChange(e) {
		maxPrice = parseInt(e.target.value);
		filterCourts();
	}

	function resetFilters() {
		searchTerm = '';
		selectedType = 'all';
		maxPrice = 35;
		filterCourts();
	}
</script>

<div class="min-h-screen bg-base-100">
	<!-- Header -->
	<div class="bg-primary text-primary-content py-8">
		<div class="container mx-auto px-4">
			<h1 class="text-4xl font-bold mb-2">Available Courts</h1>
			<p class="text-lg opacity-90">Find and book the perfect court for your next game</p>
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
							placeholder="Name, location, or surface..."
							class="input input-bordered"
							value={searchTerm}
							on:input={handleSearch}
							aria-label="Search courts by name, location, or surface"
						/>
					</div>

					<!-- Type Filter -->
					<div class="form-control">
						<label class="label" for="type">
							<span class="label-text font-semibold">Court Type</span>
						</label>
						<select
							id="type"
							class="select select-bordered"
							value={selectedType}
							on:change={handleTypeChange}
							aria-label="Filter by court type"
						>
							<option value="all">All Types</option>
							{#each courtTypes as type}
								<option value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
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
								min="10"
								max="35"
								step="1"
								class="range range-primary flex-1"
								value={maxPrice}
								on:change={handlePriceChange}
								aria-label="Filter by maximum hourly rate"
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
			Showing {filteredCourts.length} of {MOCK_COURTS.length} courts
		</p>

		<!-- Court Grid -->
		{#if filteredCourts.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each filteredCourts as court (court.id)}
					<div class="card bg-base-100 shadow-lg hover:shadow-2xl transition-shadow">
						<!-- Image Container -->
						<figure class="relative h-48 overflow-hidden bg-base-300">
							<img
								src={court.image_url}
								alt="{court.name} - {court.surface}"
								class="w-full h-full object-cover hover:scale-105 transition-transform"
							/>
							<!-- Type Badge -->
							<div class="absolute top-2 right-2">
								<span class="badge badge-primary font-semibold capitalize">
									{court.type}
								</span>
							</div>
							<!-- Availability Badge -->
							<div class="absolute bottom-2 left-2">
								{#if court.available_now}
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
							<!-- Name -->
							<h2 class="card-title text-xl">{court.name}</h2>
							<p class="text-sm text-base-content/70">
								{court.location}
							</p>
							<p class="text-sm text-base-content/60">
								Surface: {court.surface}
							</p>

							<!-- Slots Info -->
							<div class="text-sm text-base-content/60 mb-2">
								{court.total_slots} available slots
							</div>

							<!-- Price -->
							<div class="text-2xl font-bold text-primary mb-4">${court.hourly_rate}/hr</div>

							<!-- Description -->
							<p class="text-sm mb-4 line-clamp-2">{court.description}</p>

							<!-- View Details Button -->
							<div class="card-actions justify-end">
								<a
									href={`/courts/${court.id}`}
									class="btn btn-primary"
									aria-label="View details and book {court.name}"
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
				<span>No courts match your filters. Try adjusting your search.</span>
			</div>
		{/if}
	</div>
</div>
