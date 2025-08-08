import React, { useState } from "react";
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

import ConfirmLeaveModal from "../../Components/ConfirmLeaveModal"; // import confirmation modal

const employees = [
  {
    name: "xxxxxxxx",
    type: "Sick leave",
    email: "xxxxxxxxxgmail.com",
    contact: "6235689542",
    date: "12-11-2025 To 15-11-2025",
  },
  // Add more if needed
];

const OnLeaveModal = ({ onClose }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleApprove = () => {
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    // handle confirmed approval logic here
    setShowConfirmModal(false);
    onClose(); // close main modal after approval
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
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
            <DeclineButton onClick={onClose}>Decline</DeclineButton>
            <ApproveButton onClick={handleApprove}>Approve</ApproveButton>
          </ActionButtons>
        </ModalContainer>
      </ModalOverlay>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <ConfirmLeaveModal
          onClose={handleCancelConfirm}
          onConfirm={handleConfirm}
          actionType="approve"
        />
      )}
    </>
  );
};

export default OnLeaveModal;
