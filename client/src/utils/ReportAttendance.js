import * as XLSX from "xlsx";
export const handleExportExcel = () => {
  const excelData = attendanceData.map((emp) => {
    const row = {
      Employee: emp.name,
      Department: emp.department,
    };

    days.forEach((day) => {
      row[`Day ${day}`] = emp.attendance[day] || "-";
    });

    row.Present = emp.present;
    row.Absent = emp.absent;
    row.Leave = emp.leave;

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(excelData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Attendance Report"
  );

  XLSX.writeFile(
    workbook,
    `Attendance_Report_${monthName}_${year}.xlsx`
  );
};