<script>
  import { createEventDispatcher } from 'svelte';
  import { addReview } from '$lib/data/reviews';

  const dispatch = createEventDispatcher();

  // Props
  export let isOpen = false;
  export let bookingId = '';
  export let paddleId = '';
  export let reviewerId = '';
  export let reviewerName = '';
  export let paddleName = '';

  // Form state
  let selectedRating = 0;
  let comment = '';
  let isSubmitting = false;
  let errorMessage = '';

  const MAX_COMMENT_LENGTH = 500;

  // Get character count
  $: charCount = comment.length;
  $: charRemaining = MAX_COMMENT_LENGTH - charCount;

  // Handle star click
  function handleStarClick(rating) {
    selectedRating = rating;
  }

  // Handle keyboard navigation for stars
  function handleKeyDown(e, rating) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStarClick(rating);
    } else if (e.key === 'ArrowRight' && rating < 5) {
      // Move focus to next star
      const nextButton = document.querySelector(`[data-star="${rating + 1}"]`);
      nextButton?.focus();
    } else if (e.key === 'ArrowLeft' && rating > 1) {
      // Move focus to previous star
      const prevButton = document.querySelector(`[data-star="${rating - 1}"]`);
      prevButton?.focus();
    }
  }

  // Handle submission
  function handleSubmit() {
    errorMessage = '';

    // Validate rating
    if (selectedRating === 0) {
      errorMessage = 'Please select a star rating';
      return;
    }

    // Validate comment length
    if (comment.length > MAX_COMMENT_LENGTH) {
      errorMessage = `Comment must be ${MAX_COMMENT_LENGTH} characters or less`;
      return;
    }

    isSubmitting = true;

    try {
      // Add the review
      addReview(bookingId, paddleId, reviewerId, reviewerName, selectedRating, comment);

      // Dispatch success event with review data
      dispatch('submit', {
        bookingId,
        paddleId,
        rating: selectedRating,
        comment,
        reviewerName
      });

      // Reset form
      handleClose();
    } catch (error) {
      errorMessage = error.message || 'Failed to submit review';
    } finally {
      isSubmitting = false;
    }
  }

  // Handle close
  function handleClose() {
    isOpen = false;
    selectedRating = 0;
    comment = '';
    errorMessage = '';
    dispatch('close');
  }

  // Close on Escape key
  function handleEscape(e) {
    if (e.key === 'Escape' && isOpen) {
      handleClose();
    }
  }
</script>

<svelte:window on:keydown={handleEscape} />

<!-- Modal Backdrop -->
{#if isOpen}
  <button
    type="button"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 cursor-default"
    on:click={handleClose}
    aria-label="Close modal"
    tabindex="-1"
  />
{/if}

<!-- Modal -->
<div
  class={`fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none ${
    isOpen ? 'pointer-events-auto' : ''
  }`}
>
  <div
    class={`bg-base-100 rounded-lg shadow-2xl max-w-lg w-full transition-all duration-200 transform ${
      isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
    }`}
    role="dialog"
    aria-labelledby="review-modal-title"
    aria-modal="true"
  >
    <!-- Header -->
    <div class="bg-base-200 px-6 py-4 border-b border-base-300 flex items-center justify-between">
      <h2 id="review-modal-title" class="text-xl font-bold">
        Leave a Review
      </h2>
      <button
        class="btn btn-ghost btn-sm btn-circle"
        on:click={handleClose}
        aria-label="Close review modal"
      >
        ✕
      </button>
    </div>

    <!-- Body -->
    <div class="px-6 py-6 space-y-6">
      <!-- Paddle Name Display -->
      <div>
        <p class="text-sm text-base-content/70 font-semibold mb-1">Paddle</p>
        <p class="text-lg font-bold text-primary">{paddleName}</p>
      </div>

      <!-- Star Rating Picker -->
      <div>
        <label class="label" for="rating-group">
          <span class="label-text font-semibold">Rating <span class="text-error">*</span></span>
        </label>

        <div
          id="rating-group"
          class="flex gap-3 justify-start"
          role="group"
          aria-label="Star rating (1-5 stars)"
        >
          {#each [1, 2, 3, 4, 5] as rating (rating)}
            <button
              type="button"
              data-star={rating}
              class={`text-4xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded ${
                rating <= selectedRating ? 'text-warning scale-110' : 'text-base-300 hover:scale-105'
              }`}
              on:click={() => handleStarClick(rating)}
              on:keydown={(e) => handleKeyDown(e, rating)}
              aria-label={`${rating} star${rating !== 1 ? 's' : ''}`}
              aria-pressed={rating <= selectedRating}
              tabindex={rating === 1 ? 0 : -1}
            >
              ★
            </button>
          {/each}
        </div>

        {#if selectedRating > 0}
          <p class="text-sm text-base-content/70 mt-2">
            {selectedRating} out of 5 star{selectedRating !== 1 ? 's' : ''}
          </p>
        {/if}
      </div>

      <!-- Comment Text Area -->
      <div>
        <label class="label" for="comment">
          <span class="label-text font-semibold">Comment (Optional)</span>
          <span class="label-text-alt text-base-content/60">
            {charCount}/{MAX_COMMENT_LENGTH}
          </span>
        </label>
        <textarea
          id="comment"
          class={`textarea textarea-bordered w-full h-28 resize-none ${
            charRemaining < 0 ? 'textarea-error' : ''
          }`}
          placeholder="Share your experience with this paddle..."
          bind:value={comment}
          maxlength={MAX_COMMENT_LENGTH}
          aria-label="Review comment"
          aria-describedby="comment-help"
        />
        <p
          id="comment-help"
          class={`text-xs mt-1 ${charRemaining < 0 ? 'text-error' : 'text-base-content/60'}`}
        >
          {charRemaining < 0
            ? `Exceeded by ${Math.abs(charRemaining)} characters`
            : `${charRemaining} characters remaining`}
        </p>
      </div>

      <!-- Error Message -->
      {#if errorMessage}
        <div class="alert alert-error" role="alert">
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
              d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m2-2l2 2m-2-2l-2-2"
            />
          </svg>
          <span>{errorMessage}</span>
        </div>
      {/if}
    </div>

    <!-- Footer -->
    <div class="bg-base-200 px-6 py-4 border-t border-base-300 flex gap-3 justify-end">
      <button
        type="button"
        class="btn btn-ghost"
        on:click={handleClose}
        disabled={isSubmitting}
        aria-label="Cancel review submission"
      >
        Cancel
      </button>
      <button
        type="button"
        class="btn btn-primary"
        on:click={handleSubmit}
        disabled={isSubmitting || selectedRating === 0}
        aria-label="Submit review"
      >
        {#if isSubmitting}
          <span class="loading loading-spinner loading-sm" />
          Posting...
        {:else}
          Post Review
        {/if}
      </button>
    </div>
  </div>
</div>

<style>
  :global(body.modal-open) {
    overflow: hidden;
  }
</style>
