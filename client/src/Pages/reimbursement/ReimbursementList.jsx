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
  PaginationWrapper,
  PageButton,
  PageInfo,
  StatusSelect,
  LeftWrapper,
  DepartmentIcon,
} from "../attendance/AttendanceList.Styles";
import EmployeeTitle from "../../Components/EmployeeTitle";
import { useDispatch, useSelector } from "react-redux";
import { getDepartments } from "../../Redux/departmentSlice";
import {
  fetchReimbursementsByDepartment,
  updateReimbursementStatus,
} from "../../services/reimbursement";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";
import { ClipLoader } from "react-spinners";
import { FaAnglesRight, FaAnglesLeft } from "react-icons/fa6";
import HistoryIcon from "../../assets/history.svg";
import RemiIcon from "../../assets/remi.svg";
import Side_detail from "./Side_detail.jsx";

const ReimbursementList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState(null);
  const [departmentReimbursements, setDepartmentReimbursements] = useState({});
  const [loadingDept, setLoadingDept] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pageByDept, setPageByDept] = useState({});
  const pageSize = 10;
  const { list: departmentList = [], loading } = useSelector(
    (state) => state.departments
  );

  useEffect(() => {
    dispatch(getDepartments({ page: 1, search: "" }));
  }, [dispatch]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approve":
        return { backgroundColor: "#16A34A", color: "white" };
      case "On Hold":
        return { backgroundColor: "#FFB020", color: "white" };
      case "In Verification":
        return { backgroundColor: "#3B82F6", color: "white" };
      case "Reject":
        return { backgroundColor: "#f17979", color: "white" };
      default:
        return { backgroundColor: "#fff", color: "#000" };
    }
  };

  const loadDeptReimbursements = async (deptId) => {
    setLoadingDept(true);

    try {
      const data = await fetchReimbursementsByDepartment(deptId, 1);

      const mapped = data.results.map((emp) => ({
        ...emp,
        reimbursement_id: emp.id,
      }));

      setDepartmentReimbursements((prev) => ({
        ...prev,
        [deptId]: mapped,
      }));

      setPageByDept((prev) => ({ ...prev, [deptId]: 1 }));
    } catch (error) {
      console.error("Failed to fetch dept reimbursements:", error);

      setDepartmentReimbursements((prev) => ({ ...prev, [deptId]: [] }));
      setPageByDept((prev) => ({ ...prev, [deptId]: 1 }));
    }

    setLoadingDept(false);
  };

  const handleToggle = async (deptId) => {
    if (selectedDept === deptId) {
      setSelectedDept(null);
      return;
    }

    setSelectedDept(deptId);

    if (!departmentReimbursements[deptId]) {
      await loadDeptReimbursements(deptId);
    } else {
      setPageByDept((prev) => ({ ...prev, [deptId]: prev[deptId] || 1 }));
    }
  };

  const handleStatusChange = async (reimbursementId, newStatus, deptId) => {
    const prevList = [...(departmentReimbursements[deptId] || [])];

    try {
      setDepartmentReimbursements((prev) => ({
        ...prev,
        [deptId]: prev[deptId].map((emp) =>
          emp.reimbursement_id === reimbursementId
            ? { ...emp, status: newStatus }
            : emp
        ),
      }));

      await updateReimbursementStatus(reimbursementId, newStatus);
    } catch (error) {
      console.error("Failed to update:", error);
      setDepartmentReimbursements((prev) => ({
        ...prev,
        [deptId]: prevList,
      }));
    }
  };

  const paginate = (items, page, size) => {
    const start = (page - 1) * size;
    return items.slice(start, start + size);
  };

  const filteredDepartments = departmentList
    .map((dept) => {
      const reimbursements = departmentReimbursements[dept.id] || [];
      const search = searchText.toLowerCase();

      const matchingEmployees = search
        ? reimbursements.filter((emp) =>
          (emp.employee_name || "").toLowerCase().includes(search)
        )
        : reimbursements;

      const departmentMatches = dept.name.toLowerCase().includes(search);

      return {
        ...dept,
        employees: matchingEmployees,
        isVisible:
          search === "" || departmentMatches || matchingEmployees.length > 0,
      };
    })
    .filter((d) => d.isVisible);

  return (
    <PageContainer>
      <EmployeeTitle
        iconSrc={RemiIcon}
        title="Reimbursement"
        subtitle="Manage all departments within the organization"
        buttonText="History"
        buttonIcon={HistoryIcon}
        onAddClick={() => setShowModal(true)}
        showSearch={false}
        showTabs={false}
        showDropdown={false}
        showBackArrow={false}
      />

      {loading ? (
        <Loader />
      ) : (
        <DepartmentGrid>
          {filteredDepartments.length > 0 ? (
            filteredDepartments.map((dept) => {
              const isOpen = selectedDept === dept.id;
              const employees = departmentReimbursements[dept.id] || [];

              // FIXED HERE ⬇
              const currentPage = pageByDept[dept.id] || 1;
              const totalPages = Math.ceil(employees.length / pageSize);
              const paginatedEmployees = paginate(
                employees,
                currentPage,
                pageSize
              );

              return (
                <DepartmentCard key={dept.id}>
                  <DepartmentHeader onClick={() => handleToggle(dept.id)}>
                    <LeftWrapper>
                      <DepartmentIcon>{dept.name?.charAt(0)}</DepartmentIcon>
                      <DepartmentName>{dept.name}</DepartmentName>
                    </LeftWrapper>

                    <EmployeeCount>
                      {dept.reimbursement_request_count || 0} Request
                    </EmployeeCount>
                  </DepartmentHeader>


                  {isOpen && (
                    <DropdownWrapper>
                      <DropdownHeader>
                        <span>Sl No</span>
                        <span>Employee Name</span>
                        <span>Employee ID</span>
                        <span>Job Position</span>
                        <span>Amount</span>
                        <span>Status</span>
                      </DropdownHeader>

                      <EmployeeList>
                        {loadingDept ? (
                          <EmployeeItem style={{ textAlign: "center" }}>
                            <ClipLoader size={24} />
                          </EmployeeItem>
                        ) : paginatedEmployees.length > 0 ? (
                          paginatedEmployees.map((emp, index) => (
                            <EmployeeRow
                              key={emp.reimbursement_id}
                              onClick={() =>
                                navigate(
                                  `/reimbursement_info/${emp.reimbursement_id}`
                                )
                              }
                            >
                              <EmployeeCell>
                                {(currentPage - 1) * pageSize + (index + 1)}
                              </EmployeeCell>
                              <EmployeeCell>{emp.employee_name}</EmployeeCell>
                              <EmployeeCell>{emp.employee_id}</EmployeeCell>
                              <EmployeeCell>{emp.designation}</EmployeeCell>
                              <EmployeeCell>{emp.amount}</EmployeeCell>

                              <EmployeeCell
                                onClick={(e) => e.stopPropagation()}
                              >
                               <StatusSelect
  value={emp.status}
  onChange={(e) =>
    handleStatusChange(
      emp.reimbursement_id,
      e.target.value,
      dept.id
    )
  }
  disabled={emp.status === "Approve"}  
  className={emp.status ? emp.status.replace(/\s+/g, "-").toLowerCase() : ""}
  style={{
    opacity: emp.status === "Approve" ? 1 : 1,
    cursor: emp.status === "Approve" ? "not-allowed" : "pointer",
    pointerEvents: emp.status === "Approve" ? "none" : "auto",
  }}
>
  <option value="" disabled>Select</option>
  <option value="Approve">Approved</option>
  <option value="On Hold">On Hold</option>
  <option value="In Verification">In Verification</option>
  <option value="Reject">Reject</option>
</StatusSelect>

                              </EmployeeCell>
                            </EmployeeRow>
                          ))
                        ) : (
                          <EmployeeItem style={{ textAlign: "center" }}>
                            No reimbursement records found.
                          </EmployeeItem>
                        )}
                      </EmployeeList>
                      {employees.length > pageSize && (
                        <PaginationWrapper onClick={(e) => e.stopPropagation()}>
                          <PageButton
                            disabled={currentPage === 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              setPageByDept((prev) => ({
                                ...prev,
                                [dept.id]: Math.max(1, currentPage - 1),
                              }));
                            }}
                          >
                            <FaAnglesLeft />
                          </PageButton>

                          <PageInfo>
                            Page {currentPage} / {totalPages}
                          </PageInfo>

                          <PageButton
                            disabled={currentPage === totalPages}
                            onClick={(e) => {
                              e.stopPropagation();
                              setPageByDept((prev) => ({
                                ...prev,
                                [dept.id]: Math.min(totalPages, currentPage + 1),
                              }));
                            }}
                          >
                            <FaAnglesRight />
                          </PageButton>
                        </PaginationWrapper>
                      )}

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

      {showModal && <Side_detail onClose={() => setShowModal(false)} />}
    </PageContainer>
  );
};

export default ReimbursementList;
