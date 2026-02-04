import React, { useState } from "react";
import {
    Container,
    PageWrapper,
    TableWrapper,
    StyledTable,
    Th,
    Td,
    Tr,
    LopTd,
} from "./AttendanceReportStyles";
import EmployeeTitle from "../../Components/EmployeeTitle";
import EmployeeIcon from "../../assets/employeeicon.svg";
import EmployeeAttendanceModal from "./EmployeeAttendanceModal";

const employeeData = [
    {
        name: "John Doe",
        month: "January",
        workingDays: 26,
        present: 20,
        absent: 6,
        lop: 2,
    },
    {
        name: "Sarah Smith",
        month: "January",
        workingDays: 26,
        present: 22,
        absent: 4,
        lop: 0,
    },
    {
        name: "David Miller",
        month: "January",
        workingDays: 26,
        present: 25,
        absent: 1,
        lop: 0,
    },
];

const fullYearData = {
  "John Doe": [
    { month: "January", workingDays: 26, present: 20, absent: 6, lop: 2 },
    { month: "February", workingDays: 24, present: 22, absent: 2, lop: 0 },
    { month: "March", workingDays: 26, present: 25, absent: 1, lop: 0 },
    { month: "April", workingDays: 26, present: 26, absent: 0, lop: 0 },
    { month: "May", workingDays: 26, present: 23, absent: 3, lop: 2 },
    { month: "June", workingDays: 26, present: 25, absent: 1, lop: 0 },
    { month: "July", workingDays: 26, present: 24, absent: 2, lop: 0 },
    { month: "August", workingDays: 26, present: 22, absent: 4, lop: 1 },
    { month: "September", workingDays: 26, present: 26, absent: 0, lop: 0 },
    { month: "October", workingDays: 26, present: 25, absent: 1, lop: 0 },
    { month: "November", workingDays: 26, present: 23, absent: 3, lop: 1 },
    { month: "December", workingDays: 26, present: 26, absent: 0, lop: 0 },
  ],
  "Sarah Smith": [
    { month: "January", workingDays: 26, present: 22, absent: 4, lop: 0 },
    { month: "February", workingDays: 24, present: 20, absent: 4, lop: 1 },
    { month: "March", workingDays: 26, present: 24, absent: 2, lop: 0 },
    // add other months
  ],
  "David Miller": [
    { month: "January", workingDays: 26, present: 25, absent: 1, lop: 0 },
    { month: "February", workingDays: 26, present: 24, absent: 2, lop: 0 },
    { month: "March", workingDays: 26, present: 26, absent: 0, lop: 0 },
  ],
};
const AttendanceReport = () => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const totalWorkingDays = employeeData[0]?.workingDays || 0;

   const handleRowClick = (employee) => {
  const employeeFullYear = {
    name: employee.name,
    months: fullYearData[employee.name] || [], 
  };
  setSelectedEmployee(employeeFullYear);
  setIsModalOpen(true);
};
    return (
        <Container>
            <EmployeeTitle
                iconSrc={EmployeeIcon}
                showBackArrow={false}
                showTabs={true}
                showDropdown={false}
                showAddButton={false}
            />

            <PageWrapper>
                <TableWrapper>
                    <StyledTable>
                        <thead>
                            <tr>
                                <Th>Employee Name</Th>
                                <Th>Month</Th>
                                <Th>Working Days</Th>
                                <Th>Present</Th>
                                <Th>Absent</Th>
                                <Th>Loss of Pay</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeData.map((emp, index) => (
                                <Tr key={index} $lop={emp.lop}
                                    onClick={() => handleRowClick(emp)}
                                    style={{ cursor: "pointer" }}>
                                    <Td>{emp.name}</Td>
                                    <Td>{emp.month}</Td>
                                    <Td>{emp.workingDays}</Td>
                                    <Td>{emp.present}</Td>
                                    <Td>{emp.absent}</Td>
                                 <LopTd $lop={emp.lop}>{emp.lop}</LopTd>
                                </Tr>
                            ))}
                        </tbody>
                    </StyledTable>
                </TableWrapper>
            </PageWrapper>
            <EmployeeAttendanceModal
                employee={selectedEmployee}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </Container>
    );
};

export default AttendanceReport;
