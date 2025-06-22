export const generateInvoiceHTML = (entry, companyName = "Tungston Labs") => `
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h2 { color: #333; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
    th { background-color: #f4f4f4; }
  </style>

  <h2>Subscription Invoice</h2>
  <p><strong>Company:</strong> ${companyName}</p>
  <p><strong>Invoice Date:</strong> ${new Date().toLocaleDateString()}</p>

  <table>
    <tr><th>Month</th><th>Year</th><th>Amount</th><th>Status</th><th>Paid Date</th><th>Currency</th></tr>
    <tr>
      <td>${entry.month}</td>
      <td>${entry.year}</td>
      <td>${entry.amount}</td>
      <td>${entry.status}</td>
      <td>${entry.paid_date || '-'}</td>
      <td>${entry.currency}</td>
    </tr>
  </table>

  <p style="margin-top: 30px;">Please make the payment by the due date to avoid service interruption.</p>
`;
