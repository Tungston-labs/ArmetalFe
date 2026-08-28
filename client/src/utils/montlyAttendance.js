import XLSX from "xlsx-js-style";

export const exportAttendanceExcel = (employees, selectedMonth) => {
  const workbook = XLSX.utils.book_new();
  const ws = {};
  let row = 0;
  const merges = [];

  // =========================================================
  // STYLES
  // =========================================================

  const titleStyle = {
    font: {
      bold: true,
      sz: 16,
      color: { rgb: "FFFFFF" },
    },
    fill: {
      fgColor: { rgb: "1F4E78" },
    },
    alignment: {
      horizontal: "center",
      vertical: "center",
    },
  };

  const sectionStyle = {
    font: {
      bold: true,
      sz: 12,
      color: { rgb: "FFFFFF" },
    },
    fill: {
      fgColor: { rgb: "5B9BD5" },
    },
    alignment: {
      horizontal: "left",
      vertical: "center",
    },
  };

  const labelStyle = {
    font: {
      bold: true,
    },
    fill: {
      fgColor: { rgb: "EAF2F8" },
    },
    border: {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    },
  };

  const valueStyle = {
    border: {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    },
  };

  const headerStyle = {
    font: {
      bold: true,
      color: { rgb: "FFFFFF" },
    },
    fill: {
      fgColor: { rgb: "4472C4" },
    },
    alignment: {
      horizontal: "center",
      vertical: "center",
      wrapText: true,
    },
    border: {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    },
  };

  const dataStyle = {
    alignment: {
      horizontal: "center",
      vertical: "center",
      wrapText: true,
    },
    border: {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    },
  };

  // =========================================================
  // ADD CELL
  // =========================================================

  const addCell = (r, c, value, style = {}) => {
    const ref = XLSX.utils.encode_cell({
      r,
      c,
    });

    ws[ref] = {
      t: typeof value === "number" ? "n" : "s",
      v: value ?? "-",
      s: style,
    };
  };

  // =========================================================
  // EMPLOYEES
  // =========================================================

  employees.forEach((emp) => {
    // =======================================================
    // TITLE
    // =======================================================

    addCell(
      row,
      0,
      `MONTHLY ATTENDANCE REPORT - ${selectedMonth}`,
      titleStyle
    );

    merges.push({
      s: {
        r: row,
        c: 0,
      },
      e: {
        r: row,
        c: 7,
      },
    });

    row += 2;

    // =======================================================
    // EMPLOYEE DETAILS
    // =======================================================

    addCell(
      row,
      0,
      "Employee Details",
      sectionStyle
    );

    merges.push({
      s: {
        r: row,
        c: 0,
      },
      e: {
        r: row,
        c: 1,
      },
    });

    row++;

    const details = [
      ["Employee Name", emp.employee_name],
      ["User Name", emp.employee_id],
      ["Department", emp.department],
      ["Working Days", emp.working_days],
      ["Present Days", emp.present_days],
      ["Absent Days", emp.absent_days],
      ["LOP Days", emp.lop_days],
    ];

    details.forEach(([label, value]) => {
      addCell(
        row,
        0,
        label,
        labelStyle
      );

      addCell(
        row,
        1,
        value ?? "-",
        valueStyle
      );

      row++;
    });

    row++;

    // =======================================================
    // DAILY ATTENDANCE HEADING
    // =======================================================

    addCell(
      row,
      0,
      "Daily Attendance",
      sectionStyle
    );

    merges.push({
      s: {
        r: row,
        c: 0,
      },
      e: {
        r: row,
        c: 7,
      },
    });

    row++;

    // =======================================================
    // DAILY ATTENDANCE HEADER
    // =======================================================

    const attendanceHeaders = [
      "Date",
      "Attendance Type",
      "Punch In",
      "Punch Out",
      "Total Hours",
      "Updated At",
      "Updated By",
      "Updated By Role",
    ];

    attendanceHeaders.forEach((text, col) => {
      addCell(
        row,
        col,
        text,
        headerStyle
      );
    });

    row++;

    // =======================================================
    // DAILY ATTENDANCE DATA
    // =======================================================

    (emp.daily_records || []).forEach((record) => {
      // -----------------------------------------------------
      // ATTENDANCE TYPE
      // -----------------------------------------------------
      // If attendance_type exists:
      //     paid / unpaid
      //
      // Otherwise:
      //     use status
      // -----------------------------------------------------

      const attendanceType =
        record.attendance_type !== null &&
        record.attendance_type !== undefined &&
        String(record.attendance_type).trim() !== ""
          ? String(record.attendance_type)
          : record.status || "-";

      // -----------------------------------------------------
      // UPDATED AT
      // -----------------------------------------------------

      let updatedAt = record.updated_at || "-";

      if (
        updatedAt !== "-" &&
        updatedAt !== null &&
        updatedAt !== undefined
      ) {
        const updatedDate = new Date(updatedAt);

        if (!isNaN(updatedDate.getTime())) {
          updatedAt = updatedDate.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        }
      }

      // -----------------------------------------------------
      // UPDATED BY
      // -----------------------------------------------------

      const updatedBy =
        record.updated_by ||
        "-";

      // -----------------------------------------------------
      // UPDATED BY ROLE
      // -----------------------------------------------------

      const updatedByRole =
        record.updated_by_role ||
        "-";

      // -----------------------------------------------------
      // ADD ROW
      // -----------------------------------------------------

      addCell(
        row,
        0,
        record.date || "-",
        dataStyle
      );

      addCell(
        row,
        1,
        attendanceType,
        dataStyle
      );

      addCell(
        row,
        2,
        record.first_punch_in || "-",
        dataStyle
      );

      addCell(
        row,
        3,
        record.last_punch_out || "-",
        dataStyle
      );

      addCell(
        row,
        4,
        record.total_hours !== null &&
        record.total_hours !== undefined
          ? record.total_hours
          : "-",
        dataStyle
      );

      addCell(
        row,
        5,
        updatedAt,
        dataStyle
      );

      addCell(
        row,
        6,
        updatedBy,
        dataStyle
      );

      addCell(
        row,
        7,
        updatedByRole,
        dataStyle
      );

      row++;
    });

    row += 2;
  });

  // =========================================================
  // SHEET RANGE
  // =========================================================

  ws["!ref"] = XLSX.utils.encode_range({
    s: {
      r: 0,
      c: 0,
    },
    e: {
      r: row,
      c: 7,
    },
  });

  // =========================================================
  // COLUMN WIDTHS
  // =========================================================

  ws["!cols"] = [
    {
      wch: 18,
    },
    {
      wch: 20,
    },
    {
      wch: 18,
    },
    {
      wch: 18,
    },
    {
      wch: 15,
    },
    {
      wch: 23,
    },
    {
      wch: 22,
    },
    {
      wch: 18,
    },
  ];

  // =========================================================
  // ROW HEIGHTS
  // =========================================================

  ws["!rows"] = Array.from(
    {
      length: row + 1,
    },
    () => ({
      hpt: 22,
    })
  );

  // =========================================================
  // MERGES
  // =========================================================

  ws["!merges"] = merges;

  // =========================================================
  // APPEND SHEET
  // =========================================================

  XLSX.utils.book_append_sheet(
    workbook,
    ws,
    "Attendance"
  );

  // =========================================================
  // DOWNLOAD
  // =========================================================

  XLSX.writeFile(
    workbook,
    `Attendance_${selectedMonth.replace(
      /\s+/g,
      "_"
    )}.xlsx`
  );
};