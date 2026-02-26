export const printElement = (element) => {
  if (!element) return;

  const WinPrint = window.open("", "", "width=1200,height=900");

  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map(node => node.outerHTML)
    .join("\n");

  WinPrint.document.write(`
    <html>
      <head>
        <title>Payroll</title>
        ${styles}
        <style>
          @media print {
            body {
              -webkit-print-color-adjust: exact;
            }

            .no-print {
              display: none !important;
            }

            table, th, td {
              page-break-inside: avoid;
            }
                .net-pay td {
      // background-color: #f9f871;
      font-weight: bold;
      border: 1px solid #000;
    }
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
        <div class="footer" style="margin-top: 50px; display:flex; justify-content:space-between; font-size:12px;">
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