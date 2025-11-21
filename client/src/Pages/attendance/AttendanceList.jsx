// src/pages/attendance/AttendanceList.jsx
import React, { useState, useEffect } from "react";
import {
  PageContainer,
  DepartmentGrid,
  DepartmentCard,
  DepartmentHeader,
  DepartmentName,
  EmployeeCount,
  DropdownWrapper,
  DropdownHeader,
  EmployeeList,
  EmployeeItem,
  EmployeeRow,
  EmployeeCell,
  LeftWrapper,
  DepartmentIcon,
} from "./AttendanceList.Styles";
import EmployeeTitle from "../../Components/EmployeeTitle";
import EmployeeIcon from "../../assets/employeeicon.svg";
import { useDispatch, useSelector } from "react-redux";
import { getDepartments } from "../../Redux/departmentSlice";
import { getAttendanceList } from "../../Redux/attendanceSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";
import { ClipLoader } from "react-spinners";

const AttendanceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedDept, setSelectedDept] = useState(null);
  const [departmentAttendance, setDepartmentAttendance] = useState({});
  const [pageByDept, setPageByDept] = useState({});
  const [searchText, setSearchText] = useState("");
  const [loadingDept, setLoadingDept] = useState(false);

  const pageSize = 10;

  const { list: departmentList = [], loading } = useSelector(
    (state) => state.departments
  );

  useEffect(() => {
    dispatch(getDepartments({ page: 1, search: "" }));
  }, [dispatch]);

  // ------------------ TIME HELPERS ---------------------
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

  const parseTimeToTimestamp = (timeStr) => {
    const d = new Date(timeStr);
    return isNaN(d.getTime()) ? NaN : d.getTime();
  };

  const getEarliestTimestamp = (sessions) => {
    const times = (sessions || [])
      .map((s) => parseTimeToTimestamp(s.time_in))
      .filter((t) => !isNaN(t));
    return times.length ? Math.min(...times) : Infinity;
  };

  const getEarliestTimeIn = (sessions) => {
    const earliest = getEarliestTimestamp(sessions);
    return isFinite(earliest) ? formatTime(earliest) : "-";
  };

  const getConditionalTimeOut = (sessions) => {
    const outs = (sessions || [])
      .map((s) => parseTimeToTimestamp(s.time_out))
      .filter((t) => !isNaN(t));
    return outs.length ? formatTime(Math.max(...outs)) : "-";
  };

  const paginate = (items, page) => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  };

  // ------------------ DATA LOADERS ---------------------
  const groupByEmployee = (records) => {
    const map = {};
    records.forEach((emp) => {
      const id = emp.employee_id;
      if (!map[id]) map[id] = emp;
    });
    return Object.values(map);
  };

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const loadAttendanceForDept = async (deptId) => {
    setLoadingDept(true);
    try {
      const res = await dispatch(getAttendanceList({ department_id: deptId }));
      const results = res?.payload?.results || [];
      const today = getTodayDate();
      const todays = results.filter((e) => e.date === today);
      const unique = groupByEmployee(todays);
      setDepartmentAttendance((p) => ({ ...p, [deptId]: unique }));
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
  };

  const handleRowClick = (id) => navigate(`/attendance/detail/${id}`);

  // ----------------- FILTER + SORT -----------------------
  const processedDepartments = (departmentList || []).map((dept) => {
    const employees = departmentAttendance[dept.id] || [];

    const s = searchText.toLowerCase();
    const matches = employees.filter((e) =>
      (e.employee_name || "").toLowerCase().includes(s)
    );

    const sorted = [...matches].sort((a, b) => {
      const ta = getEarliestTimestamp(a.sessions);
      const tb = getEarliestTimestamp(b.sessions);
      if (ta === tb)
        return (a.employee_name || "").localeCompare(b.employee_name || "");
      return ta - tb;
    });

    return { ...dept, employees: sorted };
  });

  return (
    <PageContainer>
      <EmployeeTitle
        iconSrc={EmployeeIcon}
        onSearchChange={setSearchText}
        showAddButton={false}
        showBackArrow={false}
      />

      {loading ? (
        <Loader />
      ) : (
        <DepartmentGrid>
          {processedDepartments.map((dept) => {
            const isOpen = selectedDept === dept.id;
            const employees = dept.employees || [];

            // PAGINATION VARIABLES
            const currentPage = pageByDept[dept.id] || 1;
            const totalPages = Math.ceil(employees.length / pageSize) || 1;
            const paginated = paginate(employees, currentPage);
            const startIndex = (currentPage - 1) * pageSize;

            return (
              <DepartmentCard key={dept.id}>
                <DepartmentHeader onClick={() => handleToggle(dept.id)}>
                  <LeftWrapper>
                    <DepartmentIcon>{dept.name[0]}</DepartmentIcon>
                    <DepartmentName>{dept.name}</DepartmentName>
                  </LeftWrapper>
                  <EmployeeCount>
                    {dept.attendance_employee_count || 0} Employees
                  </EmployeeCount>
                </DepartmentHeader>

                {isOpen && (
                  <DropdownWrapper>
                    <DropdownHeader>
                      <span>Sl No</span>
                      <span>Name</span>
                      <span>Employee ID</span>
                      <span>In Date</span>
                      <span>In Time</span>
                      <span>Out Time</span>
                    </DropdownHeader>

                    <EmployeeList>
                      {loadingDept ? (
                        <EmployeeItem style={{ textAlign: "center" }}>
                          <ClipLoader size={24} />
                        </EmployeeItem>
                      ) : paginated.length > 0 ? (
                        paginated.map((emp, idx) => {
                          const tIn = getEarliestTimeIn(emp.sessions);
                          const tOut = getConditionalTimeOut(emp.sessions);

                          return (
                            <EmployeeRow
                              key={emp.id}
                              onClick={() => handleRowClick(emp.id)}
                            >
                              <EmployeeCell>{startIndex + idx + 1}</EmployeeCell>
                              <EmployeeCell>
                                {emp.employee_name || "-"}
                              </EmployeeCell>
                              <EmployeeCell>
                                {emp.employee_id || "-"}
                              </EmployeeCell>
                              <EmployeeCell>{emp.date || "-"}</EmployeeCell>
                              <EmployeeCell>{tIn}</EmployeeCell>
                              <EmployeeCell>{tOut}</EmployeeCell>
                            </EmployeeRow>
                          );
                        })
                      ) : (
                        <EmployeeItem>No attendance found for today.</EmployeeItem>
                      )}
                    </EmployeeList>

                    {/* PAGINATION BUTTONS */}
                    {employees.length > pageSize && (
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          padding: "10px",
                        }}
                      >
                        <button
                          disabled={currentPage === 1}
                          onClick={() =>
                            setPageByDept((p) => ({
                              ...p,
                              [dept.id]: currentPage - 1,
                            }))
                          }
                        >
                          Prev
                        </button>

                        <span>
                          Page {currentPage} / {totalPages}
                        </span>

                        <button
                          disabled={currentPage === totalPages}
                          onClick={() =>
                            setPageByDept((p) => ({
                              ...p,
                              [dept.id]: currentPage + 1,
                            }))
                          }
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </DropdownWrapper>
                )}
              </DepartmentCard>
            );
          })}
        </DepartmentGrid>
      )}
    </PageContainer>
  );
};

export default AttendanceList;
