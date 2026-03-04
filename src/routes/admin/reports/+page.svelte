<script>
  import { generateBookingsCSV, generateCourtsCSV, downloadFile, generateMonthlyReportHTML } from '$lib/export';

  let startDate = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
  let endDate = new Date().toISOString().split('T')[0];
  let successMessage = '';

  function handleExportCSV(type) {
    try {
      let csv = '';
      let filename = '';

      if (type === 'bookings') {
        csv = generateBookingsCSV();
        filename = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
      } else if (type === 'courts') {
        csv = generateCourtsCSV();
        filename = `courts_${new Date().toISOString().split('T')[0]}.csv`;
      }

      downloadFile(csv, filename, 'text/csv');
      successMessage = `${type.charAt(0).toUpperCase() + type.slice(1)} exported successfully!`;
      setTimeout(() => (successMessage = ''), 3000);
    } catch (error) {
      console.error('Export error:', error);
    }
  }

  function handleGenerateReport() {
    try {
      const html = generateMonthlyReportHTML(startDate, endDate);
      const filename = `report_${startDate}_to_${endDate}.html`;
      downloadFile(html, filename, 'text/html');
      successMessage = 'Report generated successfully!';
      setTimeout(() => (successMessage = ''), 3000);
    } catch (error) {
      console.error('Report generation error:', error);
    }
  }
</script>

<div class="min-h-screen bg-base-100">
  <div class="bg-base-200 px-4 py-6 border-b border-base-300">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold">Reports & Exports</h1>
      <p class="text-base-content/70 mt-2">Export data and generate reports</p>
    </div>
  </div>

  <div class="p-4 md:p-8 max-w-4xl mx-auto">
    {#if successMessage}
      <div class="alert alert-success mb-6" role="status" aria-live="polite">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{successMessage}</span>
      </div>
    {/if}

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- CSV Exports -->
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h2 class="card-title mb-4">📥 CSV Exports</h2>
          <p class="text-sm text-base-content/70 mb-4">Download raw data as CSV files</p>

          <div class="space-y-3">
            <button
              class="btn btn-outline btn-primary w-full"
              on:click={() => handleExportCSV('bookings')}
            >
              📅 Export All Bookings
            </button>

            <button
              class="btn btn-outline btn-primary w-full"
              on:click={() => handleExportCSV('courts')}
            >
              📍 Export All Courts
            </button>
          </div>

          <div class="divider my-4" />
          <p class="text-xs text-base-content/60">
            CSV files are compatible with Excel, Google Sheets, and other spreadsheet applications.
          </p>
        </div>
      </div>

      <!-- Report Generation -->
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h2 class="card-title mb-4">📊 Generate Report</h2>
          <p class="text-sm text-base-content/70 mb-4">Create a formatted HTML report</p>

          <div class="form-control mb-3">
            <label class="label" for="start-date">
              <span class="label-text text-sm">Start Date</span>
            </label>
            <input
              type="date"
              id="start-date"
              class="input input-bordered input-sm"
              bind:value={startDate}
            />
          </div>

          <div class="form-control mb-4">
            <label class="label" for="end-date">
              <span class="label-text text-sm">End Date</span>
            </label>
            <input
              type="date"
              id="end-date"
              class="input input-bordered input-sm"
              bind:value={endDate}
            />
          </div>

          <button
            class="btn btn-primary w-full"
            on:click={handleGenerateReport}
          >
            Generate Monthly Report
          </button>

          <div class="divider my-4" />
          <p class="text-xs text-base-content/60">
            Reports include revenue summary, court breakdown, and booking statistics.
          </p>
        </div>
      </div>
    </div>

    <!-- Info Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body items-center text-center">
          <h3 class="card-title text-lg">📋</h3>
          <p class="text-sm">Booking data includes all reservations with dates, times, and pricing information</p>
        </div>
      </div>

      <div class="card bg-base-200 shadow-lg">
        <div class="card-body items-center text-center">
          <h3 class="card-title text-lg">🏟️</h3>
          <p class="text-sm">Court data contains facility information, availability status, and hourly rates</p>
        </div>
      </div>

      <div class="card bg-base-200 shadow-lg">
        <div class="card-body items-center text-center">
          <h3 class="card-title text-lg">💰</h3>
          <p class="text-sm">Reports provide financial summaries and facility utilization metrics</p>
        </div>
      </div>
    </div>
  </div>
</div>
