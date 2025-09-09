import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import API from "../../services/api";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
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
import { useDispatch } from "react-redux";
import { patchLeaveStatus } from "../../Redux/leaveSlice";

const OnLeaveModal = ({ onClose, employeeId, date, leaveId }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [employeesOnLeave, setEmployeesOnLeave] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionType, setActionType] = useState("");
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const dispatch = useDispatch();

  const openConfirmModal = (leaveId, type) => {
    console.log("Opening confirm modal for leave ID:", leaveId, "action:", type);
    setSelectedLeaveId(leaveId);
    setActionType(type);
    setShowConfirmModal(true);
  };


  // Fetch leaves for this employee
  useEffect(() => {
    if (!employeeId || !date) return;

    const fetchOnLeaves = async () => {
      setLoading(true);
      try {
        const res = await API.get(
          `/department/${employeeId}/on-leaves/?date=${date}`
        );
        console.log("API response:", res.data);
        setEmployeesOnLeave(res.data.on_leave || []);
      } catch (error) {
        console.error("Error fetching employees on leave:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOnLeaves();
  }, [employeeId, date]);

  const handleConfirm = async () => {
    if (!selectedLeaveId) return;

    const status = actionType === "approve" ? "approved" : "rejected";

    try {
      await dispatch(patchLeaveStatus({ leaveId: selectedLeaveId, status }));
      onClose();
    } catch (error) {
      console.error("Error updating leave status:", error);
    } finally {
      setShowConfirmModal(false);
      setActionType("");
      setSelectedLeaveId(null);
    }
  };

  return ReactDOM.createPortal(
    <>
      <ModalOverlay zIndex={1000}>
        <ModalContainer zIndex={1001}>
          <ModalHeader>
            <h2>Employee Leave Details</h2>
          </ModalHeader>

          <TableContainer>
            <TableHeader>
              <tr>
                <th>Employee name</th>
                <th>Leave type</th>
                <th>Email ID</th>
                <th>Contact number</th>
                <th>Start date to end date</th>
                <th>Actions</th>
              </tr>
            </TableHeader>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              ) : employeesOnLeave.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No leave record found.
                  </td>
                </tr>
              ) : (
                employeesOnLeave.map((emp, index) => (
                  <TableRow key={index} $highlighted={index % 2 !== 0}>
                    <TableData>
                      <ProfileImg src="/images/profile.png" alt="profile" />
                      {emp.employee_name}
                    </TableData>
                    <TableData>{emp.leave_type}</TableData>
                    <TableData>{emp.email}</TableData>
                    <TableData>{emp.phone}</TableData>
                    <TableData>
                      {emp.from_date} to {emp.to_date}
                    </TableData>
                    <TableData>
                      <ApproveButton
                        onClick={() => openConfirmModal(emp.id, "approve")}
                      >
                        Approve
                      </ApproveButton>
                      <DeclineButton
                        onClick={() => openConfirmModal(emp.id, "reject")}
                      >
                        Reject
                      </DeclineButton>


                    </TableData>
                  </TableRow>
                ))
              )}
            </tbody>
          </TableContainer>

          <ActionButtons>
            <DeclineButton onClick={onClose}>Close</DeclineButton>
          </ActionButtons>
        </ModalContainer>
      </ModalOverlay>

      {showConfirmModal && selectedLeaveId && (
        <ConfirmLeaveModal
          leaveId={selectedLeaveId}
          actionType={actionType}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirm}
          zIndex={2000}
        />
      )}

    </>,
    document.body
  );
};

export default OnLeaveModal;
