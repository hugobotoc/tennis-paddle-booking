<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getCourtById } from '$lib/data/courts';
	import { createMockBooking } from '$lib/data/bookings';
	import { checkoutStore, nextStep, previousStep, updateCheckoutState } from '$lib/stores/checkout';

	let court;
	let errorMessage = '';
	let isProcessing = false;

	// Load court and initialize checkout store
	$: {
		const courtId = $page.url.searchParams.get('court_id');
		const startDate = $page.url.searchParams.get('start_date') || '';
		const endDate = $page.url.searchParams.get('end_date') || '';

		if (!courtId) {
			goto('/courts');
		} else {
			court = getCourtById(courtId);
			if (!court) {
				goto('/courts');
			} else {
				// Initialize store with court_id and dates if provided
				updateCheckoutState({
					court_id: courtId,
					start_date: startDate,
					end_date: endDate
				});
			}
		}
	}

	// Calculate rental days and costs
	$: totalDays = calculateTotalDays($checkoutStore.start_date, $checkoutStore.end_date);
	$: subtotal = court ? court.price_per_hour * 24 * totalDays : 0;
	$: deliveryFee = 10;
	$: tax = subtotal * 0.1;
	$: totalCost = subtotal + deliveryFee + tax;

	function calculateTotalDays(startDate, endDate) {
		if (!startDate || !endDate) return 1;
		const start = new Date(startDate).getTime();
		const end = new Date(endDate).getTime();
		const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
		return Math.max(days, 1);
	}

	function validateStep1() {
		errorMessage = '';

		if (!$checkoutStore.start_date) {
			errorMessage = 'Please select a start date';
			return false;
		}

		if (!$checkoutStore.end_date) {
			errorMessage = 'Please select an end date';
			return false;
		}

		const start = new Date($checkoutStore.start_date).getTime();
		const end = new Date($checkoutStore.end_date).getTime();

		if (end <= start) {
			errorMessage = 'End date must be after start date';
			return false;
		}

		return true;
	}

	function validateStep2() {
		errorMessage = '';

		const fields = [
			{ value: $checkoutStore.full_name, name: 'Full name' },
			{ value: $checkoutStore.street_address, name: 'Street address' },
			{ value: $checkoutStore.city, name: 'City' },
			{ value: $checkoutStore.state, name: 'State/Province' },
			{ value: $checkoutStore.zip, name: 'ZIP/Postal code' },
			{ value: $checkoutStore.phone, name: 'Phone number' }
		];

		for (const field of fields) {
			if (!field.value || field.value.trim() === '') {
				errorMessage = `${field.name} is required`;
				return false;
			}
		}

		return true;
	}

	function handleStep1Next() {
		if (validateStep1()) {
			nextStep(1);
		}
	}

	function handleStep2Back() {
		previousStep(2);
	}

	function handleStep2Next() {
		if (validateStep2()) {
			nextStep(2);
		}
	}

	function handleStep3Back() {
		previousStep(3);
	}

	function handleStep3Confirm() {
		nextStep(3);
	}

	function handleStep4Back() {
		previousStep(4);
	}

	async function handlePlaceOrder() {
		if (!court) return;

		isProcessing = true;

		try {
			// Create booking with mock user ID (demo user)
			const booking = createMockBooking(
				$checkoutStore.court_id,
				'demo-user-123', // Mock user ID
				$checkoutStore.start_date,
				$checkoutStore.end_date,
				court.price_per_hour * 24, // Daily rate
				totalCost,
				{
					full_name: $checkoutStore.full_name,
					street_address: $checkoutStore.street_address,
					city: $checkoutStore.city,
					state: $checkoutStore.state,
					zip: $checkoutStore.zip,
					phone: $checkoutStore.phone
				}
			);

			// Redirect to confirmation page
			goto(`/order-confirmation/${booking.id}`);
		} catch (error) {
			console.error('Booking error:', error);
			errorMessage = 'Failed to create booking. Please try again.';
			isProcessing = false;
		}
	}

	function selectPaymentMethod(method) {
		updateCheckoutState({ payment_method: method });
	}
</script>

{#if court}
	<div class="min-h-screen bg-base-100">
		<!-- Header -->
		<div class="bg-primary text-primary-content py-8">
			<div class="container mx-auto px-4">
				<h1 class="text-4xl font-bold mb-2">Complete Your Booking</h1>
				<p class="text-lg opacity-90" role="status" aria-live="polite">
					Step {$checkoutStore.step} of 4
				</p>
			</div>
		</div>

		<!-- Step Indicator -->
		<div class="bg-base-200 py-4">
			<div class="container mx-auto px-4">
				<div class="flex justify-between gap-4">
					{#each [1, 2, 3, 4] as step}
						<div class="flex-1">
							<div
								class="h-2 rounded-full"
								class:bg-primary={step <= $checkoutStore.step}
								class:bg-base-300={step > $checkoutStore.step}
								role="progressbar"
								aria-valuenow={step}
								aria-valuemin={1}
								aria-valuemax={4}
								aria-label={`Step ${step}`}
							></div>
							<p class="text-sm text-center mt-2 font-semibold">
								{step === 1 ? 'Dates' : step === 2 ? 'Address' : step === 3 ? 'Review' : 'Payment'}
							</p>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Error Message -->
		{#if errorMessage}
			<div class="container mx-auto px-4 py-4">
				<div class="alert alert-error" role="alert" aria-live="polite">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-current shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m2-2l2 2"
						/>
					</svg>
					<span>{errorMessage}</span>
				</div>
			</div>
		{/if}

		<div class="container mx-auto px-4 py-8">
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Left: Form -->
				<div class="lg:col-span-2">
					<!-- Step 1: Date Selection -->
					{#if $checkoutStore.step === 1}
						<div class="card bg-base-100 shadow-lg">
							<div class="card-body">
								<h2 class="card-title text-2xl mb-6">Select Your Rental Dates</h2>

								<div class="form-control mb-4">
									<label class="label" for="start-date">
										<span class="label-text font-semibold">Start Date</span>
									</label>
									<input
										id="start-date"
										type="date"
										class="input input-bordered"
										bind:value={$checkoutStore.start_date}
										aria-label="Select rental start date"
										aria-required="true"
									/>
									<p class="text-xs text-base-content/70 mt-1">Choose when you want to start renting</p>
								</div>

								<div class="form-control mb-6">
									<label class="label" for="end-date">
										<span class="label-text font-semibold">End Date</span>
									</label>
									<input
										id="end-date"
										type="date"
										class="input input-bordered"
										bind:value={$checkoutStore.end_date}
										aria-label="Select rental end date"
										aria-required="true"
									/>
									<p class="text-xs text-base-content/70 mt-1">Choose when you'll return the court</p>
								</div>

								{#if $checkoutStore.start_date && $checkoutStore.end_date}
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
										<div>
											<p class="font-semibold">Estimated Rental Duration</p>
											<p class="text-sm">{totalDays} day{totalDays !== 1 ? 's' : ''}</p>
											<p class="text-sm">Daily rate: ${court.price_per_hour}/hour (${court.price_per_hour *
												24}/day)</p>
											<p class="text-sm font-semibold">Estimated total: ${totalCost.toFixed(2)}</p>
										</div>
									</div>
								{/if}

								<div class="flex gap-4">
									<a href={`/courts/${court.id}`} class="btn btn-ghost flex-1">
										Back to Court
									</a>
									<button
										class="btn btn-primary flex-1"
										on:click={handleStep1Next}
										disabled={!$checkoutStore.start_date || !$checkoutStore.end_date}
										aria-label="Continue to delivery address"
									>
										Next: Delivery Address
									</button>
								</div>
							</div>
						</div>
					{/if}

					<!-- Step 2: Delivery Address -->
					{#if $checkoutStore.step === 2}
						<div class="card bg-base-100 shadow-lg">
							<div class="card-body">
								<h2 class="card-title text-2xl mb-6">Delivery Address</h2>

								<div class="form-control mb-4">
									<label class="label" for="full-name">
										<span class="label-text font-semibold">Full Name</span>
									</label>
									<input
										id="full-name"
										type="text"
										placeholder="John Doe"
										class="input input-bordered"
										bind:value={$checkoutStore.full_name}
										aria-label="Enter your full name"
										aria-required="true"
									/>
								</div>

								<div class="form-control mb-4">
									<label class="label" for="street-address">
										<span class="label-text font-semibold">Street Address</span>
									</label>
									<input
										id="street-address"
										type="text"
										placeholder="123 Main Street"
										class="input input-bordered"
										bind:value={$checkoutStore.street_address}
										aria-label="Enter your street address"
										aria-required="true"
									/>
								</div>

								<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
									<div class="form-control">
										<label class="label" for="city">
											<span class="label-text font-semibold">City</span>
										</label>
										<input
											id="city"
											type="text"
											placeholder="New York"
											class="input input-bordered"
											bind:value={$checkoutStore.city}
											aria-label="Enter your city"
											aria-required="true"
										/>
									</div>

									<div class="form-control">
										<label class="label" for="state">
											<span class="label-text font-semibold">State/Province</span>
										</label>
										<input
											id="state"
											type="text"
											placeholder="NY"
											class="input input-bordered"
											bind:value={$checkoutStore.state}
											aria-label="Enter your state or province"
											aria-required="true"
										/>
									</div>
								</div>

								<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
									<div class="form-control">
										<label class="label" for="zip">
											<span class="label-text font-semibold">ZIP/Postal Code</span>
										</label>
										<input
											id="zip"
											type="text"
											placeholder="10001"
											class="input input-bordered"
											bind:value={$checkoutStore.zip}
											aria-label="Enter your ZIP or postal code"
											aria-required="true"
										/>
									</div>

									<div class="form-control">
										<label class="label" for="phone">
											<span class="label-text font-semibold">Phone Number</span>
										</label>
										<input
											id="phone"
											type="tel"
											placeholder="+1 (555) 000-0000"
											class="input input-bordered"
											bind:value={$checkoutStore.phone}
											aria-label="Enter your phone number"
											aria-required="true"
										/>
									</div>
								</div>

								<div class="flex gap-4">
									<button
										class="btn btn-ghost flex-1"
										on:click={handleStep2Back}
										aria-label="Go back to date selection"
									>
										Back
									</button>
									<button
										class="btn btn-primary flex-1"
										on:click={handleStep2Next}
										aria-label="Continue to order review"
									>
										Next: Review Order
									</button>
								</div>
							</div>
						</div>
					{/if}

					<!-- Step 3: Order Summary & Review -->
					{#if $checkoutStore.step === 3}
						<div class="card bg-base-100 shadow-lg">
							<div class="card-body">
								<h2 class="card-title text-2xl mb-6">Review Your Order</h2>

								<!-- Court Info -->
								<div class="mb-6 p-4 bg-base-200 rounded-lg">
									<div class="flex gap-4">
										<img
											src={court.image_url}
											alt={court.name}
											class="w-24 h-24 object-cover rounded"
										/>
										<div class="flex-1">
											<p class="text-xs text-base-content/70 uppercase font-semibold mb-1">Court</p>
											<h3 class="text-xl font-bold">{court.name}</h3>
											<p class="text-sm text-base-content/70">{court.brand} {court.model}</p>
											{#if court.avg_rating}
												<p class="text-sm mt-2">
													⭐ {court.avg_rating.toFixed(1)} rating
												</p>
											{/if}
										</div>
									</div>
								</div>

								<div class="divider"></div>

								<!-- Rental Period -->
								<div class="mb-6">
									<p class="text-xs text-base-content/70 uppercase font-semibold mb-2">Rental Period</p>
									<div class="flex justify-between items-center">
										<div>
											<p class="text-sm font-semibold">From</p>
											<p class="text-lg font-bold">
												{new Date($checkoutStore.start_date + 'T00:00:00').toLocaleDateString('en-US', {
													weekday: 'short',
													month: 'short',
													day: 'numeric',
													year: 'numeric'
												})}
											</p>
										</div>
										<span class="text-2xl">→</span>
										<div>
											<p class="text-sm font-semibold">To</p>
											<p class="text-lg font-bold">
												{new Date($checkoutStore.end_date + 'T00:00:00').toLocaleDateString('en-US', {
													weekday: 'short',
													month: 'short',
													day: 'numeric',
													year: 'numeric'
												})}
											</p>
										</div>
									</div>
									<p class="text-sm text-base-content/70 mt-2">
										Duration: <span class="font-semibold">{totalDays} day{totalDays !== 1 ? 's' : ''}</span>
									</p>
								</div>

								<div class="divider"></div>

								<!-- Delivery Address -->
								<div class="mb-6">
									<p class="text-xs text-base-content/70 uppercase font-semibold mb-2">Delivery Address</p>
									<div class="p-3 bg-base-200 rounded text-sm">
										<p class="font-semibold">{$checkoutStore.full_name}</p>
										<p>{$checkoutStore.street_address}</p>
										<p>
											{$checkoutStore.city}, {$checkoutStore.state} {$checkoutStore.zip}
										</p>
										<p>Phone: {$checkoutStore.phone}</p>
									</div>
								</div>

								<div class="divider"></div>

								<!-- Pricing Breakdown -->
								<div class="mb-6">
									<p class="text-xs text-base-content/70 uppercase font-semibold mb-4">Pricing Breakdown</p>
									<div class="space-y-2">
										<div class="flex justify-between">
											<span>Daily rate</span>
											<span class="font-semibold">${(court.price_per_hour * 24).toFixed(2)}</span>
										</div>
										<div class="flex justify-between">
											<span>Number of days</span>
											<span class="font-semibold">{totalDays}</span>
										</div>
										<div class="flex justify-between">
											<span>Subtotal</span>
											<span class="font-semibold">${subtotal.toFixed(2)}</span>
										</div>
										<div class="flex justify-between">
											<span>Delivery fee</span>
											<span class="font-semibold">${deliveryFee.toFixed(2)}</span>
										</div>
										<div class="flex justify-between">
											<span>Tax (10%)</span>
											<span class="font-semibold">${tax.toFixed(2)}</span>
										</div>
									</div>

									<div class="divider my-3"></div>

									<div class="flex justify-between items-center">
										<span class="text-lg font-bold">Total Cost</span>
										<span class="text-3xl font-bold text-primary">${totalCost.toFixed(2)}</span>
									</div>
								</div>

								<div class="flex gap-4">
									<button
										class="btn btn-ghost flex-1"
										on:click={handleStep3Back}
										aria-label="Go back to edit address"
									>
										Back
									</button>
									<button
										class="btn btn-primary flex-1"
										on:click={handleStep3Confirm}
										aria-label="Continue to payment method selection"
									>
										Next: Payment
									</button>
								</div>
							</div>
						</div>
					{/if}

					<!-- Step 4: Payment Method -->
					{#if $checkoutStore.step === 4}
						<div class="card bg-base-100 shadow-lg">
							<div class="card-body">
								<h2 class="card-title text-2xl mb-6">Select Payment Method</h2>

								<div class="space-y-3 mb-6" role="group" aria-label="Payment method selection">
									<!-- Credit Card Option -->
									<button
										type="button"
										class="card cursor-pointer border-2 transition-all text-left"
										class:border-primary={$checkoutStore.payment_method === 'credit-card'}
										class:border-base-300={$checkoutStore.payment_method !== 'credit-card'}
										on:click={() => selectPaymentMethod('credit-card')}
										aria-pressed={$checkoutStore.payment_method === 'credit-card'}
									>
										<div class="card-body p-4">
											<div class="flex items-center gap-3">
												<input
													type="radio"
													name="payment-method"
													value="credit-card"
													bind:group={$checkoutStore.payment_method}
													class="radio radio-primary"
													aria-hidden="true"
												/>
												<div>
													<p class="font-bold">Credit Card</p>
													<p class="text-sm text-base-content/70">Visa, Mastercard, American Express</p>
												</div>
											</div>
										</div>
									</button>

									<!-- PayPal Option -->
									<button
										type="button"
										class="card cursor-pointer border-2 transition-all text-left"
										class:border-primary={$checkoutStore.payment_method === 'paypal'}
										class:border-base-300={$checkoutStore.payment_method !== 'paypal'}
										on:click={() => selectPaymentMethod('paypal')}
										aria-pressed={$checkoutStore.payment_method === 'paypal'}
									>
										<div class="card-body p-4">
											<div class="flex items-center gap-3">
												<input
													type="radio"
													name="payment-method"
													value="paypal"
													bind:group={$checkoutStore.payment_method}
													class="radio radio-primary"
													aria-hidden="true"
												/>
												<div>
													<p class="font-bold">PayPal</p>
													<p class="text-sm text-base-content/70">Fast and secure payment</p>
												</div>
											</div>
										</div>
									</button>

									<!-- Apple Pay Option -->
									<button
										type="button"
										class="card cursor-pointer border-2 transition-all text-left"
										class:border-primary={$checkoutStore.payment_method === 'apple-pay'}
										class:border-base-300={$checkoutStore.payment_method !== 'apple-pay'}
										on:click={() => selectPaymentMethod('apple-pay')}
										aria-pressed={$checkoutStore.payment_method === 'apple-pay'}
									>
										<div class="card-body p-4">
											<div class="flex items-center gap-3">
												<input
													type="radio"
													name="payment-method"
													value="apple-pay"
													bind:group={$checkoutStore.payment_method}
													class="radio radio-primary"
													aria-hidden="true"
												/>
												<div>
													<p class="font-bold">Apple Pay</p>
													<p class="text-sm text-base-content/70">Quick checkout with Apple Pay</p>
												</div>
											</div>
										</div>
									</button>
								</div>

								<div class="alert alert-warning mb-6">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="stroke-current shrink-0 h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 9v2m0 4v2m0 -6a4 4 0 1 0 0 8a4 4 0 0 0 0 -8"
										/>
									</svg>
									<span
										>This is a demo checkout. Payment processing is simulated. Your booking will be confirmed.</span
									>
								</div>

								<div class="flex gap-4">
									<button
										class="btn btn-ghost flex-1"
										on:click={handleStep4Back}
										aria-label="Go back to review order"
									>
										Back
									</button>
									<button
										class="btn btn-primary flex-1"
										on:click={handlePlaceOrder}
										disabled={isProcessing}
										aria-label="Place order and complete booking"
									>
										{#if isProcessing}
											<span class="loading loading-spinner"></span>
											Processing...
										{:else}
											Place Order
										{/if}
									</button>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- Right: Order Summary (Sticky) -->
				{#if court}
					<div class="lg:col-span-1">
						<div class="card bg-base-100 shadow-lg sticky top-8">
							<div class="card-body">
								<h3 class="card-title text-xl mb-4">Order Summary</h3>

								<!-- Court Info -->
								<div class="mb-4">
									<p class="text-xs text-base-content/70 font-semibold mb-1">PADDLE</p>
									<p class="font-bold text-lg">{court.name}</p>
									<p class="text-sm text-base-content/70">{court.brand} {court.model}</p>
								</div>

								<div class="divider my-2"></div>

								<!-- Dates -->
								{#if $checkoutStore.start_date && $checkoutStore.end_date}
									<div class="mb-4">
										<p class="text-xs text-base-content/70 font-semibold mb-2">RENTAL PERIOD</p>
										<p class="font-bold text-sm">{$checkoutStore.start_date}</p>
										<p class="text-xs text-base-content/70">to</p>
										<p class="font-bold text-sm">{$checkoutStore.end_date}</p>
										<p class="text-sm text-base-content/70 mt-1">
											{totalDays} day{totalDays !== 1 ? 's' : ''}
										</p>
									</div>

									<div class="divider my-2"></div>

									<!-- Pricing Summary -->
									<div class="mb-4">
										<div class="flex justify-between text-sm mb-1">
											<span class="text-base-content/70">Daily rate:</span>
											<span class="font-semibold">${(court.price_per_hour * 24).toFixed(2)}</span>
										</div>
										<div class="flex justify-between text-sm mb-1">
											<span class="text-base-content/70">Subtotal:</span>
											<span class="font-semibold">${subtotal.toFixed(2)}</span>
										</div>
										<div class="flex justify-between text-sm mb-1">
											<span class="text-base-content/70">Delivery:</span>
											<span class="font-semibold">${deliveryFee.toFixed(2)}</span>
										</div>
										<div class="flex justify-between text-sm mb-3">
											<span class="text-base-content/70">Tax (10%):</span>
											<span class="font-semibold">${tax.toFixed(2)}</span>
										</div>

										<div class="divider my-2"></div>

										<div class="flex justify-between items-center">
											<span class="text-lg font-bold">Total:</span>
											<span class="text-2xl font-bold text-primary">${totalCost.toFixed(2)}</span>
										</div>
									</div>
								{:else}
									<div class="text-sm text-base-content/70">Select dates to see pricing</div>
								{/if}
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<!-- 404: Court not found -->
	<div class="min-h-screen flex items-center justify-center bg-base-100">
		<div class="text-center">
			<h1 class="text-5xl font-bold mb-4">Invalid Booking</h1>
			<p class="text-lg text-base-content/70 mb-8">The court information is invalid or missing.</p>
			<a href="/courts" class="btn btn-primary">Browse Courts</a>
		</div>
	</div>
{/if}
