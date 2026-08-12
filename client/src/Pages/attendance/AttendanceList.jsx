import React, { useState, useEffect } from "react";
import {
  PageContainer,
  DepartmentGrid,
  DepartmentCard,
  DepartmentHeader,
  DepartmentName,
  EmployeeCount,
  DropdownWrapper,
  LeftWrapper,
  DepartmentIcon,
} from "./AttendanceList.Styles";
import { useDispatch, useSelector } from "react-redux";
import { getDepartmentsMin } from "../../Redux/departmentSlice";
import { getAttendanceList } from "../../Redux/attendanceSlice";
import { useNavigate } from "react-router-dom";
import NoEmployeeFound from "../../Components/No found/Noemployeefound";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";
import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../Components/Pagination/ReusablePagination";


const AttendanceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedDept, setSelectedDept] = useState(null);
  const [departmentAttendance, setDepartmentAttendance] = useState({});
  const [pageByDept, setPageByDept] = useState({});
  const [searchText, setSearchText] = useState("");
  const [loadingDept, setLoadingDept] = useState(false);

  const pageSize = 10;

  const { minList: departmentList = [], loading } = useSelector(
    (state) => state.departments
  );

  const handleRowClick = (row) =>
    navigate(`/employee-attendance/detail/${row.employee}`);

  useEffect(() => {
    dispatch(getDepartmentsMin({ page: 1, search: "" }));
  }, [dispatch]);

  const parseTimeToTimestamp = (timeStr) => {
    const d = new Date(timeStr);
    return isNaN(d.getTime()) ? NaN : d.getTime();
  };

  const formatTime = (datetimeStr) => {
    if (!datetimeStr) return "-";
    try {
      const date = new Date(datetimeStr);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const paginate = (items, page) => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  };

  const loadAttendanceForDept = async (deptId) => {
    setLoadingDept(true);
    try {
      const res = await dispatch(getAttendanceList({ department_id: deptId }));
      const data = res?.payload || {};

      setDepartmentAttendance((p) => ({
        ...p,
        [deptId]: data.results || [],
      }));
    } finally {
      setLoadingDept(false);
    }
  };

  const handleToggle = async (deptId) => {
    if (selectedDept === deptId) {
      setSelectedDept(null);
      return;
    }

    setSelectedDept(deptId);
    setPageByDept((prev) => ({ ...prev, [deptId]: 1 }));
    if (!departmentAttendance[deptId]) {
      await loadAttendanceForDept(deptId);
    }

    // Normal mode
    const response = await dispatch(getAttendanceList({ department_id: deptId }));
    const results = response?.payload?.results || [];
    setDepartmentAttendance((prev) => ({ ...prev, [deptId]: results }));
  };

  const departmentsToRender = departmentList
    .filter((dept) =>
      dept.name?.toLowerCase().includes(searchText.toLowerCase())
    )
    .map((dept) => ({
      ...dept,
      employees: departmentAttendance[dept.id] || [],
    }));

  // Columns for ReusableTable
  const getColumns = (startIndex) => [
    {
      header: "Sl No",
      accessor: "slNo",
      sortable: false,
      render: (row, idx) => startIndex + idx + 1,
    },
    {
      header: "Name",
      accessor: "employee_name",
      render: (row) => row.employee_name || "-",
    },
    {
      header: "Employee ID",
      accessor: "employee_id",
      render: (row) => row.employee_id || "-",
    },
    {
      header: "In Date",
      accessor: "date",
      render: (row) => formatDate(row.date),
    },
    {
      header: "In Time",
      accessor: "first_swipe_in",
      sortable: false,
      render: (row) => {
        const sessions = row.sessions || [];
        const inTimes = sessions
          .map((s) => parseTimeToTimestamp(s.time_in))
          .filter((t) => !isNaN(t));
        const tIn = inTimes.length ? formatTime(Math.min(...inTimes)) : "-";
        return row.first_swipe_in || tIn;
      },
    },
    {
      header: "Out Time",
      accessor: "last_swipe_out",
      sortable: false,
      render: (row) => {
        const sessions = row.sessions || [];
        let tOut = "-";
        if (sessions.length > 0) {
          const lastSession = sessions[sessions.length - 1];
          tOut =
            lastSession.time_out && lastSession.time_out !== ""
              ? formatTime(parseTimeToTimestamp(lastSession.time_out))
              : "---";
        }
        return row.last_swipe_out || tOut;
      },
    },
    {
      header: "Status",
      accessor: "attendance_today",
      sortable: false,
      render: (row) => (
        <span
          style={{
            color: row.attendance_today ? "green" : "red",
            fontSize: "14px",
          }}
        >
          ●
        </span>
      ),
    },
  ];

  return (
    <PageContainer>
      <ReusableHeader
        title="Employee Attendance"
        breadcrumbs={["Employees", "Employee Attendance"]}
      />

      <DepartmentGrid>
        {departmentsToRender.length === 0 ? (
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <NoEmployeeFound searchTerm={searchText} />
          </div>
        ) : (
          departmentsToRender.map((dept) => {
            const isOpen = selectedDept === dept.id;
            const employees = dept.employees || [];

            const currentPage = pageByDept[dept.id] || 1;
            const totalPages = Math.ceil(employees.length / pageSize) || 1;
            const paginated = paginate(employees, currentPage);
            const startIndex = (currentPage - 1) * pageSize;

            return (
              <DepartmentCard key={dept.id}>
                <DepartmentHeader onClick={() => handleToggle(dept.id)}>
                  <LeftWrapper>
                    <DepartmentIcon>{dept.name?.[0]}</DepartmentIcon>
                    <DepartmentName>{dept.name}</DepartmentName>
                  </LeftWrapper>
                  <EmployeeCount>
                    {dept.swiped_employee_count || 0} / {dept.total_employee_count || 0} Swiped
                  </EmployeeCount>
                </DepartmentHeader>

                {isOpen && (
                  <DropdownWrapper>
                    <ReusableTable
                      columns={getColumns(startIndex)}
                      data={paginated.map((emp) => ({ ...emp, id: emp.employee }))}
                      loading={loadingDept}
                      onRowClick={handleRowClick}
                    />

                    <ReusablePagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) =>
                        setPageByDept((p) => ({
                          ...p,
                          [dept.id]: page,
                        }))
                      }
                    />
                  </DropdownWrapper>
                )}
              </DepartmentCard>
            );
          })
        )}
      </DepartmentGrid>
    </PageContainer>
  );
};

export default AttendanceList;