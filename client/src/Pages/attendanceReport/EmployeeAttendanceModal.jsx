import React from "react";
import { FaTimes } from "react-icons/fa";
import { CardLabel, CardValue, CloseIcon, LopTd, ModalBody, ModalContainer, ModalHeader, ModalOverlay, StyledTable, SummaryCard, SummaryGrid, TableWrapper, TotalRow, Tr,} from "./EmployeeAttendanceModal.styles";

const yearlyAttendance = {
    name: "John Doe",
    months: [
        { month: "January", workingDays: 26, present: 24, absent: 2, lop: 0 },
        { month: "February", workingDays: 24, present: 20, absent: 4, lop: 1 },
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
};

const EmployeeAttendanceModal = ({ employee = yearlyAttendance, isOpen, onClose }) => {
    if (!employee) return null;
    const totals = employee.months.reduce(
        (acc, m) => {
            acc.workingDays += m.workingDays;
            acc.present += m.present;
            acc.absent += m.absent;
            acc.lop += m.lop;
            return acc;
        },
        { workingDays: 0, present: 0, absent: 0, lop: 0 }
    );

    return (
        <ModalOverlay isOpen={isOpen}>
        <ModalContainer isOpen={isOpen}>
            <ModalHeader>
                <h3>Attendance Details</h3>
                <CloseIcon onClick={onClose}>
                    <FaTimes />
                </CloseIcon>
            </ModalHeader>

            <ModalBody>
               <SummaryGrid>
  <SummaryCard>
    <CardLabel>Working Days</CardLabel>
    <CardValue>{totals.workingDays}</CardValue>
  </SummaryCard>

  <SummaryCard green>
    <CardLabel>Present</CardLabel>
    <CardValue>{totals.present}</CardValue>
  </SummaryCard>

  <SummaryCard yellow>
    <CardLabel>Absent</CardLabel>
    <CardValue>{totals.absent}</CardValue>
  </SummaryCard>

  <SummaryCard red={totals.lop > 0}>
    <CardLabel>LOP</CardLabel>
    <CardValue>{totals.lop}</CardValue>
  </SummaryCard>
</SummaryGrid>

                <TableWrapper>
                    <StyledTable>
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Working Days</th>
                                <th>Present</th>
                                <th>Absent</th>
                                <th>LOP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employee.months.map((m, idx) => (
                                <Tr key={idx} $lop={m.lop}>
                                    <td>{m.month}</td>
                                    <td>{m.workingDays}</td>
                                    <td>{m.present}</td>
                                    <td>{m.absent}</td>
                                    <LopTd $lop={m.lop}>{m.lop}</LopTd>
                                </Tr>
                            ))}
                            <TotalRow>
                                <td>Total</td>
                                <td>{totals.workingDays}</td>
                                <td>{totals.present}</td>
                                <td>{totals.absent}</td>
                                <td>{totals.lop}</td>
                            </TotalRow>
                        </tbody>
                    </StyledTable>
                </TableWrapper>
            </ModalBody>
        </ModalContainer>
        </ModalOverlay>
    );
};

export default EmployeeAttendanceModal;
