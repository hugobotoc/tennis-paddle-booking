<script>
	import { page } from '$app/stores';
	import { getCourtById } from '$lib/data/courts';

	let court = undefined;

	// Load court data
	$: {
		const id = $page.params.id;
		court = getCourtById(id);
	}

	// Booking state
	let selectedDate = new Date().toISOString().split('T')[0];
	let startTime = '09:00';
	let endTime = '10:00';

	// Handle booking
	function handleBookNow() {
		if (!court) return;
		const params = new URLSearchParams({
			court_id: court.id,
			booking_date: selectedDate,
			start_time: startTime,
			end_time: endTime
		});
		window.location.href = `/checkout?${params.toString()}`;
	}

	// Format date to readable format
	function formatDate(dateStr) {
		const date = new Date(dateStr + 'T00:00:00');
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	// Calculate booking hours
	$: {
		const [startHour] = startTime.split(':').map(Number);
		const [endHour] = endTime.split(':').map(Number);
		bookingHours = Math.max(1, endHour - startHour);
	}

	let bookingHours = 1;
</script>

{#if court}
	<div class="min-h-screen bg-base-100">
		<!-- Breadcrumb -->
		<div class="breadcrumbs px-4 py-4 bg-base-200">
			<ul>
				<li><a href="/" class="link link-primary">Home</a></li>
				<li><a href="/courts" class="link link-primary">Courts</a></li>
				<li class="font-semibold">{court.name}</li>
			</ul>
		</div>

		<div class="container mx-auto px-4 py-8">
			<!-- Main Grid: Image + Details -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
				<!-- Left Column: Image Gallery -->
				<div class="lg:col-span-2">
					<div class="card bg-base-100 shadow-lg overflow-hidden">
						<!-- Main Image -->
						<figure class="relative bg-base-300 h-96">
							<img
								src={court.image_url}
								alt="{court.name} - {court.surface}"
								class="w-full h-full object-cover"
							/>
							<!-- Type Badge -->
							<div class="absolute top-4 right-4">
								<span class="badge badge-lg badge-primary font-semibold capitalize">
									{court.type}
								</span>
							</div>
						</figure>

						<!-- Court Header -->
						<div class="card-body bg-base-100 border-b border-base-300">
							<h1 class="text-4xl font-bold">{court.name}</h1>
							<p class="text-lg text-base-content/70">
								{court.location}
							</p>
							<p class="text-base-content/60 mt-2">{court.description}</p>
						</div>

						<!-- Details -->
						<div class="card-body">
							<h2 class="card-title text-2xl mb-4">Court Details</h2>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div class="bg-base-200 p-4 rounded-lg">
									<p class="text-sm text-base-content/70 font-semibold">Surface Type</p>
									<p class="text-lg font-bold">{court.surface}</p>
								</div>
								<div class="bg-base-200 p-4 rounded-lg">
									<p class="text-sm text-base-content/70 font-semibold">Available Slots</p>
									<p class="text-lg font-bold">{court.total_slots}</p>
								</div>
								<div class="bg-base-200 p-4 rounded-lg">
									<p class="text-sm text-base-content/70 font-semibold">Court Type</p>
									<p class="text-lg font-bold capitalize">{court.type}</p>
								</div>
								<div class="bg-base-200 p-4 rounded-lg">
									<p class="text-sm text-base-content/70 font-semibold">Hourly Rate</p>
									<p class="text-lg font-bold">${court.hourly_rate}/hr</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Right Column: Booking Card -->
				<div class="lg:col-span-1">
					<div class="card bg-base-100 shadow-lg sticky top-8">
						<div class="card-body">
							<!-- Price -->
							<div class="mb-6">
								<p class="text-sm text-base-content/70 font-semibold mb-1">Price per Hour</p>
								<p class="text-4xl font-bold text-primary">${court.hourly_rate}</p>
							</div>

							<!-- Availability Status -->
							<div class="mb-6">
								{#if court.available_now}
									<div class="badge badge-success badge-lg gap-2 w-full justify-center py-3">
										<span class="inline-block w-2 h-2 bg-white rounded-full"></span>
										Available Now
									</div>
								{:else}
									<div class="badge badge-error badge-lg gap-2 w-full justify-center py-3">
										<span class="inline-block w-2 h-2 bg-white rounded-full"></span>
										Currently Unavailable
									</div>
								{/if}
							</div>

							<!-- Divider -->
							<div class="divider my-2"></div>

							<!-- Date Picker -->
							<div class="form-control mb-4">
								<label class="label" for="bookingDate">
									<span class="label-text font-semibold">Booking Date</span>
								</label>
								<input
									id="bookingDate"
									type="date"
									class="input input-bordered"
									bind:value={selectedDate}
									aria-label="Select booking date"
								/>
								<p class="text-xs text-base-content/60 mt-1">{formatDate(selectedDate)}</p>
							</div>

							<!-- Start Time -->
							<div class="form-control mb-4">
								<label class="label" for="startTime">
									<span class="label-text font-semibold">Start Time</span>
								</label>
								<input
									id="startTime"
									type="time"
									class="input input-bordered"
									bind:value={startTime}
									aria-label="Select start time"
								/>
							</div>

							<!-- End Time -->
							<div class="form-control mb-6">
								<label class="label" for="endTime">
									<span class="label-text font-semibold">End Time</span>
								</label>
								<input
									id="endTime"
									type="time"
									class="input input-bordered"
									bind:value={endTime}
									aria-label="Select end time"
								/>
							</div>

							<!-- Cost Summary -->
							<div class="bg-base-200 p-4 rounded-lg mb-6">
								<div class="flex justify-between mb-2">
									<span class="text-base-content/70">Duration:</span>
									<span class="font-semibold">{bookingHours} hour{bookingHours !== 1 ? 's' : ''}</span>
								</div>
								<div class="flex justify-between mb-2">
									<span class="text-base-content/70">Rate:</span>
									<span class="font-semibold">${court.hourly_rate}/hr</span>
								</div>
								<div class="divider my-2"></div>
								<div class="flex justify-between text-lg">
									<span class="font-bold">Total Cost:</span>
									<span class="font-bold text-primary">${(court.hourly_rate * bookingHours).toFixed(2)}</span>
								</div>
							</div>

							<!-- Book Now Button -->
							<button
								class="btn btn-primary btn-lg w-full mb-3"
								on:click={handleBookNow}
								disabled={!court.available_now}
								aria-label="Book {court.name} now"
							>
								Book Now
							</button>

							<!-- Share Button -->
							<button
								class="btn btn-ghost btn-lg w-full"
								on:click={() => {
									const url = window.location.href;
									const text = `Check out this court: ${court.name}`;
									if (navigator.share) {
										navigator.share({ title: court.name, text, url });
									} else {
										navigator.clipboard.writeText(url);
										alert('Link copied to clipboard!');
									}
								}}
								aria-label="Share this court"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-5 h-5"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
									/>
								</svg>
								Share
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<!-- 404: Court not found -->
	<div class="min-h-screen flex items-center justify-center bg-base-100">
		<div class="text-center">
			<h1 class="text-5xl font-bold mb-4">Court Not Found</h1>
			<p class="text-lg text-base-content/70 mb-8">The court you're looking for doesn't exist.</p>
			<a href="/courts" class="btn btn-primary">Back to Courts</a>
		</div>
	</div>
{/if}
