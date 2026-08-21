import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  PageWrapper,
} from "./AttendanceReportStyles";
import EmployeeAttendanceModal from "./EmployeeAttendanceModal";
import { getAttendanceSummary } from "../../Redux/attendanceSlice";
import Pagination from "../../Components/Pagination/Pagination";
import { exportAttendanceExcel } from "../../utils/montlyAttendance";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";
import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";
import { getDepartments } from "../../Redux/departmentSlice";

const AttendanceReport = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth || {});
  const token = auth?.accessToken || auth?.token || "";
  const attendanceState = useSelector((state) => state.attendance || {});
  const attendanceSummary = attendanceState.attendanceSummary?.results || [];
  const summaryLoading = attendanceState.summaryLoading || false;
  const summaryData = attendanceState.attendanceSummary;
  const currentPage = summaryData?.current_page || 1;
  const totalPages = summaryData?.total_pages || 1;

  const [department, setDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [searchTerm, setSearchTerm] = useState("");
const { list: departmentList } = useSelector((state) => state.departments || {});

  const departmentRows = Array.isArray(departmentList?.results)
    ? departmentList.results
    : Array.isArray(departmentList)
      ? departmentList
      : [];

  const departments = useMemo(
    () => departmentRows.map((d) => d.name),
    [departmentRows],
  );
    useEffect(() => {
    dispatch(getDepartments({ page: 1, search: "" }));
  }, [dispatch]);
  
  const getMonthNameFromYYYYMM = (yyyyMM) => {
    if (!yyyyMM) return "";
    const d = new Date(`${yyyyMM}-01T00:00:00`);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString("default", { month: "long" });
  };

  const selectedMonthName = useMemo(
    () => getMonthNameFromYYYYMM(selectedMonth),
    [selectedMonth]
  );

  useEffect(() => {
    if (!selectedMonth || !token) return;
    const [year, month] = selectedMonth.split("-");
    dispatch(
      getAttendanceSummary({
        year: Number(year),
        month: Number(month),
        page: 1,
        token,
      })
    );
  }, [selectedMonth, dispatch, token]);

  // ReusableTable needs a unique `id` per row — the API gives us employee_id
  const visibleRows = useMemo(() => {
    if (!Array.isArray(attendanceSummary)) return [];

    const q = searchTerm.trim().toLowerCase();

    return attendanceSummary
      .filter((emp) => {
        const matchSearch = emp.employee_name
          .toLowerCase()
          .includes(q);

        const matchDepartment =
          department === "" || emp.department === department;

        return matchSearch && matchDepartment;
      })
      .sort((a, b) =>
        a.employee_name.localeCompare(b.employee_name)
      )
      .map((emp) => ({
        ...emp,
        id: emp.employee_id,
      }));
  }, [attendanceSummary, searchTerm, department]);

  const handleRowClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handlePageChange = (page) => {
    if (!selectedMonth || !token) return;
    const [year, month] = selectedMonth.split("-");
    dispatch(
      getAttendanceSummary({
        year: Number(year),
        month: Number(month),
        page,
        token,
      })
    );
  };



  const handleDownloadExcel = () => {
    exportAttendanceExcel(summaryData.results, selectedMonth);
  };

  const getLop = (row) => row.lop_days ?? row.lop ?? 0;

  // Column config replaces the old <thead>/<tbody> markup 1:1
  const columns = [
    {
      header: "Sl No.",
      accessor: "slNo",
      sortable: false,
      render: (row, index) => index + 1 + (currentPage - 1) * 20,
    },
   
     {
      header: "Employee name",
      accessor: "employee_name",
      render: (row) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 600 }}>
            {row.employee_name ? row.employee_name.charAt(0).toUpperCase() + row.employee_name.slice(1) : ""}
          </span>
          <span style={{ fontSize: 12, color: "#888" }}>{row.employee_id}</span>
        </div>
      ),
    },
    {
      header: "Department",
      accessor: "department",
    },
    {
      header: "Month",
      accessor: "month",
      sortable: false,
      render: () => selectedMonthName,
    },
    {
      header: "Total Working Days",
      accessor: "working_days",
      render: (row) => row.working_days ?? row.workingDays ?? "-",
    },
    {
      header: "Present",
      accessor: "present_days",
      render: (row) => row.present_days ?? row.present ?? "-",
    },
    {
      header: "Absent",
      accessor: "absent_days",
      render: (row) => row.absent_days ?? row.absent ?? "-",
    },
    {
      header: "Loss of Pay",
      accessor: "lop",
      render: (row) => {
        const lop = getLop(row);
        return (
          <span style={{ color: lop > 0 ? "#e53935" : "inherit", fontWeight: lop > 0 ? 600 : 400 }}>
            {lop}
          </span>
        );
      },
    },
  ];

  return (
    <Container>
      <ReusableHeader
        title="Employees Attendance Report"
        breadcrumbs={["Employees", "Employees Attendance Report"]}
        buttonText="📊 Monthly Report (Excel)"
        onButtonClick={handleDownloadExcel}
      />
      <ReusableFilter
        search={searchTerm}
        onSearch={setSearchTerm}
        searchPlaceholder="Search Employee Name"

        department={department}
        departments={departments}
        onDepartment={setDepartment}

        date={selectedMonth}
        onDate={setSelectedMonth}

        showSearch
        showDepartment
        showDate
      />
      <PageWrapper>
 
          <ReusableTable
            columns={columns}
            data={visibleRows}
            loading={summaryLoading}
            onRowClick={handleRowClick}
          />
      

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </PageWrapper>

      <EmployeeAttendanceModal
        employee={selectedEmployee}
        monthName={selectedMonthName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Container>
  );
};

export default AttendanceReport;