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
  PaginationWrapper,
  PaginationButton,
  PaginationInfo,
} from "./AttendanceList.Styles";
import EmployeeTitle from "../../Components/EmployeeTitle";
import EmployeeIcon from "../../assets/employeeicon.svg";
import { useDispatch, useSelector } from "react-redux";
import { getDepartmentsMin } from "../../Redux/departmentSlice";
import { getAttendanceList } from "../../Redux/attendanceSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";
import { ClipLoader } from "react-spinners";
import { FaAnglesLeft,FaAnglesRight } from "react-icons/fa6";
import NoEmployeeFound from "../../Components/No found/Noemployeefound";
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
  const handleRowClick = (id) => navigate(`/employee-attendance/detail/${id}`);
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

  const formatDate = (date) => {
  if (!date) return "-";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};
  return (
    <PageContainer>
      <EmployeeTitle
        iconSrc={EmployeeIcon}
        showAddButton={false}
        showDropdown={false}
       searchValue={searchText}  
        onSearchChange={setSearchText}
        showBackArrow={false}
        showReportButton={false}
        showTabs={true}
      />
      {loading ? (
        <Loader />
      ) : (
        <DepartmentGrid>
        {departmentsToRender.length === 0 ? (
    <div style={{ 
      width: "100%", 
      display: "flex", 
      justifyContent: "center" 
    }}>
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
                    <DropdownHeader>
                      <span>Sl No</span>
                      <span>Name</span>
                      <span>Employee ID</span>
                      <span>In Date</span>
                      <span>In Time</span>
                      <span>Out Time</span>
                      <span>Status</span>
                    </DropdownHeader>
                    <EmployeeList>
                      {loadingDept ? (
                        <EmployeeItem style={{ textAlign: "center" }}>
                          <ClipLoader size={24} />
                        </EmployeeItem>
                      ) : paginated.length > 0 ? (
                        paginated.map((emp, idx) => {
                          const sessions = emp.sessions || [];
                          const inTimes = sessions
                            .map((s) => parseTimeToTimestamp(s.time_in))
                            .filter((t) => !isNaN(t));

                          const tIn = inTimes.length
                            ? formatTime(Math.min(...inTimes))
                            : "-";

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
                              key={emp.employee}
                              onClick={() => handleRowClick(emp.employee)} >
                              <EmployeeCell>{startIndex + idx + 1}</EmployeeCell>
                              <EmployeeCell>{emp.employee_name || "-"}</EmployeeCell>
                              <EmployeeCell>{emp.employee_id || "-"}</EmployeeCell>
                   <EmployeeCell>{formatDate(emp.date)}</EmployeeCell>
                              <EmployeeCell>{emp.first_swipe_in || tIn}</EmployeeCell>
                              <EmployeeCell>{emp.last_swipe_out || tOut}</EmployeeCell>
                              <EmployeeCell>
                                <span
                                  style={{
                                    color: emp.attendance_today ? "green" : "red",
                                    fontSize: "14px",
                                  }}
                                >
                                  ●
                                </span>
                              </EmployeeCell>
                            </EmployeeRow>
                          );
                        })
                      ) : (
                        <EmployeeItem>No attendance found.</EmployeeItem>
                      )}
                    </EmployeeList>
                   {employees.length > pageSize && (
  <PaginationWrapper>
    <PaginationButton
      disabled={currentPage === 1}
      onClick={() =>
        setPageByDept((p) => ({
          ...p,
          [dept.id]: currentPage - 1,
        }))
      }
    >
<FaAnglesLeft/>
    </PaginationButton>

    <PaginationInfo>
      Page {currentPage} / {totalPages}
    </PaginationInfo>

    <PaginationButton
      disabled={currentPage === totalPages}
      onClick={() =>
        setPageByDept((p) => ({
          ...p,
          [dept.id]: currentPage + 1,
        }))
      }
    >
<FaAnglesRight/>
    </PaginationButton>
  </PaginationWrapper>
)}
                  </DropdownWrapper>
                )}
              </DepartmentCard>
            );
          })
        )}
        </DepartmentGrid>
        
      )}
      
    </PageContainer>
  );
};

export default AttendanceList;