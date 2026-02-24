export const printElement = (element) => {
  if (!element) return;

  const WinPrint = window.open("", "", "width=1000,height=800");

  WinPrint.document.write(`
    <html>
      <head>
        <title>Payroll</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }

          body {
            font-family: "Segoe UI", Arial, sans-serif;
            font-size: 13px;
            color: #000;
            margin: 0;
          }

          .top-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }

          .emp-name {
            font-size: 16px;
            font-weight: 600;
          }

          .emp-id {
            font-size: 14px;
            font-weight: 500;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          th {
            background: #f2f2f2;
            font-weight: 600;
            text-align: left;
          }

          th, td {
            border: 1px solid #000;
            padding: 8px;
          }

          td.amount {
            text-align: right;
          }

          .section {
            margin-top: 25px;
          }

          .total-row td {
            font-weight: bold;
          }

          .footer {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
            font-size: 12px;
          }

          .no-print {
            display: none !important;
          }
        </style>
      </head>
      <body>

        ${element.innerHTML}

        <div class="footer">
          <div>Generated on: ${new Date().toLocaleDateString()}</div>
          <div>Authorized Signature</div>
        </div>

      </body>
    </html>
  `);

  WinPrint.document.close();
  WinPrint.focus();
  WinPrint.print();
  WinPrint.close();
};