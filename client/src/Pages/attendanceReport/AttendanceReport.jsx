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
    TopBar,
    MonthSelector,
} from "./AttendanceReportStyles";
import EmployeeTitle from "../../Components/EmployeeTitle";
import EmployeeIcon from "../../assets/employeeicon.svg";
import EmployeeAttendanceModal from "./EmployeeAttendanceModal";

const employeeData = [
    { name: "John Doe", month: "January", workingDays: 26, present: 20, absent: 6, lop: 2 },
    { name: "Sarah Smith", month: "January", workingDays: 26, present: 22, absent: 4, lop: 0 },
    { name: "David Miller", month: "February", workingDays: 26, present: 25, absent: 1, lop: 0 },
    { name: "David Miller", month: "February", workingDays: 26, present: 25, absent: 1, lop: 0 },
    { name: "David Miller", month: "February", workingDays: 26, present: 20, absent: 1, lop: 2 },
];

const fullYearData = {
    "John Doe": [
        { month: "January", workingDays: 26, present: 20, absent: 6, lop: 2 },
        { month: "February", workingDays: 24, present: 22, absent: 2, lop: 0 },
        { month: "March", workingDays: 26, present: 25, absent: 1, lop: 0 },
        { month: "April", workingDays: 26, present: 26, absent: 0, lop: 0 },
    ],
    "Sarah Smith": [
        { month: "January", workingDays: 26, present: 22, absent: 4, lop: 0 },
        { month: "February", workingDays: 24, present: 20, absent: 4, lop: 1 },
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
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [searchTerm, setSearchTerm] = useState("");

    const getMonthNameFromYYYYMM = (yyyyMM) => {
        if (!yyyyMM) return "";
        const d = new Date(`${yyyyMM}-01T00:00:00`);
        if (isNaN(d.getTime())) return "";
        return d.toLocaleString("default", { month: "long" });
    };

    const selectedMonthName = getMonthNameFromYYYYMM(selectedMonth);
    const visibleRows = employeeData.filter(
        (emp) =>
            emp.month === selectedMonthName &&
            emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                showSearch={true}
                searchValue={searchTerm}
                onSearchChange={(val) => setSearchTerm(val)}
            />

            <PageWrapper>
                <TopBar>
                    <MonthSelector>
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        />
                    </MonthSelector>
                </TopBar>

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
                            {visibleRows.length === 0 ? (
                                <Tr>
                                    <Td colSpan={6} style={{ textAlign: "center" }}>
                                        No records for {selectedMonthName || "this month"}
                                    </Td>
                                </Tr>
                            ) : (
                                visibleRows.map((emp, index) => (
                                    <Tr
                                        key={index}
                                        $lop={emp.lop}
                                        onClick={() => handleRowClick(emp)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <Td>{emp.name}</Td>
                                        <Td>{emp.month}</Td>
                                        <Td>{emp.workingDays}</Td>
                                        <Td>{emp.present}</Td>
                                        <Td>{emp.absent}</Td>
                                        <LopTd $lop={emp.lop}>{emp.lop}</LopTd>
                                    </Tr>
                                ))
                            )}
                        </tbody>
                    </StyledTable>
                </TableWrapper>
            </PageWrapper>

            <EmployeeAttendanceModal
                employee={selectedEmployee}
                monthName={selectedMonthName}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </Container>
    );
};

export default AttendanceReport;
