import * as XLSX from "xlsx-js-style";

export const exportLeaveReport = (
  filteredLeaves,
  page,
  formatDate
) => {
  const total = filteredLeaves.length;

  const approved = filteredLeaves.filter(
    x => x.status === "approved"
  ).length;

  const pending = filteredLeaves.filter(
    x => x.status === "pending"
  ).length;

  const rejected = filteredLeaves.filter(
    x => x.status === "rejected"
  ).length;

  const workbook = XLSX.utils.book_new();

  const rows = [
    ["MONTHLY LEAVE REPORT"],
    [],
    [`Generated Date: ${new Date().toLocaleDateString()}`],
    [
      `Total: ${total} | Approved: ${approved} | Pending: ${pending} | Rejected: ${rejected}`
    ],
    [],
    [
      "Sl No",
      "Employee Name",
      "Employee ID",
      "Department",
      "Leave Type",
      "Start Date",
      "End Date",
      "Status"
    ]
  ];

  filteredLeaves.forEach((leave, index) => {
    rows.push([
      index + 1 + (page - 1) * 20,
      leave?.employee?.name || "N/A",
      leave?.employee?.employee_id || "N/A",
      leave?.employee?.department || "N/A",
      leave?.leave_type || "N/A",
      formatDate(leave?.from_date),
      formatDate(leave?.to_date),
      (leave?.status || "pending").toUpperCase()
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }
  ];

  ws["!cols"] = [
    { wch: 8 },
    { wch: 25 },
    { wch: 18 },
    { wch: 20 },
    { wch: 18 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 }
  ];

  // Title
  ws["A1"].s = {
    font: {
      bold: true,
      sz: 20,
      color: { rgb: "FFFFFF" }
    },
    fill: {
      fgColor: { rgb: "1E3A8A" }
    },
    alignment: {
      horizontal: "center"
    }
  };

  // Summary
  ["A3","A4"].forEach(cell=>{
    if(ws[cell]){
      ws[cell].s={
        font:{
          bold:true,
          sz:12
        },
        fill:{
          fgColor:{
            rgb:"E5E7EB"
          }
        }
      }
    }
  });

  // Header
  const headers=[
    "A6","B6","C6","D6",
    "E6","F6","G6","H6"
  ];

  headers.forEach(cell=>{
    ws[cell].s={
      font:{
        bold:true,
        color:{rgb:"FFFFFF"}
      },
      fill:{
        fgColor:{rgb:"111827"}
      },
      alignment:{
        horizontal:"center"
      }
    }
  });

  for(let i=7;i<=rows.length;i++){

    const even=i%2===0;

    ["A","B","C","D","E","F","G","H"]
    .forEach(col=>{

      const cell=`${col}${i}`;

      if(ws[cell]){
        ws[cell].s={
          alignment:{
            horizontal:"center"
          },
          fill:even
          ?{fgColor:{rgb:"F9FAFB"}}
          :{fgColor:{rgb:"FFFFFF"}}
        };
      }
    });

    const statusCell=`H${i}`;

    if(ws[statusCell]){

      const status=
      ws[statusCell].v?.toLowerCase();

      if(status==="approved"){
        ws[statusCell].s.fill={
          fgColor:{rgb:"D1FAE5"}
        };
      }

      if(status==="pending"){
        ws[statusCell].s.fill={
          fgColor:{rgb:"FEF3C7"}
        };
      }

      if(status==="rejected"){
        ws[statusCell].s.fill={
          fgColor:{rgb:"FECACA"}
        };
      }
    }
  }

  ws["!freeze"]={
    ySplit:6
  };

  ws["!autofilter"]={
    ref:"A6:H1000"
  };

  XLSX.utils.book_append_sheet(
    workbook,
    ws,
    "Leave Report"
  );

  XLSX.writeFile(
    workbook,
    `Rekory_Leave_Report_${
      new Date()
      .toISOString()
      .slice(0,10)
    }.xlsx`
  );
};