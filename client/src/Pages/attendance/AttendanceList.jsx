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

  const paginate = (items, page) => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  };

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

  // ----------------- FILTER + SEARCH -----------------------
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  useEffect(() => {
    const fetchAndFilter = async () => {
      if (!searchText) {
        setFilteredDepartments(
          departmentList.map((dept) => ({
            ...dept,
            employees: departmentAttendance[dept.id] || [],
          }))
        );
        return;
      }

      const promises = departmentList.map(async (dept) => {
        if (!departmentAttendance[dept.id]) {
          await loadAttendanceForDept(dept.id);
        }
      });

      await Promise.all(promises);

      const filtered = departmentList
        .map((dept) => {
          const employees = departmentAttendance[dept.id] || [];
          const matches = employees.filter((e) =>
            (e.employee_name || "")
              .toLowerCase()
              .includes(searchText.toLowerCase())
          );
          return { ...dept, employees: matches };
        })
        .filter((dept) => dept.employees.length > 0);

      setFilteredDepartments(filtered);
    };

    fetchAndFilter();
  }, [searchText, departmentList, departmentAttendance]);

  const departmentsToRender = searchText
    ? filteredDepartments
    : departmentList.map((dept) => ({
        ...dept,
        employees: departmentAttendance[dept.id] || [],
      }));

  return (
    <PageContainer>
      <EmployeeTitle
        iconSrc={EmployeeIcon}
        showAddButton={false}
        showDropdown={false}
        onSearchChange={setSearchText}
        showBackArrow={false}
      />

      {loading ? (
        <Loader />
      ) : (
        <DepartmentGrid>
          {departmentsToRender.map((dept) => {
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
                    <DepartmentIcon>{dept.name[0]}</DepartmentIcon>
                    <DepartmentName>{dept.name}</DepartmentName>
                  </LeftWrapper>
                  <EmployeeCount>
                    {searchText
                      ? dept.employees?.length || 0
                      : dept.attendance_employee_count || 0}{" "}
                    Employees
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
                          const sessions = emp.sessions || [];

                          // First punch in
                          const inTimes = sessions
                            .map((s) => parseTimeToTimestamp(s.time_in))
                            .filter((t) => !isNaN(t));
                          const tIn = inTimes.length
                            ? formatTime(Math.min(...inTimes))
                            : "-";

                          // Last punch out or '---' if last action is punch in
                          let tOut = "-";
                          if (sessions.length > 0) {
                            const lastSession = sessions[sessions.length - 1];
                            tOut =
                              lastSession.time_out && lastSession.time_out !== ""
                                ? formatTime(parseTimeToTimestamp(lastSession.time_out))
                                : "---";
                          }

                          return (
                            <EmployeeRow
                              key={emp.id}
                              onClick={() => handleRowClick(emp.id)}
                            >
                              <EmployeeCell>{startIndex + idx + 1}</EmployeeCell>
                              <EmployeeCell>{emp.employee_name || "-"}</EmployeeCell>
                              <EmployeeCell>{emp.employee_id || "-"}</EmployeeCell>
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
