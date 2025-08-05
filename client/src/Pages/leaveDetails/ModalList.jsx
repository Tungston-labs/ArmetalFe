import React from "react";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  FieldRow,
  InputField,
  TableContainer,
  TableHeader,
  TableRow,
  TableData,
  ActionButtons,
  ApproveButton,
  DeclineButton,
  ProfileImg,
} from "./ModalList.Styles";

const employees = [
  {
    name: "xxxxxxxx",
    type: "Sick leave",
    email: "xxxxxxxxxgmail.com",
    contact: "6235689542",
    date: "12-11-2025 To 15-11-2025",
  },
  // Repeat or map multiple employees as needed
];

const OnLeaveModal = ({ onClose }) => {
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <h2>Employees on leave</h2>
        </ModalHeader>

        <FieldRow>
          <InputField label="Department name" value="Q&A /Testing" readOnly />
          <InputField label="Department Code Name" value="Q&A" readOnly />
        </FieldRow>
        <FieldRow>
          <InputField label="Department head" value="Ajay kumar" readOnly />
        </FieldRow>

        <TableContainer>
          <TableHeader>
            <tr>
              <th>Employee name</th>
              <th>Leave type</th>
              <th>Email ID</th>
              <th>Contact number</th>
              <th>Start date to end date</th>
            </tr>
          </TableHeader>

          <tbody>
            {employees.map((emp, index) => (
              <TableRow key={index} highlighted={index % 2 !== 0}>
                <TableData>
                  <ProfileImg src="/images/profile.png" alt="profile" />
                  {emp.name}
                </TableData>
                <TableData>{emp.type}</TableData>
                <TableData>{emp.email}</TableData>
                <TableData>{emp.contact}</TableData>
                <TableData>{emp.date}</TableData>
              </TableRow>
            ))}
          </tbody>
        </TableContainer>

        <ActionButtons>
          <DeclineButton>Decline</DeclineButton>
          <ApproveButton>Approve</ApproveButton>
        </ActionButtons>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default OnLeaveModal;
