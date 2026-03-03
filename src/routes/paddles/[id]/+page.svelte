<script>
	import { page } from '$app/stores';
	import { getPaddleById, getRelatedPaddles } from '$lib/data/paddles';
	import { getReviewsForPaddle, getAverageRating, getReviewCount, canReviewBooking, formatReviewDate } from '$lib/data/reviews';
	import { CURRENT_USER, getPastBookings } from '$lib/data/user';
	import ReviewModal from '$lib/components/ReviewModal.svelte';

	let paddle = undefined;
	let reviews = [];
	let relatedPaddles = [];
	let averageRating = 0;
	let reviewCount = 0;

	let showReviewModal = false;
	let reviewableBooking = null;

	// Load paddle data
	$: {
		const id = $page.params.id;
		paddle = getPaddleById(id);
		if (paddle) {
			reviews = getReviewsForPaddle(id);
			averageRating = getAverageRating(id);
			reviewCount = getReviewCount(id);
			relatedPaddles = getRelatedPaddles(id, 4);

			// Check if current user has a reviewable booking for this paddle
			const pastBookings = getPastBookings(CURRENT_USER.id);
			reviewableBooking = pastBookings.find(
				b => b.paddle_id === id && canReviewBooking(b, CURRENT_USER.id)
			);
		}
	}

	// Date picker state
	let selectedDate = new Date().toISOString().split('T')[0];
	let endDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

	// Handle booking
	function handleBookNow() {
		if (!paddle) return;
		const params = new URLSearchParams({
			paddle_id: paddle.id,
			start_date: selectedDate,
			end_date: endDate
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

	// Calculate days and total cost
	$: {
		const start = new Date(selectedDate).getTime();
		const end = new Date(endDate).getTime();
		const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
		totalDays = days > 0 ? days : 1;
	}

	let totalDays = 1;

	// Handle review submission
	function handleReviewSubmit(_event) {
		// Reviews are already added to MOCK_REVIEWS in the modal
		// Just reload the reviews display
		if (paddle) {
			reviews = getReviewsForPaddle(paddle.id);
			averageRating = getAverageRating(paddle.id);
			reviewCount = getReviewCount(paddle.id);

			// Check if still reviewable (shouldn't be after submission)
			const pastBookings = getPastBookings(CURRENT_USER.id);
			reviewableBooking = pastBookings.find(
				b => b.paddle_id === paddle.id && canReviewBooking(b, CURRENT_USER.id)
			);
		}
		showReviewModal = false;
	}

	function openReviewModal() {
		showReviewModal = true;
	}
</script>

{#if paddle}
	<div class="min-h-screen bg-base-100">
		<!-- Breadcrumb -->
		<div class="breadcrumbs px-4 py-4 bg-base-200">
			<ul>
				<li><a href="/" class="link link-primary">Home</a></li>
				<li><a href="/paddles" class="link link-primary">Paddles</a></li>
				<li class="font-semibold">{paddle.name}</li>
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
								src={paddle.image_url}
								alt="{paddle.name} - {paddle.brand} {paddle.model}"
								class="w-full h-full object-cover"
							/>
							<!-- Condition Badge -->
							<div class="absolute top-4 right-4">
								<span
									class={`badge badge-lg font-semibold capitalize ${
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
						</figure>

						<!-- Paddle Header -->
						<div class="card-body bg-base-100 border-b border-base-300">
							<h1 class="text-4xl font-bold">{paddle.name}</h1>
							<p class="text-lg text-base-content/70">
								{paddle.brand} · {paddle.model}
							</p>
							<p class="text-base-content/60 mt-2">{paddle.description}</p>
						</div>

						<!-- Specifications -->
						<div class="card-body">
							<h2 class="card-title text-2xl mb-4">Specifications</h2>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div class="bg-base-200 p-4 rounded-lg">
									<p class="text-sm text-base-content/70 font-semibold">Weight</p>
									<p class="text-lg font-bold">{paddle.weight}</p>
								</div>
								<div class="bg-base-200 p-4 rounded-lg">
									<p class="text-sm text-base-content/70 font-semibold">Grip Type</p>
									<p class="text-lg font-bold">{paddle.grip_type}</p>
								</div>
								<div class="bg-base-200 p-4 rounded-lg">
									<p class="text-sm text-base-content/70 font-semibold">Material</p>
									<p class="text-lg font-bold">{paddle.material}</p>
								</div>
								<div class="bg-base-200 p-4 rounded-lg">
									<p class="text-sm text-base-content/70 font-semibold">Frame Thickness</p>
									<p class="text-lg font-bold">{paddle.frame_thickness}</p>
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
								<p class="text-4xl font-bold text-primary">${paddle.price_per_hour}</p>
							</div>

							<!-- Availability Status -->
							<div class="mb-6">
								{#if paddle.available_now}
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
								<label class="label" for="startDate">
									<span class="label-text font-semibold">Start Date</span>
								</label>
								<input
									id="startDate"
									type="date"
									class="input input-bordered"
									bind:value={selectedDate}
									aria-label="Select paddle rental start date"
								/>
								<p class="text-xs text-base-content/60 mt-1">{formatDate(selectedDate)}</p>
							</div>

							<div class="form-control mb-6">
								<label class="label" for="endDate">
									<span class="label-text font-semibold">End Date</span>
								</label>
								<input
									id="endDate"
									type="date"
									class="input input-bordered"
									bind:value={endDate}
									aria-label="Select paddle rental end date"
								/>
								<p class="text-xs text-base-content/60 mt-1">{formatDate(endDate)}</p>
							</div>

							<!-- Cost Summary -->
							<div class="bg-base-200 p-4 rounded-lg mb-6">
								<div class="flex justify-between mb-2">
									<span class="text-base-content/70">Duration:</span>
									<span class="font-semibold">{totalDays} day{totalDays !== 1 ? 's' : ''}</span>
								</div>
								<div class="flex justify-between mb-2">
									<span class="text-base-content/70">Rate:</span>
									<span class="font-semibold">${paddle.price_per_hour}/hr</span>
								</div>
								<div class="divider my-2"></div>
								<div class="flex justify-between text-lg">
									<span class="font-bold">Total Cost:</span>
									<span class="font-bold text-primary">${(paddle.price_per_hour * 24 * totalDays).toFixed(2)}</span>
								</div>
							</div>

							<!-- Book Now Button -->
							<button
								class="btn btn-primary btn-lg w-full mb-3"
								on:click={handleBookNow}
								disabled={!paddle.available_now}
								aria-label="Book {paddle.name} now"
							>
								Book Now
							</button>

							<!-- Share Button -->
							<button
								class="btn btn-ghost btn-lg w-full"
								on:click={() => {
									const url = window.location.href;
									const text = `Check out this paddle: ${paddle.name}`;
									if (navigator.share) {
										navigator.share({ title: paddle.name, text, url });
									} else {
										navigator.clipboard.writeText(url);
										alert('Link copied to clipboard!');
									}
								}}
								aria-label="Share this paddle"
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

			<!-- Reviews Section -->
			<div class="card bg-base-100 shadow-lg mb-12">
				<div class="card-body">
					<div class="flex items-center justify-between mb-6">
						<h2 class="card-title text-2xl">Reviews & Ratings</h2>
						{#if reviewableBooking}
							<button
								class="btn btn-primary btn-sm"
								on:click={openReviewModal}
								aria-label="Leave a review for this paddle"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-4 h-4"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M12 4.5v15m7.5-7.5h-15"
									/>
								</svg>
								Leave Review
							</button>
						{/if}
					</div>

					<!-- Overall Rating Section -->
					{#if reviewCount > 0}
						<div class="bg-base-200 p-6 rounded-lg mb-8">
							<div class="flex items-center gap-6">
								<div>
									<p class="text-5xl font-bold text-primary">{averageRating}</p>
									<p class="text-sm text-base-content/70">out of 5 stars</p>
								</div>
								<div class="flex-1">
									<div class="flex gap-1 mb-2" aria-label="{averageRating} out of 5 stars rating">
										{#each Array(5) as _, i}
											<span
												class={`text-3xl ${
													i < Math.floor(averageRating)
														? 'text-warning'
														: i < Math.ceil(averageRating)
															? 'text-warning/50'
															: 'text-base-300'
												}`}
											>
												★
											</span>
										{/each}
									</div>
									<p class="text-sm text-base-content/70">
										Based on {reviewCount} review{reviewCount !== 1 ? 's' : ''}
									</p>
								</div>
							</div>
						</div>
					{/if}

					<!-- Individual Reviews List -->
					<div class="space-y-4">
						{#each reviews as review (review.id)}
							<div class="border-l-4 border-primary pl-4 py-3">
								<!-- Review Header -->
								<div class="flex items-start justify-between mb-2">
									<div>
										<p class="font-bold text-lg">{review.reviewer_name}</p>
										<p class="text-xs text-base-content/60">
											{formatReviewDate(new Date(review.created_at))}
										</p>
									</div>
									<div class="flex gap-0.5" aria-label="{review.rating} out of 5 stars">
										{#each Array(5) as _, i}
											<span class={`text-lg ${i < review.rating ? 'text-warning' : 'text-base-300'}`}>
												★
											</span>
										{/each}
									</div>
								</div>
								<!-- Review Rating Text -->
								<p class="text-xs text-base-content/60 mb-2">
									{review.rating} out of 5 star{review.rating !== 1 ? 's' : ''}
								</p>
								<!-- Review Comment -->
								<p class="text-base-content/80 leading-relaxed">{review.comment}</p>
							</div>
						{/each}
					</div>

					{#if reviewCount === 0}
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
							<span>No reviews yet. Be the first to review this paddle!</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Related Paddles Section -->
			<div class="mb-12">
				<h2 class="text-3xl font-bold mb-6">Related Paddles</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{#each relatedPaddles as relPaddle (relPaddle.id)}
						<div class="card bg-base-100 shadow-lg hover:shadow-2xl transition-shadow">
							<figure class="relative h-40 overflow-hidden bg-base-300">
								<img
									src={relPaddle.image_url}
									alt="{relPaddle.name} - {relPaddle.brand} {relPaddle.model}"
									class="w-full h-full object-cover hover:scale-105 transition-transform"
								/>
								<div class="absolute top-2 right-2">
									<span
										class={`badge font-semibold capitalize ${
											relPaddle.condition === 'excellent'
												? 'badge-success'
												: relPaddle.condition === 'good'
													? 'badge-info'
													: 'badge-warning'
										}`}
									>
										{relPaddle.condition}
									</span>
								</div>
							</figure>
							<div class="card-body">
								<h3 class="card-title text-lg">{relPaddle.name}</h3>
								<p class="text-sm text-base-content/70">{relPaddle.brand}</p>
								<div class="flex items-center gap-2 mb-2">
									<div class="flex gap-0.5">
										{#each Array(5) as _, i}
											<span class={i < Math.floor(relPaddle.avg_rating) ? 'text-warning text-sm' : 'text-base-300 text-sm'}>
												★
											</span>
										{/each}
									</div>
									<span class="text-sm font-semibold">{relPaddle.avg_rating}</span>
								</div>
								<div class="text-xl font-bold text-primary mb-2">${relPaddle.price_per_hour}/hr</div>
								<a href={`/paddles/${relPaddle.id}`} class="btn btn-sm btn-primary w-full">
									View Details
								</a>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{:else}
	<!-- 404: Paddle not found -->
	<div class="min-h-screen flex items-center justify-center bg-base-100">
		<div class="text-center">
			<h1 class="text-5xl font-bold mb-4">Paddle Not Found</h1>
			<p class="text-lg text-base-content/70 mb-8">The paddle you're looking for doesn't exist.</p>
			<a href="/paddles" class="btn btn-primary">Back to Paddles</a>
		</div>
	</div>
{/if}

<!-- Review Modal -->
{#if paddle}
	<ReviewModal
		isOpen={showReviewModal}
		bookingId={reviewableBooking?.id || ''}
		paddleId={paddle.id}
		reviewerId={CURRENT_USER.id}
		reviewerName={CURRENT_USER.name}
		paddleName={paddle.name}
		on:submit={handleReviewSubmit}
		on:close={() => (showReviewModal = false)}
	/>
{/if}
