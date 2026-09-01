import React, { useMemo, useState, useEffect } from "react";
import { PiMagnifyingGlass } from "react-icons/pi";

import {
  Overlay,
  Modal,
  ModalHeader,
  ModalTitle,
  FilterRow,
  Select,
  SearchWrapper,
  SearchInput,
  SearchIcon,
  ListWrapper,
  EmployeeRow,
  RowIndex,
  RowName,
  Checkbox,
  EmptyState,
  ButtonRow,
  CancelButton,
  AddButton,
} from "./Addemployeemodal.styles";

const AddEmployeeModal = ({
  isOpen,
  onClose,
  employees = [],
  onAdd,
  isLoading = false,
}) => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // ==========================================
  // RESET MODAL
  // ==========================================

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setDepartment("");
      setSelectedIds([]);
    }
  }, [isOpen]);

  // ==========================================
  // GET DEPARTMENTS FROM EMPLOYEES
  // ==========================================

  const departmentOptions = useMemo(() => {
    const departments = employees
      .map((employee) => employee.department_name)
      .filter(
        (departmentName) =>
          departmentName &&
          departmentName.trim() !== ""
      );

    return [...new Set(departments)].sort();
  }, [employees]);

  // ==========================================
  // FILTER EMPLOYEES
  // ==========================================

  const filteredEmployees = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const employeeName = (
        employee.name || ""
      ).toLowerCase();

      const employeeDepartment = (
        employee.department_name || ""
      ).trim();

      // Search employee
      const matchesSearch =
        !searchValue ||
        employeeName.includes(searchValue);

      // Selected department
      const matchesDepartment =
        !department ||
        employeeDepartment === department;

      return (
        matchesSearch &&
        matchesDepartment
      );
    });
  }, [
    employees,
    search,
    department,
  ]);

  // ==========================================
  // SELECT / UNSELECT EMPLOYEE
  // ==========================================

  const toggleEmployee = (employeeId) => {
    setSelectedIds((prev) => {
      if (prev.includes(employeeId)) {
        return prev.filter(
          (id) => id !== employeeId
        );
      }

      return [...prev, employeeId];
    });
  };

  // ==========================================
  // ADD EMPLOYEES
  // ==========================================

  const handleAdd = () => {
    if (selectedIds.length === 0) {
      return;
    }

    onAdd(selectedIds);
  };

  // ==========================================
  // CLOSE
  // ==========================================

  if (!isOpen) {
    return null;
  }

  return (
    <Overlay onClick={onClose}>
      <Modal
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <ModalHeader>
          <ModalTitle>
            Add Employee
          </ModalTitle>
        </ModalHeader>

        {/* ================================= */}
        {/* FILTER ROW */}
        {/* ================================= */}

        <FilterRow>

          {/* =============================== */}
          {/* DEPARTMENT DROPDOWN */}
          {/* =============================== */}

          <Select
            value={department}
            onChange={(event) => {
              setDepartment(
                event.target.value
              );
            }}
          >
            <option value="">
              All Department
            </option>

            {departmentOptions.map(
              (dept) => (
                <option
                  key={dept}
                  value={dept}
                >
                  {dept}
                </option>
              )
            )}
          </Select>

          {/* =============================== */}
          {/* SEARCH */}
          {/* =============================== */}

          <SearchWrapper>
            <SearchInput
              type="text"
              placeholder="Search employee"
              value={search}
              onChange={(event) => {
                setSearch(
                  event.target.value
                );
              }}
            />

            <SearchIcon>
              <PiMagnifyingGlass
                size={16}
              />
            </SearchIcon>
          </SearchWrapper>

        </FilterRow>

        {/* ================================= */}
        {/* EMPLOYEE LIST */}
        {/* ================================= */}

        <ListWrapper>

          {filteredEmployees.length === 0 ? (
            <EmptyState>
              {department
                ? `No employees found in ${department}.`
                : "No employees found."}
            </EmptyState>
          ) : (
            <>
              {/* ============================= */}
              {/* SELECTED DEPARTMENT TITLE */}
              {/* ============================= */}

              {department && (
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    padding:
                      "10px 0",
                  }}
                >
                  {department}
                </div>
              )}

              {/* ============================= */}
              {/* EMPLOYEES */}
              {/* ============================= */}

              {filteredEmployees.map(
                (employee, index) => (
                  <EmployeeRow
                    key={employee.id}
                  >
                    <RowIndex>
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </RowIndex>

                    <RowName>
                      {employee.name}
                    </RowName>

                    <Checkbox
                      type="checkbox"
                      checked={selectedIds.includes(
                        employee.id
                      )}
                      onChange={() =>
                        toggleEmployee(
                          employee.id
                        )
                      }
                    />
                  </EmployeeRow>
                )
              )}
            </>
          )}

        </ListWrapper>

        {/* ================================= */}
        {/* BUTTONS */}
        {/* ================================= */}

        <ButtonRow>

          <CancelButton
            type="button"
            onClick={onClose}
          >
            CANCEL
          </CancelButton>

          <AddButton
            type="button"
            onClick={handleAdd}
            disabled={
              selectedIds.length === 0 ||
              isLoading
            }
          >
            {isLoading
              ? "ADDING..."
              : "ADD"}
          </AddButton>

        </ButtonRow>

      </Modal>
    </Overlay>
  );
};

export default AddEmployeeModal;