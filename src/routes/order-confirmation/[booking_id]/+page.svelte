<script>
	import { page } from '$app/stores';
	import { getMockBooking } from '$lib/data/bookings';
	import { getCourtById } from '$lib/data/courts';

	let booking;
	let court;

	// Load booking data
	$: {
		const bookingId = $page.params.booking_id;
		if (bookingId) {
			booking = getMockBooking(bookingId);
			if (booking) {
				court = getCourtById(booking.court_id);
			}
		}
	}

	function calculateTotalDays(startDate, endDate) {
		if (!startDate || !endDate) return 1;
		const start = new Date(startDate).getTime();
		const end = new Date(endDate).getTime();
		const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
		return Math.max(days, 1);
	}

	function formatDate(dateStr) {
		const date = new Date(dateStr + 'T00:00:00');
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

{#if booking && court}
	<div class="min-h-screen bg-base-100">
		<!-- Success Header -->
		<div class="bg-success text-success-content py-12">
			<div class="container mx-auto px-4 text-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-24 h-24 mx-auto mb-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<h1 class="text-5xl font-bold mb-4">Booking Confirmed!</h1>
				<p class="text-xl opacity-90">Your court rental reservation has been successfully created.</p>
			</div>
		</div>

		<div class="container mx-auto px-4 py-12">
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Main Content -->
				<div class="lg:col-span-2">
					<!-- Booking ID Card -->
					<div class="card bg-base-100 shadow-lg mb-8">
						<div class="card-body">
							<h2 class="card-title text-2xl mb-4">Booking Details</h2>

							<div class="bg-primary/10 p-6 rounded-lg mb-6">
								<p class="text-sm text-base-content/70 font-semibold mb-2">BOOKING ID</p>
								<p class="text-2xl font-bold text-primary font-mono break-all">{booking.id}</p>
								<p class="text-xs text-base-content/70 mt-2">Keep this ID for your reference</p>
							</div>

							<!-- Court Info -->
							<div class="mb-6">
								<h3 class="text-lg font-bold mb-4">Court Details</h3>
								<div class="flex gap-4">
									<img
										src={court.image_url}
										alt={court.name}
										class="w-32 h-32 object-cover rounded-lg"
									/>
									<div class="flex-1">
										<p class="text-xs text-base-content/70 uppercase font-semibold mb-1">Court</p>
										<h4 class="text-xl font-bold mb-1">{court.name}</h4>
										<p class="text-base-content/70 mb-3">{court.brand} {court.model}</p>
										<p class="text-sm">
											<span class="font-semibold">Daily rate:</span> ${court.price_per_hour}/hour (${court.price_per_hour *
												24}/day)
										</p>
									</div>
								</div>
							</div>

							<div class="divider"></div>

							<!-- Rental Period -->
							<div class="mb-6">
								<h3 class="text-lg font-bold mb-4">Rental Period</h3>
								<div class="grid grid-cols-2 gap-4">
									<div>
										<p class="text-sm text-base-content/70 font-semibold mb-1">START DATE</p>
										<p class="text-lg font-bold">{formatDate(booking.start_date)}</p>
									</div>
									<div>
										<p class="text-sm text-base-content/70 font-semibold mb-1">END DATE</p>
										<p class="text-lg font-bold">{formatDate(booking.end_date)}</p>
									</div>
								</div>
								<p class="text-sm text-base-content/70 mt-4">
									Duration: <span class="font-semibold"
										>{calculateTotalDays(booking.start_date, booking.end_date)} days</span
									>
								</p>
							</div>

							<div class="divider"></div>

							<!-- Delivery Address -->
							<div class="mb-6">
								<h3 class="text-lg font-bold mb-4">Delivery Address</h3>
								<div class="p-4 bg-base-200 rounded-lg text-sm">
									<p class="font-bold text-base mb-2">{booking.delivery_address.full_name}</p>
									<p>{booking.delivery_address.street_address}</p>
									<p>
										{booking.delivery_address.city}, {booking.delivery_address.state}
										{booking.delivery_address.zip}
									</p>
									<p class="mt-3">
										<span class="font-semibold">Phone:</span>
										{booking.delivery_address.phone}
									</p>
								</div>
							</div>

							<div class="divider"></div>

							<!-- Important Info -->
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
								<div>
									<p class="font-semibold">What's next?</p>
									<p class="text-sm">A confirmation email has been sent to your email address with all booking details and delivery instructions.</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Right: Cost Summary -->
				<div class="lg:col-span-1">
					<div class="card bg-base-100 shadow-lg sticky top-8">
						<div class="card-body">
							<h3 class="card-title text-xl mb-6">Cost Summary</h3>

							<div class="space-y-2 mb-4">
								<div class="flex justify-between text-sm">
									<span class="text-base-content/70">Daily rate:</span>
									<span class="font-semibold">${court.price_per_hour * 24}/day</span>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-base-content/70">Duration:</span>
									<span class="font-semibold"
										>{calculateTotalDays(booking.start_date, booking.end_date)} days</span
									>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-base-content/70">Subtotal:</span>
									<span class="font-semibold"
										>${(
											court.price_per_hour *
											24 *
											calculateTotalDays(booking.start_date, booking.end_date)
										).toFixed(2)}</span
									>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-base-content/70">Delivery fee:</span>
									<span class="font-semibold">$10.00</span>
								</div>
								<div class="flex justify-between text-sm">
									<span class="text-base-content/70">Tax (10%):</span>
									<span class="font-semibold"
										>${(
											(court.price_per_hour *
												24 *
												calculateTotalDays(booking.start_date, booking.end_date) +
												10) *
											0.1
										).toFixed(2)}</span
									>
								</div>
							</div>

							<div class="divider"></div>

							<div class="mb-6">
								<div class="flex justify-between items-center">
									<span class="text-lg font-bold">Total Paid:</span>
									<span class="text-3xl font-bold text-primary">${booking.total_price.toFixed(2)}</span>
								</div>
							</div>

							<div class="badge badge-success w-full py-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="w-5 h-5 mr-2"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									/>
								</svg>
								Payment Received
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="mt-8">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<a href="/dashboard" class="btn btn-primary btn-lg w-full">
						View My Bookings
					</a>
					<a href="/courts" class="btn btn-ghost btn-lg w-full">
						Browse More Courts
					</a>
				</div>
			</div>
		</div>
	</div>
{:else}
	<!-- 404: Booking not found -->
	<div class="min-h-screen flex items-center justify-center bg-base-100">
		<div class="text-center">
			<h1 class="text-5xl font-bold mb-4">Booking Not Found</h1>
			<p class="text-lg text-base-content/70 mb-8">We couldn't find the booking you're looking for.</p>
			<div class="flex gap-4 justify-center">
				<a href="/dashboard" class="btn btn-primary">View My Bookings</a>
				<a href="/courts" class="btn btn-ghost">Browse Courts</a>
			</div>
		</div>
	</div>
{/if}
