import { getAllCourts } from './data/courts';
import { getAllMockBookings } from './data/bookings';

export function generateBookingsCSV(): string {
  const bookings = getAllMockBookings();
  const headers = ['ID', 'Court ID', 'User Name', 'Booking Date', 'Start Time', 'End Time', 'Status', 'Price'];
  const rows = bookings.map(b => [
    b.id,
    b.court_id,
    b.user_name,
    b.booking_date,
    b.start_time,
    b.end_time,
    b.status,
    b.total_price.toString()
  ]);

  return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

export function generateCourtsCSV(): string {
  const courts = getAllCourts();
  const headers = ['ID', 'Name', 'Location', 'Type', 'Surface', 'Hourly Rate', 'Total Slots', 'Available Now', 'Description'];
  const rows = courts.map(c => [
    c.id,
    c.name,
    c.location,
    c.type,
    c.surface,
    c.hourly_rate.toString(),
    c.total_slots.toString(),
    c.available_now ? 'Yes' : 'No',
    c.description
  ]);

  return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateMonthlyReportHTML(startDate: string, endDate: string): string {
  const bookings = getAllMockBookings();

  const filteredBookings = bookings.filter(b => b.booking_date >= startDate && b.booking_date <= endDate);
  const totalRevenue = filteredBookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.total_price, 0);

  const courtBreakdown = {};
  filteredBookings.forEach(b => {
    if (!courtBreakdown[b.court_id]) {
      courtBreakdown[b.court_id] = { count: 0, revenue: 0 };
    }
    courtBreakdown[b.court_id].count++;
    if (b.status === 'confirmed' || b.status === 'completed') {
      courtBreakdown[b.court_id].revenue += b.total_price;
    }
  });

  let courtRows = '';
  Object.entries(courtBreakdown).forEach(([courtId, data]: [string, { count: number; revenue: number }]) => {
    courtRows += `
      <tr>
        <td>${courtId}</td>
        <td>${data.count}</td>
        <td>$${data.revenue.toFixed(2)}</td>
      </tr>
    `;
  });

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Monthly Revenue Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #333; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .summary { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .total { font-size: 24px; font-weight: bold; color: #2c5aa0; }
        </style>
      </head>
      <body>
        <h1>Monthly Revenue Report</h1>
        <p><strong>Period:</strong> ${startDate} to ${endDate}</p>

        <div class="summary">
          <p class="total">Total Revenue: $${totalRevenue.toFixed(2)}</p>
          <p>Total Bookings: ${filteredBookings.length}</p>
          <p>Report Generated: ${new Date().toLocaleDateString()}</p>
        </div>

        <h2>Court Breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>Court</th>
              <th>Bookings</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            ${courtRows}
          </tbody>
        </table>

        <hr style="margin-top: 40px;">
        <p style="font-size: 12px; color: #999;">This is an auto-generated report. For questions, contact the admin.</p>
      </body>
    </html>
  `;
}
