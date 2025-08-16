import React, { useState, useEffect } from "react";
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

import ConfirmLeaveModal from "../../Components/ConfirmLeaveModal";

const OnLeaveModal = ({ onClose, departmentId, date }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [department, setDepartment] = useState(null);
  const [employeesOnLeave, setEmployeesOnLeave] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch employees on leave
  useEffect(() => {
    if (!departmentId || !date) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://178.248.112.16:8001/api/department/${departmentId}/on-leaves/?date=${date}`
        );
        const data = await response.json();
        console.log("API Response:", data);

        setDepartment(data.department);
        setEmployeesOnLeave(data.on_leave || []);
      } catch (error) {
        console.error("Error fetching employees on leave:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [departmentId, date]);

  const handleApprove = () => setShowConfirmModal(true);

  const handleConfirm = () => {
    // handle approval logic here
    setShowConfirmModal(false);
    onClose();
  };

  const handleCancelConfirm = () => setShowConfirmModal(false);

  return (
    <>
      <ModalOverlay>
        <ModalContainer>
          <ModalHeader>
            <h2>Employees on leave</h2>
          </ModalHeader>

          {department && (
            <>
              <FieldRow>
                <InputField
                  label="Department name"
                  value={department.name}
                  readOnly
                />
                <InputField
                  label="Department Code Name"
                  value={department.name?.slice(0, 3).toUpperCase()}
                  readOnly
                />
              </FieldRow>
              <FieldRow>
                <InputField label="Department head" value="Ajay kumar" readOnly />
              </FieldRow>
            </>
          )}

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
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>Loading...</td>
                </tr>
              ) : employeesOnLeave.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No employees on leave for this date.
                  </td>
                </tr>
              ) : (
                employeesOnLeave.map((emp, index) => (
                  <TableRow key={index} highlighted={index % 2 !== 0}>
                    <TableData>
                      <ProfileImg src="/images/profile.png" alt="profile" />
                      {emp.employee_name}
                    </TableData>
                    <TableData>{emp.leave_type}</TableData>
                    <TableData>{emp.email}</TableData>
                    <TableData>{emp.phone}</TableData>
                    <TableData>
                      {emp.from_date} - {emp.to_date}
                    </TableData>
                  </TableRow>
                ))
              )}
            </tbody>
          </TableContainer>


          <ActionButtons>
            <DeclineButton onClick={onClose}>Decline</DeclineButton>
            <ApproveButton onClick={handleApprove}>Approve</ApproveButton>
          </ActionButtons>
        </ModalContainer>
      </ModalOverlay>

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
