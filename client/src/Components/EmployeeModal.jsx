import React, { useState } from "react";
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

const EmployeeModal = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState([]);

  const filteredEmployees = employeesData.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <Header>
          <span>← Total Employees</span>
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
          <Table>
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Email ID</th>
                <th>Job Position</th>
                <th>Department</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp, index) => (
                <tr key={emp.id}>
                  <td>{String(index + 1).padStart(3, "0")}</td>
                  <td>{emp.name}</td>
                  <td>{emp.empId}</td>
                  <td>{emp.email}</td>
                  <td>{emp.job}</td>
                  <td>{emp.department}</td>
                  <td>
                    <Checkbox
                      type="checkbox"
                      checked={selected.includes(emp.id)}
                      onChange={() => toggleSelect(emp.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>

        <ButtonRow>
          <Button className="cancel" onClick={onClose}>
            Cancel
          </Button>
          <Button className="add">Add</Button>
        </ButtonRow>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EmployeeModal;
