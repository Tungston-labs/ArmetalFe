import * as XLSX from "xlsx";

export const exportLeaveReportExcel = (leaveData) => {
  const excelData = leaveData.map((leave) => ({
    Employee: leave.employee,
    Department: leave.department,
    LeaveType: leave.leaveType,
    FromDate: leave.fromDate,
    ToDate: leave.toDate,
    Days: leave.days,
    Status: leave.status,
    Reason: leave.reason,
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Leave Report"
  );

  XLSX.writeFile(
    workbook,
    "Leave_Report.xlsx"
  );
};