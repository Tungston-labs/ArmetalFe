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
} from "./AttendanceList.Styles";
import EmployeeTitle from "../../Components/EmployeeTitle";
import EmployeeIcon from "../../assets/employeeicon.svg";
import { useDispatch, useSelector } from "react-redux";
import { getDepartments } from "../../Redux/departmentSlice";
import { getAttendanceList } from "../../Redux/attendanceSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";

const AttendanceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState(null);
  const [departmentAttendance, setDepartmentAttendance] = useState({});
  const [searchText, setSearchText] = useState(""); // 🔍 added search state

  const { list: departmentList, loading } = useSelector(
    (state) => state.departments
  );

  // Fetch departments on mount
  useEffect(() => {
    dispatch(getDepartments({ page: 1, search: "" }));
  }, [dispatch]);

  // Format time for display
  const formatTime = (datetimeStr) => {
    if (!datetimeStr) return "-";
    try {
      const date = new Date(datetimeStr);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "-";
    }
  };

  const getEarliestTimeIn = (sessions) => {
    if (!sessions?.length) return "-";
    const validSessions = sessions.filter((s) => s.time_in);
    if (!validSessions.length) return "-";
    const earliest = validSessions.reduce((a, b) =>
      a.time_in < b.time_in ? a : b
    );
    return formatTime(earliest.time_in);
  };

  const getConditionalTimeOut = (sessions) => {
    if (!sessions?.length) return "-";
    const sorted = [...sessions].sort((a, b) =>
      a.time_in > b.time_in ? 1 : -1
    );
    const lastSession = sorted[sorted.length - 1];
    if (lastSession.time_in && !lastSession.time_out) {
      return "---";
    }
    const validOutSessions = sorted.filter((s) => s.time_out);
    if (!validOutSessions.length) return "-";
    const latest = validOutSessions.reduce((a, b) =>
      a.time_out > b.time_out ? a : b
    );
    return formatTime(latest.time_out);
  };

  const groupByEmployee = (records) => {
    const map = {};
    records.forEach((emp) => {
      const id = emp.employee_id;
      if (!map[id]) {
        map[id] = emp;
      } else {
        const currentDate = new Date(map[id].date);
        const newDate = new Date(emp.date);
        if (newDate > currentDate) map[id] = emp;
      }
    });
    return Object.values(map);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleToggle = async (deptId) => {
    if (selectedDept === deptId) {
      setSelectedDept(null);
    } else {
      setSelectedDept(deptId);
      if (!departmentAttendance[deptId]) {
        const response = await dispatch(
          getAttendanceList({ department_id: deptId })
        );
        const results = response?.payload?.results || [];
        const today = getTodayDate();
        const todaysRecords = results.filter((emp) => emp.date === today);
        const filtered = todaysRecords.filter((emp) => {
          const empDeptId = emp.department_id || emp.department?.id;
          return !empDeptId || empDeptId === deptId;
        });
        const uniqueEmployees = groupByEmployee(filtered);
        setDepartmentAttendance((prev) => ({
          ...prev,
          [deptId]: uniqueEmployees,
        }));
      }
    }
  };

  const handleRowClick = (id) => {
    navigate(`/attendance/detail/${id}`);
  };

  // 🔍 Filter departments by search text
  const filteredDepartments = departmentList?.filter((dept) =>
    dept.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <PageContainer>
      <EmployeeTitle
        iconSrc={EmployeeIcon}
        showAddButton={false}
        showDropdown={false}
        showBackArrow={false}
        onSearchChange={setSearchText} // ✅ this now works
      />

      {loading ? (
        <Loader />
      ) : (
        <DepartmentGrid>
          {filteredDepartments?.length > 0 ? (
            filteredDepartments.map((dept) => {
              const isOpen = selectedDept === dept.id;
              const employees = departmentAttendance[dept.id] || [];

              return (
                <DepartmentCard key={dept.id}>
                  <DepartmentHeader onClick={() => handleToggle(dept.id)}>
                    <DepartmentName>{dept.name || "Department"}</DepartmentName>
                    <EmployeeCount>
                      {dept.attendance_employee_count || 0} Employees
                    </EmployeeCount>
                  </DepartmentHeader>

                  {isOpen && (
                    <DropdownWrapper>
                      <DropdownHeader>
                        <span>Name</span>
                        <span>Employee ID</span>
                        <span>In Date</span>
                        <span>In Time</span>
                        <span>Out Time</span>
                      </DropdownHeader>

                      <EmployeeList>
                        {employees.length > 0 ? (
                          employees.map((emp) => {
                            const sessions = emp.sessions || [];
                            const timeIn = getEarliestTimeIn(sessions);
                            const timeOut = getConditionalTimeOut(sessions);

                            return (
                              <EmployeeRow
                                key={emp.id}
                                onClick={() => handleRowClick(emp.id)}
                                style={{ cursor: "pointer" }}
                              >
                                <EmployeeCell>
                                  {emp.employee_name || "-"}
                                </EmployeeCell>
                                <EmployeeCell>
                                  {emp.employee_id || "-"}
                                </EmployeeCell>
                                <EmployeeCell>{emp.date || "-"}</EmployeeCell>
                                <EmployeeCell>{timeIn}</EmployeeCell>
                                <EmployeeCell>{timeOut}</EmployeeCell>
                              </EmployeeRow>
                            );
                          })
                        ) : (
                          <EmployeeItem>
                            No attendance record found for today.
                          </EmployeeItem>
                        )}
                      </EmployeeList>
                    </DropdownWrapper>
                  )}
                </DepartmentCard>
              );
            })
          ) : (
            <p>No departments found.</p>
          )}
        </DepartmentGrid>
      )}
    </PageContainer>
  );
};

export default AttendanceList;
