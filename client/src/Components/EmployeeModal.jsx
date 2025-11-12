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
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesNotInProject, assignEmployees, getProjectById } from "../Redux/fieldShiftSlice";
import Swal from "sweetalert2";


const EmployeeModal = ({ onClose, projectId, project }) => {
  const dispatch = useDispatch();

  const { employeesNotInProject = [], isLoading } = useSelector(
    (state) => state.projects
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (projectId) {
      dispatch(getEmployeesNotInProject(projectId));
    }
  }, [dispatch, projectId]);

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
      // Merge new employees with existing
      const currentEmployeeIds = project?.employees?.map(emp => emp.id) || [];
      const mergedEmployeeIds = Array.from(new Set([...currentEmployeeIds, ...selected]));

      // Call assignEmployees
      await dispatch(assignEmployees({ projectId, employeeIds: mergedEmployeeIds })).unwrap();

      Swal.fire("Success!", "Employees added successfully.", "success");
      onClose();

      // Refresh project data
      dispatch(getProjectById(projectId));
    } catch (error) {
      Swal.fire("Error", "Failed to add employees.", "error");
    }
  };

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
                      <td>{emp.designation}</td>
                      <td>{emp.department_name || "—"}</td>
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
