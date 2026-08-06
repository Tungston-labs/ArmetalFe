import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDepartments,
  getEmployeesByDepartment,
  updateDepartmentById,
  createNewDepartment,
} from "../../Redux/departmentSlice.js";
import { deleteEmployeeById } from "../../Redux/employeeSlice.js";
import { useNavigate } from "react-router-dom";
import EmployeeIcon from "../../assets/employeeicon.svg";
import Swal from "sweetalert2";

import {
  PageContainer,
  DepartmentGrid,
  DepartmentCard,
  DepartmentHeader,
  DepartmentName,
  EmployeeCount,
  DropdownWrapper,
  DropdownHeader,
  EmployeeCell,
  EmployeeRow,
  NoRecordMessage,
  LeftWrapper,
  DepartmentIcon,
  PaginationWrapper,
  PageButton,
  PageInfo,
} from "../attendance/AttendanceList.Styles";
import {
  FormSection,
  InputGroup,
  Label,
  Input,
  ButtonGroups,
  CancelButton,
  TopRow,
  InputsWrapper,
  RightActions,
} from "../department/DepartmentDetails.Styles";
import Loader from "../../Components/Loader/Loader.jsx";
import { ClipLoader } from "react-spinners";
import EmployeeTitle from "../../Components/Employee/Headers/EmployeeTitle.jsx";
import { FaTimes, FaTrash, FaEdit, FaSave, FaArrowLeft } from "react-icons/fa";
import { GoArrowLeft, GoArrowUpRight } from "react-icons/go";
import { fetchDepartmentById } from "../../services/departmentServices"; 
import { FaAnglesRight,FaAnglesLeft } from "react-icons/fa6";
import NoEmployeeFound from "../../Components/No found/Noemployeefound.jsx";
import AddDepartment from "./AddDepartment.jsx";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader.jsx";
const DepartmentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeptForm, setNewDeptForm] = useState({
    name: "",
    department_code: "",
  });
  const [newDeptError, setNewDeptError] = useState("");
  const { list: departments = [], loading } = useSelector(
    (state) => state.departments,
  );
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState(null);
  const [deptEmployees, setDeptEmployees] = useState({}); 
  const [loadingDept, setLoadingDept] = useState(false);
  const [savingDept, setSavingDept] = useState(false);
  const [pageByDept, setPageByDept] = useState({}); 
  const pageSize = 10;
  const [deptDetails, setDeptDetails] = useState({});
  const [formDatas, setFormDatas] = useState({}); 
  const [editingDeptId, setEditingDeptId] = useState(null);

  useEffect(() => {
    dispatch(getDepartments({ page: 1, search: "" })).then((res) => {
    });
  }, [dispatch]);

  const filteredDepartments = useMemo(() => {
    if (!search.trim()) return departments || [];
    const q = search.toLowerCase();
    return (departments || []).filter(
      (d) =>
        (d.name || "").toLowerCase().includes(q) ||
        (d.department_code || "").toLowerCase().includes(q),
    );
  }, [departments, search]);

  const paginate = (items, page, size) => {
    const start = (page - 1) * size;
    return items.slice(start, start + size);
  };

  const handleToggle = async (deptId) => {
    if (selectedDept === deptId) {
      setSelectedDept(null);
      setEditingDeptId(null);
      return;
    }

    setSelectedDept(deptId);
    setEditingDeptId(null);
    setPageByDept((prev) => ({ ...prev, [deptId]: 1 }));

    if (deptEmployees[deptId] && deptDetails[deptId]) return;

    setLoadingDept(true);
    try {
      const employeesRes = await dispatch(
        getEmployeesByDepartment(deptId),
      ).unwrap();
      setDeptEmployees((prev) => ({ ...prev, [deptId]: employeesRes || [] }));
      try {
        const deptData = await fetchDepartmentById(deptId);
        setDeptDetails((prev) => ({ ...prev, [deptId]: deptData }));
        setFormDatas((prev) => ({
          ...prev,
          [deptId]: {
            name: deptData.name || "",
            department_code: deptData.department_code || "",
            department_head_id: deptData.department_head?.id || "",
          },
        }));
      } catch (err) {
        const fallback = departments.find((d) => d.id === deptId) || {};
        setDeptDetails((prev) => ({ ...prev, [deptId]: fallback }));
        setFormDatas((prev) => ({
          ...prev,
          [deptId]: {
            name: fallback.name || "",
            department_code: fallback.department_code || "",
            department_head_id: fallback.department_head?.id || "",
          },
        }));
      }
    } catch (err) {
      Swal.fire("Error", "Failed to load department data.", "error");
    } finally {
      setLoadingDept(false);
    }
  };
const handleDeleteEmployee = (employeeId, employeeName, deptId) => {
  Swal.fire({
    title: "Are you sure?",
    text: `Employee "${employeeName}" will be permanently deleted.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete!",
  }).then(async (result) => {
    if (!result.isConfirmed) return;
    try {
      await dispatch(deleteEmployeeById(employeeId)).unwrap();

      // ✅ Try to fetch updated employees, handle 404 if last employee deleted
      try {
        const updated = await dispatch(
          getEmployeesByDepartment(deptId),
        ).unwrap();
        setDeptEmployees((prev) => ({ ...prev, [deptId]: updated || [] }));

        Swal.fire(
          "Deleted!",
          `Employee "${employeeName}" has been deleted.`,
          "success",
        );
      } catch (fetchErr) {
        // ✅ Last employee deleted — department now empty, close and refresh
        setDeptEmployees((prev) => ({ ...prev, [deptId]: [] }));
        setSelectedDept(null); // close the card

        // ✅ Refresh department list to remove empty department from UI
        dispatch(getDepartments({ page: 1, search: "" }));

        Swal.fire(
          "Deleted!",
          `Employee "${employeeName}" has been deleted. The department has been removed as it has no employees.`,
          "success",
        );
      }
    } catch (err) {
      Swal.fire("Error", "Failed to delete employee.", "error");
    }
  });
};

  const handleFormChange = (deptId, e) => {
    const { name, value } = e.target;
    setFormDatas((prev) => ({
      ...prev,
      [deptId]: {
        ...(prev[deptId] || {}),
        [name]: value,
      },
    }));
  };
  const toggleEdit = (deptId) => {
    if (editingDeptId === deptId) {
      setEditingDeptId(null);
    } else {
      setEditingDeptId(deptId);
    }
  };
  const handleUpdate = async (deptId) => {
    const form = formDatas[deptId] || {};
    const payload = {
      name: form.name,
      department_code: form.department_code,
      department_head_id: form.department_head_id
        ? parseInt(form.department_head_id, 10)
        : null,
    };

    if (!payload.department_head_id) {
      Swal.fire({
        icon: "warning",
        title: "Missing Department Head",
        text: "Please select a department head before saving.",
        confirmButtonColor: "#3352BA",
      });
      return;
    }

    try {
      await dispatch(
        updateDepartmentById({ id: deptId, data: payload }),
      ).unwrap();
      const updatedDept = await fetchDepartmentById(deptId);
      setDeptDetails((prev) => ({ ...prev, [deptId]: updatedDept }));
      setFormDatas((prev) => ({
        ...prev,
        [deptId]: {
          name: updatedDept.name || "",
          department_code: updatedDept.department_code || "",
          department_head_id: updatedDept.department_head?.id || "",
        },
      }));
      dispatch(getDepartments({ page: 1, search: "" }));

      Swal.fire("Updated!", "Department updated successfully.", "success");
      setEditingDeptId(null);
    } catch (err) {
      Swal.fire(
        "Error",
        "Something went wrong while updating department.",
        "error",
      );
    }
  };

  const handleNewDeptChange = (e) => {
    const { name, value } = e.target;
    setNewDeptForm((prev) => ({
      ...prev,
      [name]: value.toUpperCase(), 
    }));
  };

  const handleCreateDepartment = async () => {
    if (!newDeptForm.name?.trim()) {
      setNewDeptError("Please provide a department name.");
      return;
    }
    if (!newDeptForm.department_code?.trim()) {
      setNewDeptError("Please provide a department code.");
      return;
    }
    if (newDeptForm.department_code.length > 10) {
      setNewDeptError("Department code cannot exceed 10 characters.");
      return;
    }

    setNewDeptError("");
    setSavingDept(true);

    try {
      const created = await dispatch(createNewDepartment(newDeptForm)).unwrap();
      setShowAddModal(false);
      setNewDeptForm({ name: "", department_code: "" });
      setNewDeptError("");
      dispatch(getDepartments({ page: 1, search: "" }));
    } catch (err) {
      const message =
        err?.payload?.detail ||
        err?.payload?.message ||
        err?.message ||
        "Something went wrong. Please try again later.";
      setNewDeptError(message);
    } finally {
      setSavingDept(false);
    }
  };

  return (
    <>
      <PageContainer>
         <ReusableHeader
                    title="Department"
                    breadcrumbs={["Dashboard", "Department"]}
                    buttonText="ADD NEW EMPLOYEE"
                    onButtonClick={() => console.log("Add Employee")}
                />

     
        
     
          <DepartmentGrid>
            {filteredDepartments?.length > 0 ? (
              filteredDepartments.map((dept) => {
                const isOpen = selectedDept === dept.id;
                const employees = deptEmployees[dept.id] || [];
                const sortedEmployees = (employees || []).slice().sort((a, b) =>
                  (a?.name || "").localeCompare(b?.name || "", undefined, {
                    sensitivity: "base",
                  }),
                );

                const currentPage = pageByDept[dept.id] || 1;
                const totalPages = Math.max(
                  1,
                  Math.ceil(sortedEmployees.length / pageSize),
                );
                const paginatedEmployees = paginate(
                  sortedEmployees,
                  currentPage,
                  pageSize,
                );
                const startIndex = (currentPage - 1) * pageSize;
                const hasNextPage = currentPage < totalPages;

                const details = deptDetails[dept.id] || {};
                const form = formDatas[dept.id] || {};

                return (
                  <DepartmentCard key={dept.id}>
                    <DepartmentHeader onClick={() => handleToggle(dept.id)}>
                      <LeftWrapper>
                        <DepartmentIcon>{dept.name?.charAt(0)}</DepartmentIcon>
                        <DepartmentName>{dept.name}</DepartmentName>
                      </LeftWrapper>

                      <EmployeeCount>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div>{dept.employee_count ?? 0}</div>
                          <GoArrowUpRight
                            size={15}
                            style={{ strokeWidth: 2 }}
                          />
                        </div>
                      </EmployeeCount>
                    </DepartmentHeader>

                    {isOpen && (
                      <>
                        <div style={{ padding: "0.75rem", background: "#fff" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: 8,
                            }}
                          >
                            <div style={{ fontWeight: 700 }}></div>

                            <div style={{ display: "flex", gap: 8 }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (editingDeptId === dept.id) {
                                    handleUpdate(dept.id);
                                  } else {
                                    toggleEdit(dept.id);
                                  }
                                }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  padding: "6px 10px",
                                  borderRadius: 6,
                                  border: "1px solid #d1d5db",
                                  background:
                                    editingDeptId === dept.id
                                      ? "#3352BA"
                                      : "transparent",
                                  color:
                                    editingDeptId === dept.id
                                      ? "#fff"
                                      : "#111827",
                                  cursor: "pointer",
                                }}
                                aria-label={
                                  editingDeptId === dept.id
                                    ? "Save department"
                                    : "Edit department"
                                }
                              >
                                {editingDeptId === dept.id ? (
                                  <FaSave />
                                ) : (
                                  <FaEdit />
                                )}
                                {editingDeptId === dept.id ? "Save" : "Edit"}
                              </button>
                            </div>
                          </div>

                          <FormSection>
                            <TopRow>
                              <InputsWrapper>
                                <InputGroup>
                                  <Label>Department name</Label>
                                  <Input
                                    name="name"
                                    value={form.name ?? ""}
                                    autoComplete='off'
                                    onChange={(e) =>
                                      handleFormChange(dept.id, e)
                                    }
                                    disabled={editingDeptId !== dept.id}
                                    style={{
                                      cursor:
                                        editingDeptId === dept.id
                                          ? "text"
                                          : "default",
                                             textTransform: "capitalize",
                                    }}
                                  />
                                </InputGroup>

                                <InputGroup>
                                  <Label>Department Code Name</Label>
                                  <Input
                                    name="department_code"
                                    value={form.department_code ?? ""}
                                    autoComplete='off'
                                    onChange={(e) =>
                                      handleFormChange(dept.id, e)
                                    }
                                    disabled={editingDeptId !== dept.id}
                                    style={{
                                      cursor:
                                        editingDeptId === dept.id
                                          ? "text"
                                          : "default",
                                    }}
                                  />
                                </InputGroup>

                                <InputGroup>
                                  <Label>Department head</Label>
                                  {editingDeptId === dept.id ? (
                                    <select
                                      name="department_head_id"
                                      value={form.department_head_id ?? ""}
                                      onChange={(e) =>
                                        handleFormChange(dept.id, e)
                                      }
                                      style={{
                                        padding: "10px",
                                        borderRadius: "8px",
                                        border: "1px solid #ccc",
                                        fontSize: "16px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <option value="">
                                        -- Select Department Head --
                                      </option>
                                      {(deptEmployees[dept.id] || []).map(
                                        (emp) => (
                                          <option key={emp.id} value={emp.id}>
                                            {emp.name}
                                          </option>
                                        ),
                                      )}
                                    </select>
                                  ) : (
                                    <Input
                                      name="department_head"
                                      value={
                                        details.department_head?.name ||
                                        "Not Assigned"
                                      }
                                      disabled
                                    />
                                  )}
                                </InputGroup>
                              </InputsWrapper>

                              <RightActions>
                                {editingDeptId === dept.id && (
                                  <ButtonGroups>
                                    <CancelButton
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingDeptId(null);
                                      }}
                                    >
                                      Cancel
                                    </CancelButton>
                                  </ButtonGroups>
                                )}
                              </RightActions>
                            </TopRow>
                          </FormSection>
                        </div>

                        <DropdownWrapper>
                          {loadingDept ? (
                            <div
                              style={{ textAlign: "center", padding: "1rem" }}
                            >
                              <ClipLoader size={24} color="#003366" />
                            </div>
                          ) : paginatedEmployees.length > 0 ? (
                            <>
                              <DropdownHeader>
                                <EmployeeCell style={{ fontWeight: 700 }}>
                                  Sl No
                                </EmployeeCell>
                                <EmployeeCell style={{ fontWeight: 700 }}>
                                  Name
                                </EmployeeCell>
                                <EmployeeCell style={{ fontWeight: 700 }}>
                                  Employee ID
                                </EmployeeCell>
                                <EmployeeCell style={{ fontWeight: 700 }}>
                                  Email
                                </EmployeeCell>
                                <EmployeeCell style={{ fontWeight: 700 }}>
                                  Job Position
                                </EmployeeCell>
                                <EmployeeCell
                                  style={{
                                    fontWeight: 700,
                                    textAlign: "center",
                                  }}
                                >
                                  Delete
                                </EmployeeCell>
                              </DropdownHeader>

                              {paginatedEmployees.map((emp, idx) => (
                                <EmployeeRow
                                  key={
                                    emp.id ??
                                    emp.employee_id ??
                                    `${dept.id}-${startIndex + idx}`
                                  }
                                  // onClick={() => navigate(`/ViewBasic/${emp.id}`, { state: { from: "department" } })}
                                  // style={{ cursor: "pointer" }}
                                >
                                  <EmployeeCell>
                                    {startIndex + idx + 1}
                                  </EmployeeCell>

                                  <EmployeeCell>{emp.name}</EmployeeCell>

                                  <EmployeeCell>{emp.employee_id}</EmployeeCell>
                                  <EmployeeCell>{emp.email}</EmployeeCell>
                                  <EmployeeCell>{emp.designation}</EmployeeCell>

                                  <EmployeeCell style={{ textAlign: "center" }}>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteEmployee(
                                          emp.id,
                                          emp.name,
                                          dept.id,
                                        );
                                      }}
                                      style={{
                                        border: "none",
                                        background: "transparent",
                                        cursor: "pointer",
                                        color: "red",
                                      }}
                                      aria-label={`Delete ${emp.name}`}
                                    >
                                      <FaTrash />
                                    </button>
                                  </EmployeeCell>
                                </EmployeeRow>
                              ))}
                            </>
                          ) : (
                            <NoRecordMessage>
                              No employees found.
                            </NoRecordMessage>
                          )}
                        </DropdownWrapper>

                  
                        {sortedEmployees.length > pageSize && (
                          <PaginationWrapper
                            onClick={(e) => e.stopPropagation()}
                          >
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
                         <FaAnglesLeft/>
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
                                  [dept.id]: Math.min(
                                    totalPages,
                                    currentPage + 1,
                                  ),
                                }));
                              }}
                            >
                          <FaAnglesRight/>
                            </PageButton>
                          </PaginationWrapper>
                        )}
                      </>
                    )}
                  </DepartmentCard>
                );
              })
            ) : (
           <div style={{ 
    width: "100%", 
    display: "flex", 
    justifyContent: "center" 
  }}>
    <NoEmployeeFound searchTerm={search} label="No Department Found" />
  </div>
            )}
          </DepartmentGrid>
      
     {showAddModal && (
  <AddDepartment onClose={() => setShowAddModal(false)} />
)}
      </PageContainer>
    </>
  );
};

export default DepartmentList;
