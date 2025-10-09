import React, { useState, useEffect } from "react";
import {
  ModalOverlay,
  ModalContainer,
  Header,
  SearchBar,
  TableWrapper,
  Table,
  ButtonRow,
  Button,
  Checkbox,
} from "./EmployeeModal.Styles";
import { FaSearch } from "react-icons/fa";
const employeesData = [
  {
    id: 1,
    name: "Employee",
    empId: "125/425",
    email: "dummy@gmail.com",
    job: "UI/UX Designer",
    department: "Design Department",
  },

    {
    id: 2,
    name: "Employee",
    empId: "125/426",
    email: "dummy2@gmail.com",
    job: "UI/UX Designer",
    department: "Design Department",
  },
    {
    id: 3,
    name: "Employee",
    empId: "125/426",
    email: "dummy2@gmail.com",
    job: "UI/UX Designer",
    department: "Design Department",
  },
    {
    id: 4,
    name: "Employee",
    empId: "125/426",
    email: "dummy2@gmail.com",
    job: "UI/UX Designer",
    department: "Design Department",
  },
    {
    id: 5,
    name: "Employee",
    empId: "125/426",
    email: "dummy2@gmail.com",
    job: "UI/UX Designer",
    department: "Design Department",
  },
    {
    id: 6,
    name: "Employee",
    empId: "125/426",
    email: "dummy2@gmail.com",
    job: "UI/UX Designer",
    department: "Design Department",
  },
    {
    id: 2,
    name: "Employee",
    empId: "125/426",
    email: "dummy2@gmail.com",
    job: "UI/UX Designer",
    department: "Design Department",
  },
    {
    id: 2,
    name: "Employee",
    empId: "125/426",
    email: "dummy2@gmail.com",
    job: "UI/UX Designer",
    department: "Design Department",
  },
    {
    id: 2,
    name: "Employee",
    empId: "125/426",
    email: "dummy2@gmail.com",
    job: "UI/UX Designer",
    department: "Design Department",
  },
    {
    id: 2,
    name: "Employee",
    empId: "125/426",
    email: "dummy2@gmail.com",
    job: "UI/UX Designer",
    department: "Design Department",
  },
    {
    id: 2,
    name: "Employee",
    empId: "125/426",
    email: "dummy2@gmail.com",
    job: "UI/UX Designer",
    department: "Design Department",
  },
    {
    id: 2,
    name: "Employee",
    empId: "125/426",
    email: "dummy2@gmail.com",
    job: "UI/UX Designer",
    department: "Design Department",
  },
    {
    id: 2,
    name: "Employee",
    empId: "125/426",
    email: "dummy2@gmail.com",
    job: "UI/UX Designer",
    department: "Design Department",
  },
    {
    id: 2,
    name: "Employee",
    empId: "125/426",
    email: "dummy2@gmail.com",
    job: "UI/UX Designer",
    department: "Design Department",
  },
    {
    id: 2,
    name: "Employee",
    empId: "125/426",
    email: "dummy2@gmail.com",
    job: "UI/UX Designer",
    department: "Design Department",
  },
    {
    id: 2,
    name: "Employee",
    empId: "125/426",
    email: "dummy2@gmail.com",
    job: "UI/UX Designer",
    department: "Design Department",
  },
    {
    id: 2,
    name: "Employee",
    empId: "125/426",
    email: "dummy2@gmail.com",
    job: "UI/UX Designer",
    department: "Design Department",
  },
    {
    id: 2,
    name: "Employee",
    empId: "125/426",
    email: "dummy2@gmail.com",
    job: "UI/UX Designer",
    department: "Design Department",
  },
    {
    id: 2,
    name: "Employee",
    empId: "125/426",
    email: "dummy2@gmail.com",
    job: "UI/UX Designer",
    department: "Design Department",
  },
  
  // Add more sample data as needed
];

  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (projectId) {
      dispatch(getEmployeesNotInProject(projectId));
    }
  }, [dispatch, projectId]);

  // ✅ Safe filtering
  const filteredEmployees = (employeesNotInProject || []).filter((emp) =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAdd = async () => {
    if (selected.length === 0) {
      Swal.fire("Select at least one employee!", "", "warning");
      return;
    }

    try {
      await dispatch(
        updateProject({
          id: projectId,
          projectData: { employees: selected },
        })
      ).unwrap();

      Swal.fire("Success!", "Employees added successfully.", "success");
      onClose();
    } catch (error) {
      Swal.fire("Error", "Failed to add employees.", "error");
    }
  };

  console.log("employeesNotInProject:", employeesNotInProject);

  return (
    <ModalOverlay>
      <ModalContainer>
        <Header>
          <span>← Add Employees to Project</span>
        </Header>

        <SearchBar>
          <div className="input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search Employee"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && <button onClick={() => setSearchTerm("")}>Clear</button>}
        </SearchBar>

        <TableWrapper>
          {isLoading ? (
            <p style={{ textAlign: "center" }}>Loading employees...</p>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Sl No</th>
                  <th>Employee Name</th>
                  <th>Employee ID</th>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {(filteredEmployees || []).length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No unassigned employees found
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp, index) => (
                    <tr key={emp.id}>
                      <td>{String(index + 1).padStart(3, "0")}</td>
                      <td>{emp.name}</td>
                      <td>{emp.employee_id}</td>
                      <td>{emp.email}</td>
                      <td>{emp.designation}</td>
                      <td>{emp.department || "—"}</td>
                      <td>
                        <Checkbox
                          type="checkbox"
                          checked={selected.includes(emp.id)}
                          onChange={() => toggleSelect(emp.id)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </TableWrapper>

        <ButtonRow>
          <Button className="cancel" onClick={onClose}>
            Cancel
          </Button>
          <Button className="add" onClick={handleAdd}>
            Add
          </Button>
        </ButtonRow>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EmployeeModal;
