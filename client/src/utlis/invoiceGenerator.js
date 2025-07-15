export const generateInvoiceHTML = (entry, companyName = "Company") => `
  <h1>Invoice - ${companyName}</h1>
  <div class="section-title">Subscription Details</div>
  <table>
    <thead>
      <tr>
        <th>Month</th>
        <th>Year</th>
        <th>Status</th>
        <th>Paid Date</th>
        <th>Amount</th>
        <th>Currency</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${entry.month_display}</td>
        <td>${entry.year}</td>
        <td>${entry.status}</td>
        <td>${entry.paid_date || '-'}</td>
        <td>${entry.amount}</td>
        <td>${entry.currency}</td>
      </tr>
    </tbody>
  </table>
`;
