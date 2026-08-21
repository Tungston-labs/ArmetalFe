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
  departments = [],
  onAdd,
  isLoading = false,
}) => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // Reset local state every time the modal is opened fresh
  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setDepartment("");
      setSelectedIds([]);
    }
  }, [isOpen]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch = employee.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesDepartment =
        !department || employee.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, search, department]);

  if (!isOpen) {
    return null;
  }

  const toggleEmployee = (employeeId) => {
    setSelectedIds((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleAdd = () => {
    if (selectedIds.length === 0) return;
    onAdd(selectedIds);
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(event) => event.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Add Employee</ModalTitle>
        </ModalHeader>

        <FilterRow>
          <Select
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
          >
            <option value="">All Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </Select>

          <SearchWrapper>
            <SearchInput
              type="text"
              placeholder="Search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <SearchIcon>
              <PiMagnifyingGlass size={16} />
            </SearchIcon>
          </SearchWrapper>
        </FilterRow>

        <ListWrapper>
          {filteredEmployees.length === 0 ? (
            <EmptyState>No employees found.</EmptyState>
          ) : (
            filteredEmployees.map((employee, index) => (
              <EmployeeRow key={employee.id}>
                <RowIndex>{String(index + 1).padStart(2, "0")}</RowIndex>
                <RowName>{employee.name}</RowName>
                <Checkbox
                  type="checkbox"
                  checked={selectedIds.includes(employee.id)}
                  onChange={() => toggleEmployee(employee.id)}
                />
              </EmployeeRow>
            ))
          )}
        </ListWrapper>

        <ButtonRow>
          <CancelButton type="button" onClick={onClose}>
            CANCEL
          </CancelButton>

          <AddButton
            type="button"
            onClick={handleAdd}
            disabled={selectedIds.length === 0 || isLoading}
          >
            {isLoading ? "ADDING..." : "ADD"}
          </AddButton>
        </ButtonRow>
      </Modal>
    </Overlay>
  );
};

export default AddEmployeeModal;