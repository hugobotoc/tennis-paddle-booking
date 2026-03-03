<script>
	import { page } from '$app/stores';
	import { getPaddleById } from '$lib/data/paddles';

	let paddle = undefined;
	let startDate = '';
	let endDate = '';

	// Load paddle and date from query params
	$: {
		const paddleId = $page.url.searchParams.get('paddle_id');
		startDate = $page.url.searchParams.get('start_date') || '';
		endDate = $page.url.searchParams.get('end_date') || '';

		if (paddleId) {
			paddle = getPaddleById(paddleId);
		}
	}

	// Calculate duration
	$: {
		if (startDate && endDate) {
			const start = new Date(startDate).getTime();
			const end = new Date(endDate).getTime();
			totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
			if (totalDays < 1) totalDays = 1;
		}
	}

	let totalDays = 1;

	// Form state
	let step = 1;
	let deliveryAddress = '';
	let city = '';
	let zipCode = '';
	let phone = '';
	let paymentMethod = 'credit-card';

	function handleContinue() {
		if (step === 1 && deliveryAddress && city && zipCode && phone) {
			step = 2;
		}
	}

	function handleConfirm() {
		if (paymentMethod) {
			// Simulate booking confirmation
			alert(`Booking confirmed! Confirmation email sent.`);
			window.location.href = '/dashboard';
		}
	}
</script>

{#if paddle}
	<div class="min-h-screen bg-base-100">
		<!-- Header -->
		<div class="bg-primary text-primary-content py-8">
			<div class="container mx-auto px-4">
				<h1 class="text-4xl font-bold mb-2">Complete Your Booking</h1>
				<p class="text-lg opacity-90">Step {step} of 2</p>
			</div>
		</div>

		<div class="container mx-auto px-4 py-8">
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Left: Form -->
				<div class="lg:col-span-2">
					<!-- Step 1: Delivery Address -->
					{#if step === 1}
						<div class="card bg-base-100 shadow-lg">
							<div class="card-body">
								<h2 class="card-title text-2xl mb-6">Delivery Address</h2>

								<div class="form-control mb-4">
									<label class="label" for="address">
										<span class="label-text font-semibold">Street Address</span>
									</label>
									<input
										id="address"
										type="text"
										placeholder="Enter your street address"
										class="input input-bordered"
										bind:value={deliveryAddress}
										aria-label="Enter delivery street address"
									/>
								</div>

								<div class="grid grid-cols-2 gap-4 mb-4">
									<div class="form-control">
										<label class="label" for="city">
											<span class="label-text font-semibold">City</span>
										</label>
										<input
											id="city"
											type="text"
											placeholder="City"
											class="input input-bordered"
											bind:value={city}
											aria-label="Enter city name"
										/>
									</div>
									<div class="form-control">
										<label class="label" for="zip">
											<span class="label-text font-semibold">ZIP Code</span>
										</label>
										<input
											id="zip"
											type="text"
											placeholder="ZIP Code"
											class="input input-bordered"
											bind:value={zipCode}
											aria-label="Enter ZIP code"
										/>
									</div>
								</div>

								<div class="form-control mb-6">
									<label class="label" for="phone">
										<span class="label-text font-semibold">Phone Number</span>
									</label>
									<input
										id="phone"
										type="tel"
										placeholder="Your phone number"
										class="input input-bordered"
										bind:value={phone}
										aria-label="Enter phone number"
									/>
								</div>

								<div class="flex gap-4">
									<a href={`/paddles/${paddle.id}`} class="btn btn-ghost flex-1">
										Back
									</a>
									<button
										class="btn btn-primary flex-1"
										on:click={handleContinue}
										disabled={!deliveryAddress || !city || !zipCode || !phone}
										aria-label="Continue to payment method selection"
									>
										Continue
									</button>
								</div>
							</div>
						</div>
					{/if}

					<!-- Step 2: Payment Method -->
					{#if step === 2}
						<div class="card bg-base-100 shadow-lg">
							<div class="card-body">
								<h2 class="card-title text-2xl mb-6">Payment Method</h2>

								<div class="space-y-4 mb-6">
									<!-- Credit Card Option -->
									<label class="card cursor-pointer border-2 hover:border-primary" class:border-primary={paymentMethod === 'credit-card'}>
										<div class="card-body">
											<div class="flex items-center gap-3">
												<input
													type="radio"
													name="payment"
													value="credit-card"
													bind:group={paymentMethod}
													class="radio radio-primary"
													aria-label="Pay with credit card"
												/>
												<div>
													<p class="font-bold">Credit Card</p>
													<p class="text-sm text-base-content/70">Visa, Mastercard, American Express</p>
												</div>
											</div>
										</div>
									</label>

									<!-- Debit Card Option -->
									<label class="card cursor-pointer border-2 hover:border-primary" class:border-primary={paymentMethod === 'debit-card'}>
										<div class="card-body">
											<div class="flex items-center gap-3">
												<input
													type="radio"
													name="payment"
													value="debit-card"
													bind:group={paymentMethod}
													class="radio radio-primary"
													aria-label="Pay with debit card"
												/>
												<div>
													<p class="font-bold">Debit Card</p>
													<p class="text-sm text-base-content/70">Your bank account</p>
												</div>
											</div>
										</div>
									</label>

									<!-- PayPal Option -->
									<label class="card cursor-pointer border-2 hover:border-primary" class:border-primary={paymentMethod === 'paypal'}>
										<div class="card-body">
											<div class="flex items-center gap-3">
												<input
													type="radio"
													name="payment"
													value="paypal"
													bind:group={paymentMethod}
													class="radio radio-primary"
													aria-label="Pay with PayPal"
												/>
												<div>
													<p class="font-bold">PayPal</p>
													<p class="text-sm text-base-content/70">Fast and secure</p>
												</div>
											</div>
										</div>
									</label>
								</div>

								<div class="alert alert-info mb-6">
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
									<span>This is a demo. Payment processing is not enabled. Your booking will be confirmed.</span>
								</div>

								<div class="flex gap-4">
									<button
										class="btn btn-ghost flex-1"
										on:click={() => (step = 1)}
										aria-label="Go back to delivery address"
									>
										Back
									</button>
									<button
										class="btn btn-primary flex-1"
										on:click={handleConfirm}
										aria-label="Confirm and complete booking"
									>
										Confirm Booking
									</button>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- Right: Order Summary -->
				<div class="lg:col-span-1">
					<div class="card bg-base-100 shadow-lg sticky top-8">
						<div class="card-body">
							<h3 class="card-title text-xl mb-4">Order Summary</h3>

							<!-- Paddle Info -->
							<div class="mb-4">
								<p class="text-sm text-base-content/70 font-semibold mb-2">Paddle</p>
								<p class="font-bold text-lg">{paddle.name}</p>
								<p class="text-sm text-base-content/70">{paddle.brand} {paddle.model}</p>
							</div>

							<div class="divider my-2"></div>

							<!-- Dates -->
							<div class="mb-4">
								<p class="text-sm text-base-content/70 font-semibold mb-2">Rental Period</p>
								<p class="font-bold">{startDate} to {endDate}</p>
								<p class="text-sm text-base-content/70">Duration: {totalDays} day{totalDays !== 1 ? 's' : ''}</p>
							</div>

							<div class="divider my-2"></div>

							<!-- Delivery Address -->
							{#if step === 2}
								<div class="mb-4">
									<p class="text-sm text-base-content/70 font-semibold mb-2">Delivery To</p>
									<p class="text-sm font-mono bg-base-200 p-2 rounded">
										{deliveryAddress}<br />
										{city}, {zipCode}
									</p>
								</div>
								<div class="divider my-2"></div>
							{/if}

							<!-- Pricing -->
							<div class="mb-4">
								<div class="flex justify-between mb-2">
									<span class="text-base-content/70">Rate:</span>
									<span class="font-semibold">${paddle.price_per_hour}/hr</span>
								</div>
								<div class="flex justify-between mb-2">
									<span class="text-base-content/70">Duration:</span>
									<span class="font-semibold">{totalDays} day{totalDays !== 1 ? 's' : ''}</span>
								</div>
								<div class="flex justify-between mb-2">
									<span class="text-base-content/70">Hours:</span>
									<span class="font-semibold">{totalDays * 24}</span>
								</div>

								<div class="divider my-2"></div>

								<div class="flex justify-between text-lg">
									<span class="font-bold">Total:</span>
									<span class="font-bold text-primary text-2xl">
										${(paddle.price_per_hour * 24 * totalDays).toFixed(2)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<!-- 404: Paddle not found -->
	<div class="min-h-screen flex items-center justify-center bg-base-100">
		<div class="text-center">
			<h1 class="text-5xl font-bold mb-4">Invalid Booking</h1>
			<p class="text-lg text-base-content/70 mb-8">The paddle or booking information is invalid.</p>
			<a href="/paddles" class="btn btn-primary">Browse Paddles</a>
		</div>
	</div>
{/if}
