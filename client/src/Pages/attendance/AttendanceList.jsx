
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
import {
  getAttendanceList,
  searchAttendanceEmployees,
} from "../../Redux/attendanceSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";
import { ClipLoader } from "react-spinners";

const AttendanceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedDept, setSelectedDept] = useState(null);
  const [departmentAttendance, setDepartmentAttendance] = useState({});

  const { searchResults, searchLoading } = useSelector(
    (state) => state.attendance
  );

  const { list: departmentList = [], loading } = useSelector(
    (state) => state.departments
  );

  useEffect(() => {
    dispatch(getDepartments({ page: 1, search: "" }));
  }, [dispatch]);

  // Search Handler
  const handleSearch = (value) => {
    if (value.trim() === "") {
  dispatch(searchAttendanceEmployees("clear"));
  return;
}
    dispatch(searchAttendanceEmployees(value));
  };

  const handleToggle = async (deptId, employeesFromSearch) => {
    if (selectedDept === deptId) {
      setSelectedDept(null);
      return;
    }

    setSelectedDept(deptId);

    // If search is active, do not fetch attendance
    if (searchResults.length > 0) {
      setDepartmentAttendance((prev) => ({
        ...prev,
        [deptId]: employeesFromSearch,
      }));
      return;
    }

    // Normal mode
    const response = await dispatch(getAttendanceList({ department_id: deptId }));
    const results = response?.payload?.results || [];
    setDepartmentAttendance((prev) => ({ ...prev, [deptId]: results }));
  };

  // restructure search results → group by department
  const groupedSearch = {};
  if (searchResults?.length > 0) {
    searchResults.forEach((emp) => {
      const deptId = emp.department?.id;
      if (!deptId) return;
      if (!groupedSearch[deptId]) groupedSearch[deptId] = [];
      groupedSearch[deptId].push(emp);
    });
  }

  // Final department list (filtered by search)
  const visibleDepartments =
  searchResults.length > 0
    ? Object.keys(groupedSearch).map((deptId) => {
        // find existing department OR build one from search result
        return (
          departmentList.find((d) => d.id === Number(deptId)) || {
            id: Number(deptId),
            name: groupedSearch[deptId][0]?.department?.name || "Unknown Dept",
          }
        );
      })
    : departmentList;


  return (
    <PageContainer>
      <EmployeeTitle
        iconSrc={EmployeeIcon}
        showAddButton={false}
        showDropdown={false}
        showBackArrow={false}
        onSearchChange={handleSearch}
      />

      {loading ? (
        <Loader />
      ) : (
        <DepartmentGrid>
          {visibleDepartments.length > 0 ? (
            visibleDepartments.map((dept) => {
              const isOpen = selectedDept === dept.id;

              const employees = searchResults.length
                ? groupedSearch[dept.id] || []
                : departmentAttendance[dept.id] || [];

              return (
                <DepartmentCard key={dept.id}>
                  <DepartmentHeader
                    onClick={() =>
                      handleToggle(dept.id, groupedSearch[dept.id] || [])
                    }
                  >
                    <DepartmentName>{dept.name}</DepartmentName>
                    <EmployeeCount>
                      {searchResults.length
                        ? groupedSearch[dept.id]?.length
                        : dept.attendance_employee_count}
                      {" "}Employees
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
                        {searchLoading ? (
                          <ClipLoader size={24} color="#003366" />
                        ) : employees.length > 0 ? (
                          employees.map((emp) => (
                            <EmployeeRow
                              key={emp.id}
                              onClick={() => navigate(`/attendance/detail/${emp.id}`)}
                              style={{ cursor: "pointer" }}
                            >
                              <EmployeeCell>{emp.employee_name}</EmployeeCell>
                              <EmployeeCell>{emp.employee_id}</EmployeeCell>
                              <EmployeeCell>{emp.date || "-"}</EmployeeCell>
                              <EmployeeCell>{emp.time_in || "-"}</EmployeeCell>
                              <EmployeeCell>{emp.time_out || "-"}</EmployeeCell>
                            </EmployeeRow>
                          ))
                        ) : (
                          <EmployeeItem>No records found.</EmployeeItem>
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
