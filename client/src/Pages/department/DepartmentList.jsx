// src/pages/department/Department.jsx
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
  ModalOverlay,
  ModalContent,
  Container,
  CloseButton,
  TitleRow,
  BackArrow,
  Form,
  FormGroup,
  ButtonRow,
  SaveButton,
} from "../department/AddDepartment.Styles.js";

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
import Loader from "../../Components/Loader.jsx";
import { ClipLoader } from "react-spinners";
// import Navbar from "../../Components/Navbar.jsx";
import EmployeeTitle from "../../Components/EmployeeTitle.jsx";
import { FaTimes, FaTrash, FaEdit, FaSave, FaArrowLeft } from "react-icons/fa";
import { GoArrowUpRight } from "react-icons/go";
import { fetchDepartmentById } from "../../services/departmentServices"; // you used this in DepartmentDetail

const DepartmentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeptForm, setNewDeptForm] = useState({
    name: "",
    department_code: "",
  });
  const [newDeptError, setNewDeptError] = useState("");

  // Redux departments list + loading
  const { list: departments = [], loading } = useSelector(
    (state) => state.departments
  );

  // Local UI state
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState(null); // currently expanded dept id
  const [deptEmployees, setDeptEmployees] = useState({}); // { deptId: [employees] }
  const [loadingDept, setLoadingDept] = useState(false);
  const [savingDept, setSavingDept] = useState(false);

  const [pageByDept, setPageByDept] = useState({}); // per-department employee page
  const pageSize = 10;

  // per-department details + form state + editing state
  const [deptDetails, setDeptDetails] = useState({}); // { deptId: deptObject }
  const [formDatas, setFormDatas] = useState({}); // { deptId: { name, department_code, department_head_id } }
  const [editingDeptId, setEditingDeptId] = useState(null);

  // fetch departments on mount
  useEffect(() => {
    dispatch(getDepartments({ page: 1, search: "" })).then((res)=>{
          console.log("Department list refreshed", res);
        })
  }, [dispatch]);


  const filteredDepartments = useMemo(() => {
    if (!search.trim()) return departments || [];
    const q = search.toLowerCase();
    return (departments || []).filter(
      (d) =>
        (d.name || "").toLowerCase().includes(q) ||
        (d.department_code || "").toLowerCase().includes(q)
    );
  }, [departments, search]);

  const paginate = (items, page, size) => {
    const start = (page - 1) * size;
    return items.slice(start, start + size);
  };

  // toggle expand / load employees + department details
  const handleToggle = async (deptId) => {
    if (selectedDept === deptId) {
      setSelectedDept(null);
      setEditingDeptId(null);
      return;
    }

    setSelectedDept(deptId);
    setEditingDeptId(null);

    // reset page for this department to 1 when opened
    setPageByDept((prev) => ({ ...prev, [deptId]: 1 }));

    // if already loaded, no need to fetch again
    if (deptEmployees[deptId] && deptDetails[deptId]) return;

    setLoadingDept(true);
    try {
      // 1) fetch employees in department (redux thunk)
      const employeesRes = await dispatch(getEmployeesByDepartment(deptId)).unwrap();
      // store as-is (we'll sort on render), but ensure it's an array
      setDeptEmployees((prev) => ({ ...prev, [deptId]: employeesRes || [] }));

      // 2) fetch department details for form (service)
      try {
        const deptData = await fetchDepartmentById(deptId);
        setDeptDetails((prev) => ({ ...prev, [deptId]: deptData }));

        // initialize form data for this department
        setFormDatas((prev) => ({
          ...prev,
          [deptId]: {
            name: deptData.name || "",
            department_code: deptData.department_code || "",
            department_head_id: deptData.department_head?.id || "",
          },
        }));
      } catch (err) {
        // fallback: if service fails, try using local departments list item
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
      console.error("Failed to load employees or details:", err);
      Swal.fire("Error", "Failed to load department data.", "error");
    } finally {
      setLoadingDept(false);
    }
  };

  // delete employee with confirmation and refresh employees list
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
        // re-fetch employees for this department
        const updated = await dispatch(getEmployeesByDepartment(deptId)).unwrap();
        setDeptEmployees((prev) => ({ ...prev, [deptId]: updated || [] }));
        Swal.fire("Deleted!", `Employee "${employeeName}" has been deleted.`, "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete employee.", "error");
      }
    });
  };

  // form input change per department
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

  // toggle edit mode for a department
  const toggleEdit = (deptId) => {
    if (editingDeptId === deptId) {
      setEditingDeptId(null);
    } else {
      setEditingDeptId(deptId);
    }
  };

  // update department (department head)
  const handleUpdate = async (deptId) => {
    const form = formDatas[deptId] || {};
    const payload = {
      name: form.name,
      department_code: form.department_code,
      department_head_id: form.department_head_id ? parseInt(form.department_head_id, 10) : null,
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
      await dispatch(updateDepartmentById({ id: deptId, data: payload })).unwrap();

      // re-fetch details and employees to reflect changes
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

      // optionally refresh global departments list
      dispatch(getDepartments({ page: 1, search: "" }));

      Swal.fire("Updated!", "Department updated successfully.", "success");
      setEditingDeptId(null);
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire("Error", "Something went wrong while updating department.", "error");
    }
  };

  const handleNewDeptChange = (e) => {
    const { name, value } = e.target;
    setNewDeptForm((prev) => ({
      ...prev,
      [name]: value.toUpperCase(), // optional: uppercase
    }));
  };

  const handleCreateDepartment = async () => {
    // client-side validation
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
      // use unwrap to throw on rejected thunk
      const created = await dispatch(createNewDepartment(newDeptForm)).unwrap();

      // success: close modal, reset form and refresh list
      setShowAddModal(false);
      setNewDeptForm({ name: "", department_code: "" });
      setNewDeptError("");
      dispatch(getDepartments({ page: 1, search: "" }));

      console.debug("Department created:", created);
    } catch (err) {
      // Extract error message from common shapes
      const message =
        err?.payload?.detail ||
        err?.payload?.message ||
        err?.message ||
        "Something went wrong. Please try again later.";
      setNewDeptError(message);
      console.error("Create department failed:", err);
    } finally {
      setSavingDept(false);
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <PageContainer>
        <EmployeeTitle
          iconSrc={EmployeeIcon}
          title="Departments"
          subtitle="Manage your departments"
          buttonText="Add Department"
          searchValue={search}
          onSearchChange={setSearch}
          onAddClick={() => setShowAddModal(true)}
          showDropdown={false}
          showBackArrow={false}
          showTabs={false}
        />

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
            <Loader size={32} color="#3352BA" />
          </div>
        ) : (
          <DepartmentGrid>
            {filteredDepartments?.length > 0 ? (
              filteredDepartments.map((dept) => {
                const isOpen = selectedDept === dept.id;
                const employees = deptEmployees[dept.id] || [];
                const sortedEmployees = (employees || [])
                  .slice()
                  .sort((a, b) =>
                    (a?.name || "").localeCompare(b?.name || "", undefined, {
                      sensitivity: "base",
                    })
                  );

                // pagination calculations for this department
                const currentPage = pageByDept[dept.id] || 1;
                const totalPages = Math.max(1, Math.ceil(sortedEmployees.length / pageSize));
                const paginatedEmployees = paginate(sortedEmployees, currentPage, pageSize);
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
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div>
                            {dept.employee_count ?? 0}
                          </div>
                          <GoArrowUpRight size={15} style={{ strokeWidth: 2 }} />
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
                                  background: editingDeptId === dept.id ? "#3352BA" : "transparent",
                                  color: editingDeptId === dept.id ? "#fff" : "#111827",
                                  cursor: "pointer",
                                }}
                                aria-label={editingDeptId === dept.id ? "Save department" : "Edit department"}
                              >
                                {editingDeptId === dept.id ? <FaSave /> : <FaEdit />}
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
                                    onChange={(e) => handleFormChange(dept.id, e)}
                                    disabled={editingDeptId !== dept.id}
                                    style={{ cursor: editingDeptId === dept.id ? "text" : "default" }}
                                  />
                                </InputGroup>

                                <InputGroup>
                                  <Label>Department Code Name</Label>
                                  <Input
                                    name="department_code"
                                    value={form.department_code ?? ""}
                                    onChange={(e) => handleFormChange(dept.id, e)}
                                    disabled={editingDeptId !== dept.id}
                                    style={{ cursor: editingDeptId === dept.id ? "text" : "default" }}
                                  />
                                </InputGroup>

                                <InputGroup>
                                  <Label>Department head</Label>
                                  {editingDeptId === dept.id ? (
                                    <select
                                      name="department_head_id"
                                      value={form.department_head_id ?? ""}
                                      onChange={(e) => handleFormChange(dept.id, e)}
                                      style={{
                                        padding: "10px",
                                        borderRadius: "8px",
                                        border: "1px solid #ccc",
                                        fontSize: "16px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <option value="">-- Select Department Head --</option>
                                      {(deptEmployees[dept.id] || []).map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                          {emp.name}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <Input name="department_head" value={details.department_head?.name || "Not Assigned"} disabled />
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
                            <div style={{ textAlign: "center", padding: "1rem" }}>
                              <ClipLoader size={24} color="#003366" />
                            </div>
                          ) : paginatedEmployees.length > 0 ? (
                            <>
                              <DropdownHeader>
                                <EmployeeCell style={{ fontWeight: 700 }}>Sl No</EmployeeCell>
                                <EmployeeCell style={{ fontWeight: 700 }}>Name</EmployeeCell>
                                <EmployeeCell style={{ fontWeight: 700 }}>Employee ID</EmployeeCell>
                                <EmployeeCell style={{ fontWeight: 700 }}>Email</EmployeeCell>
                                <EmployeeCell style={{ fontWeight: 700 }}>Job Position</EmployeeCell>
                                <EmployeeCell style={{ fontWeight: 700, textAlign: "center" }}>Delete</EmployeeCell>
                              </DropdownHeader>

                              {paginatedEmployees.map((emp, idx) => (
                                <EmployeeRow
                                  key={emp.id ?? emp.employee_id ?? `${dept.id}-${startIndex + idx}`}
                                  // onClick={() => navigate(`/ViewBasic/${emp.id}`, { state: { from: "department" } })}
                                  // style={{ cursor: "pointer" }}
                                >
                                  <EmployeeCell>{startIndex + idx + 1}</EmployeeCell>

                                  <EmployeeCell>{emp.name}</EmployeeCell>

                                  <EmployeeCell>{emp.employee_id}</EmployeeCell>
                                  <EmployeeCell>{emp.email}</EmployeeCell>
                                  <EmployeeCell>{emp.designation}</EmployeeCell>

                                  <EmployeeCell style={{ textAlign: "center" }}>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteEmployee(emp.id, emp.name, dept.id);
                                      }}
                                      style={{ border: "none", background: "transparent", cursor: "pointer", color: "red" }}
                                      aria-label={`Delete ${emp.name}`}
                                    >
                                      <FaTrash />
                                    </button>
                                  </EmployeeCell>
                                </EmployeeRow>
                              ))}
                            </>
                          ) : (
                            <NoRecordMessage>No employees found.</NoRecordMessage>
                          )}
                        </DropdownWrapper>

                        {/* Pagination for employees inside the expanded department */}
                        {sortedEmployees.length > pageSize && (
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
                              Prev
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
                              Next
                            </PageButton>
                          </PaginationWrapper>
                        )}
                      </>
                    )}
                  </DepartmentCard>
                );
              })
            ) : (
              <p>No departments found.</p>
            )}
          </DepartmentGrid>
        )} 

        {showAddModal && (
          <ModalOverlay>
            <ModalContent>
              <Container style={{ position: "relative" }}>
                <CloseButton onClick={() => setShowAddModal(false)} aria-label="Close">
                  <FaTimes />
                </CloseButton>

                <TitleRow>
                  <BackArrow onClick={() => setShowAddModal(false)} aria-label="Back">
                    <FaArrowLeft />
                  </BackArrow>
                  <h2>Add Department</h2>
                </TitleRow>

                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateDepartment();
                  }}
                >
                  <FormGroup>
                    <Label>Department Name</Label>
                    <Input style={{border:"1px solid lightgray"}}
                    type="text" name="name" value={newDeptForm.name} onChange={handleNewDeptChange} placeholder="Development" required />
                  </FormGroup>

                  <FormGroup>
                    <Label>Department Code</Label>
                  <Input style={{border:"1px solid lightgray"}}
                    type="text" name="department_code" value={newDeptForm.department_code} onChange={handleNewDeptChange} placeholder="Eg:Dev_00" required />
                  </FormGroup>

                  {newDeptError && <p style={{ color: "red" }}>{newDeptError}</p>}

                  <ButtonRow>
                    <CancelButton type="button" onClick={() => setShowAddModal(false)}>
                      Cancel
                    </CancelButton>
                    <SaveButton type="submit">Save</SaveButton>
                  </ButtonRow>
                </Form>
              </Container>
            </ModalContent>
          </ModalOverlay>
        )}
      </PageContainer>
    </>
  );
};

export default DepartmentList;
