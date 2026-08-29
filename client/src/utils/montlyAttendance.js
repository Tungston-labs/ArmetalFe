import XLSX from "xlsx-js-style";

export const exportAttendanceExcel = (
  employees,
  selectedMonth
) => {
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

  const addCell = (
    r,
    c,
    value,
    style = {}
  ) => {
    const ref = XLSX.utils.encode_cell({
      r,
      c,
    });

    ws[ref] = {
      t:
        typeof value === "number"
          ? "n"
          : "s",

      v:
        value !== null &&
        value !== undefined &&
        value !== ""
          ? value
          : "-",

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

    // 9 columns = 0 to 8
    merges.push({
      s: {
        r: row,
        c: 0,
      },
      e: {
        r: row,
        c: 8,
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

    // =======================================================
    // PAID ABSENT DAYS
    // =======================================================

    const paidAbsentDays =
      emp.paid_absent_days ??
      emp.paid_absent ??
      0;

    // =======================================================
    // EMPLOYEE SUMMARY
    // =======================================================

    const details = [
      [
        "Employee Name",
        emp.employee_name,
      ],
      [
        "Department",
        emp.department,
      ],
      [
        "Working Days",
        emp.working_days,
      ],
      [
        "Present Days",
        emp.present_days,
      ],
      [
        "Absent Days",
        emp.absent_days,
      ],
      [
        "Paid Absent Days",
        paidAbsentDays,
      ],
      [
        "LOP Days",
        emp.lop_days,
      ],
    ];

    details.forEach(
      ([label, value]) => {

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
      }
    );

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
        c: 8,
      },
    });

    row++;

    // =======================================================
    // DAILY ATTENDANCE HEADER
    // =======================================================

    const attendanceHeaders = [
      "Date",
      "Attendance Status",
      "Attendance Type",
      "Punch In",
      "Punch Out",
      "Total Hours",
      "Note",
      "Updated At",
      "Updated By Role",
    ];

    attendanceHeaders.forEach(
      (text, col) => {
        addCell(
          row,
          col,
          text,
          headerStyle
        );
      }
    );

    row++;

    // =======================================================
    // DAILY ATTENDANCE DATA
    // =======================================================

    (
      emp.daily_records || []
    ).forEach((record) => {

      // =====================================================
      // ATTENDANCE STATUS
      // =====================================================

      let attendanceStatus =
        record.attendance_status ||
        record.status ||
        "";

      attendanceStatus =
        String(
          attendanceStatus
        )
          .toLowerCase()
          .trim();

      // =====================================================
      // ATTENDANCE TYPE
      // =====================================================

      let attendanceType =
        record.attendance_type ||
        record.payment_type ||
        record.day_limit ||
        "";

      attendanceType =
        String(
          attendanceType
        )
          .toLowerCase()
          .trim();

      // =====================================================
      // DISPLAY STATUS / TYPE
      // =====================================================

      let displayStatus = "—";
      let displayType = "—";

      // -----------------------------------------------------
      // PRESENT
      // -----------------------------------------------------

      if (
        attendanceStatus === "present" ||
        record.first_punch_in
      ) {
        displayStatus = "Present";

        displayType =
          attendanceType === "unpaid"
            ? "Unpaid"
            : "Paid";
      }

      // -----------------------------------------------------
      // ABSENT
      // -----------------------------------------------------

      else if (
        attendanceStatus === "absent"
      ) {
        displayStatus = "Absent";

        displayType =
          attendanceType === "paid"
            ? "Paid"
            : "Unpaid";
      }

      // -----------------------------------------------------
      // PAID ABSENT
      // -----------------------------------------------------

      else if (
        attendanceStatus ===
          "paid absent" ||
        attendanceStatus ===
          "paid_absent"
      ) {
        displayStatus = "Absent";
        displayType = "Paid";
      }

      // -----------------------------------------------------
      // FALLBACK
      // -----------------------------------------------------

      else {
        displayStatus =
          record.status || "—";

        displayType =
          attendanceType === "paid"
            ? "Paid"
            : attendanceType === "unpaid"
            ? "Unpaid"
            : "—";
      }

      // =====================================================
      // NOTE
      // =====================================================

      const note =
        record.note ||
        record.remark ||
        "-";

      // =====================================================
      // UPDATED AT
      // =====================================================

      let updatedAt =
        record.updated_at || "-";

      if (
        updatedAt !== "-" &&
        updatedAt !== null &&
        updatedAt !== undefined
      ) {
        const updatedDate =
          new Date(updatedAt);

        if (
          !isNaN(
            updatedDate.getTime()
          )
        ) {
          updatedAt =
            updatedDate.toLocaleString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            );
        }
      }

      // =====================================================
      // UPDATED BY ROLE
      // =====================================================

      const updatedByRole =
        record.updated_by_role ||
        "-";

      // =====================================================
      // ADD ROW
      // =====================================================

      // 0 - DATE
      addCell(
        row,
        0,
        record.date || "-",
        dataStyle
      );

      // 1 - ATTENDANCE STATUS
      addCell(
        row,
        1,
        displayStatus,
        dataStyle
      );

      // 2 - ATTENDANCE TYPE
      addCell(
        row,
        2,
        displayType,
        dataStyle
      );

      // 3 - PUNCH IN
      addCell(
        row,
        3,
        record.first_punch_in || "-",
        dataStyle
      );

      // 4 - PUNCH OUT
      addCell(
        row,
        4,
        record.last_punch_out || "-",
        dataStyle
      );

      // 5 - TOTAL HOURS
      addCell(
        row,
        5,
        record.total_hours !== null &&
        record.total_hours !== undefined
          ? record.total_hours
          : "-",
        dataStyle
      );

      // 6 - NOTE
      addCell(
        row,
        6,
        note,
        dataStyle
      );

      // 7 - UPDATED AT
      addCell(
        row,
        7,
        updatedAt,
        dataStyle
      );

      // 8 - UPDATED BY ROLE
      addCell(
        row,
        8,
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

  ws["!ref"] =
    XLSX.utils.encode_range({
      s: {
        r: 0,
        c: 0,
      },
      e: {
        r: row,
        c: 8,
      },
    });

  // =========================================================
  // COLUMN WIDTHS
  // =========================================================

  ws["!cols"] = [
    // 0 - Date
    {
      wch: 18,
    },

    // 1 - Attendance Status
    {
      wch: 20,
    },

    // 2 - Attendance Type
    {
      wch: 20,
    },

    // 3 - Punch In
    {
      wch: 18,
    },

    // 4 - Punch Out
    {
      wch: 18,
    },

    // 5 - Total Hours
    {
      wch: 15,
    },

    // 6 - Note
    {
      wch: 35,
    },

    // 7 - Updated At
    {
      wch: 23,
    },

    // 8 - Updated By Role
    {
      wch: 22,
    },
  ];

  // =========================================================
  // ROW HEIGHTS
  // =========================================================

  ws["!rows"] =
    Array.from(
      {
        length:
          row + 1,
      },
      () => ({
        hpt: 22,
      })
    );

  // =========================================================
  // MERGES
  // =========================================================

  ws["!merges"] =
    merges;

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