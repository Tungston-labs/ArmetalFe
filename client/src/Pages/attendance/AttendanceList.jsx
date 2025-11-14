// // src/pages/attendance/AttendanceList.jsx
// import React, { useState, useEffect } from "react";
// import {
//   PageContainer,
//   DepartmentGrid,
//   DepartmentCard,
//   DepartmentHeader,
//   DepartmentName,
//   EmployeeCount,
//   DropdownWrapper,
//   DropdownHeader,
//   EmployeeList,
//   EmployeeItem,
//   EmployeeRow,
//   EmployeeCell,
// } from "./AttendanceList.Styles";
// import EmployeeTitle from "../../Components/EmployeeTitle";
// import EmployeeIcon from "../../assets/employeeicon.svg";
// import { useDispatch, useSelector } from "react-redux";
// import { getDepartments } from "../../Redux/departmentSlice";
// import { getAttendanceList } from "../../Redux/attendanceSlice";
// import { useNavigate } from "react-router-dom";
// import Loader from "../../Components/Loader";
// import { ClipLoader } from "react-spinners";

// const AttendanceList = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [selectedDept, setSelectedDept] = useState(null);
//   const [departmentAttendance, setDepartmentAttendance] = useState({});
//   const [searchText, setSearchText] = useState("");
//   const [loadingDept, setLoadingDept] = useState(false);

//   const { list: departmentList = [], loading } = useSelector(
//     (state) => state.departments
//   );

//   useEffect(() => {
//     dispatch(getDepartments({ page: 1, search: "" }));
//   }, [dispatch]);

//   const formatTime = (datetimeStr) => {
//     if (!datetimeStr) return "-";
//     try {
//       const date = new Date(datetimeStr);
//       if (isNaN(date.getTime())) {
//         // try treat as HH:MM
//         const today = new Date();
//         const maybe = new Date(`${today.toISOString().split("T")[0]}T${datetimeStr}`);
//         if (!isNaN(maybe.getTime())) return maybe.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
//         return "-";
//       }
//       return date.toLocaleTimeString("en-US", {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//       });
//     } catch {
//       return "-";
//     }
//   };

//   // returns earliest time string formatted for display (existing)
//   const getEarliestTimeIn = (sessions) => {
//     if (!sessions?.length) return "-";
//     const validSessions = sessions.filter((s) => s.time_in);
//     if (!validSessions.length) return "-";
//     // find earliest by timestamp
//     let earliestTs = Infinity;
//     let earliestVal = null;
//     validSessions.forEach((s) => {
//       const ts = parseTimeToTimestamp(s.time_in);
//       if (!isNaN(ts) && ts < earliestTs) {
//         earliestTs = ts;
//         earliestVal = s.time_in;
//       }
//     });
//     return earliestVal ? formatTime(earliestVal) : "-";
//   };

//   // helper: parse time string to timestamp (ms). Supports ISO datetimes and "HH:MM" times.
//   const parseTimeToTimestamp = (timeStr) => {
//     if (!timeStr) return NaN;
//     // if looks like ISO or contains 'T' or '-' or 'Z'
//     if (/[TtZz\-]/.test(timeStr)) {
//       const d = new Date(timeStr);
//       return isNaN(d.getTime()) ? NaN : d.getTime();
//     }
//     // assume HH:MM (possibly HH:MM:SS)
//     const today = new Date();
//     const iso = `${today.toISOString().split("T")[0]}T${timeStr}${timeStr.includes("Z") ? "" : ""}`;
//     const d = new Date(iso);
//     return isNaN(d.getTime()) ? NaN : d.getTime();
//   };

//   // For sorting: get earliest punch-in timestamp (ms). Return Infinity if none.
//   const getEarliestTimestamp = (sessions) => {
//     if (!sessions?.length) return Infinity;
//     const valid = sessions
//       .map((s) => parseTimeToTimestamp(s.time_in))
//       .filter((ts) => !isNaN(ts));
//     if (!valid.length) return Infinity;
//     return Math.min(...valid);
//   };

//   const getConditionalTimeOut = (sessions) => {
//     if (!sessions?.length) return "-";
//     const sorted = [...sessions].sort((a, b) => {
//       const ta = parseTimeToTimestamp(a.time_in) || 0;
//       const tb = parseTimeToTimestamp(b.time_in) || 0;
//       return ta - tb;
//     });
//     const lastSession = sorted[sorted.length - 1];
//     if (lastSession.time_in && !lastSession.time_out) {
//       return "---";
//     }
//     const validOutSessions = sorted.filter((s) => s.time_out);
//     if (!validOutSessions.length) return "-";
//     // latest out
//     let latestTs = -Infinity;
//     let latestVal = null;
//     validOutSessions.forEach((s) => {
//       const ts = parseTimeToTimestamp(s.time_out);
//       if (!isNaN(ts) && ts > latestTs) {
//         latestTs = ts;
//         latestVal = s.time_out;
//       }
//     });
//     return latestVal ? formatTime(latestVal) : "-";
//   };

//   const groupByEmployee = (records) => {
//     const map = {};
//     records.forEach((emp) => {
//       const id = emp.employee_id;
//       if (!map[id]) {
//         map[id] = emp;
//       } else {
//         const currentDate = new Date(map[id].date);
//         const newDate = new Date(emp.date);
//         if (newDate > currentDate) map[id] = emp;
//       }
//     });
//     return Object.values(map);
//   };

//   const getTodayDate = () => {
//     const today = new Date();
//     return today.toISOString().split("T")[0];
//   };

//   // load attendance for a department (used by toggle + explicit load button)
//   const loadAttendanceForDept = async (deptId) => {
//     setLoadingDept(true);
//     try {
//       const response = await dispatch(getAttendanceList({ department_id: deptId }));
//       const results = response?.payload?.results || [];
//       const today = getTodayDate();
//       const todaysRecords = results.filter((emp) => emp.date === today);
//       const filtered = todaysRecords.filter((emp) => {
//         const empDeptId = emp.department_id || emp.department?.id;
//         return !empDeptId || empDeptId === deptId;
//       });
//       const uniqueEmployees = groupByEmployee(filtered);
//       setDepartmentAttendance((prev) => ({ ...prev, [deptId]: uniqueEmployees }));
//     } catch (err) {
//       console.error("Error fetching attendance:", err);
//     } finally {
//       setLoadingDept(false);
//     }
//   };

//   const handleToggle = async (deptId) => {
//     if (selectedDept === deptId) {
//       setSelectedDept(null);
//       return;
//     }
//     setSelectedDept(deptId);
//     // fetch only if not loaded
//     if (!departmentAttendance[deptId]) {
//       await loadAttendanceForDept(deptId);
//     }
//   };

//   const handleRowClick = (id) => {
//     navigate(`/attendance/detail/${id}`);
//   };

//   // Build data structure that contains employee list filtered by searchText.
//   // Departments are visible if department name matches or any employee matches the search.
//   const filteredData = (departmentList || []).map((dept) => {
//     const employeeList = departmentAttendance[dept.id] || [];

//     // If search empty -> show all employees (if loaded). If not loaded and no search, show empty employees until expanded.
//     const search = (searchText || "").trim().toLowerCase();

//     // matching employees by name (case-insensitive)
//     const matchingEmployees = search
//       ? employeeList.filter((emp) =>
//           (emp.employee_name || "").toLowerCase().includes(search)
//         )
//       : employeeList;

//     // whether the department name itself matches search
//     const departmentMatches = (dept.name || "").toLowerCase().includes(search);

//     // employees sorted ascending by earliest punch-in time (earliest first).
//     // Employees without punch-in are pushed to the end.
//     const sortedEmployees = [...matchingEmployees].sort((a, b) => {
//       const ta = getEarliestTimestamp(a.sessions || []);
//       const tb = getEarliestTimestamp(b.sessions || []);
//       if (ta === tb) {
//         return (a.employee_name || "").localeCompare(b.employee_name || "");
//       }
//       // Infinity (no punch) goes to end
//       return ta - tb;
//     });

//     return {
//       ...dept,
//       employees: sortedEmployees,
//       isVisible:
//         search === "" || departmentMatches || sortedEmployees.length > 0,
//       departmentMatches,
//       hasLoadedEmployees: !!departmentAttendance[dept.id],
//     };
//   });

//   const finalDepartments = filteredData.filter((d) => d.isVisible);

//   return (
//     <PageContainer>
//       <EmployeeTitle
//         iconSrc={EmployeeIcon}
//         showAddButton={false}
//         showDropdown={false}
//         showBackArrow={false}
//         onSearchChange={setSearchText}
//       />

//       {loading ? (
//         <Loader />
//       ) : (
//         <DepartmentGrid>
//           {finalDepartments?.length > 0 ? (
//             finalDepartments.map((dept) => {
//               const isOpen = selectedDept === dept.id;
//               const employees = dept.employees || [];

//               return (
//                 <DepartmentCard key={dept.id}>
//                   <DepartmentHeader onClick={() => handleToggle(dept.id)}>
//                     <DepartmentName>{dept.name || "Department"}</DepartmentName>
//                     <EmployeeCount>
//                       {dept.attendance_employee_count ?? 0} Employees
//                     </EmployeeCount>
//                   </DepartmentHeader>

//                   {isOpen && (
//                     <DropdownWrapper>
//                       <DropdownHeader>
//                         <span>Name</span>
//                         <span>Employee ID</span>
//                         <span>In Date</span>
//                         <span>In Time</span>
//                         <span>Out Time</span>
//                       </DropdownHeader>

//                       <EmployeeList>
//                         {loadingDept ? (
//                           <EmployeeItem style={{ textAlign: "center", padding: "1rem" }}>
//                             <ClipLoader size={24} color="#003366" />
//                           </EmployeeItem>
//                         ) : employees.length > 0 ? (
//                           employees.map((emp) => {
//                             const sessions = emp.sessions || [];
//                             const timeIn = getEarliestTimeIn(sessions);
//                             const timeOut = getConditionalTimeOut(sessions);

//                             return (
//                               <EmployeeRow
//                                 key={emp.id}
//                                 onClick={() => handleRowClick(emp.id)}
//                                 style={{ cursor: "pointer" }}
//                               >
//                                 <EmployeeCell>{emp.employee_name || "-"}</EmployeeCell>
//                                 <EmployeeCell>{emp.employee_id || "-"}</EmployeeCell>
//                                 <EmployeeCell>{emp.date || "-"}</EmployeeCell>
//                                 <EmployeeCell>{timeIn}</EmployeeCell>
//                                 <EmployeeCell>{timeOut}</EmployeeCell>
//                               </EmployeeRow>
//                             );
//                           })
//                         ) : (
//                           <EmployeeItem style={{ textAlign: "center", padding: "1rem" }}>
//                             {dept.hasLoadedEmployees ? (
//                               "No attendance record found for today."
//                             ) : searchText.trim() ? (
//                               <div>
//                                 <div>No loaded attendance for this department yet.</div>
//                                 <div style={{ marginTop: 8 }}>
//                                   <button
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       loadAttendanceForDept(dept.id);
//                                     }}
//                                     style={{
//                                       padding: "6px 10px",
//                                       borderRadius: 6,
//                                       border: "1px solid #d1d5db",
//                                       background: "#fff",
//                                       cursor: "pointer",
//                                     }}
//                                   >
//                                     Load employees
//                                   </button>
//                                 </div>
//                               </div>
//                             ) : (
//                               "No attendance record found for today."
//                             )}
//                           </EmployeeItem>
//                         )}
//                       </EmployeeList>
//                     </DropdownWrapper>
//                   )}
//                 </DepartmentCard>
//               );
//             })
//           ) : (
//             <p>No departments found.</p>
//           )}
//         </DepartmentGrid>
//       )}
//     </PageContainer>
//   );
// };

// export default AttendanceList;
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
      dispatch(searchAttendanceEmployees("")); // clear
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
    searchResults?.length > 0
      ? departmentList.filter((d) => groupedSearch[d.id])
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
