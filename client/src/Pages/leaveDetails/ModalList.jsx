import React, { useState, useEffect } from "react";
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

const OnLeaveModal = ({ onClose, employeeId, date }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [employeesOnLeave, setEmployeesOnLeave] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionType, setActionType] = useState(""); // 👈 approve / reject
  const dispatch = useDispatch();

  // Fetch leave details for employee + date
  useEffect(() => {
    if (!employeeId || !date) return;

    const fetchOnLeaves = async () => {
      setLoading(true);
      try {
        const res = await API.get(
          `/department/${employeeId}/on-leaves/?date=${date}`
        );
        setEmployeesOnLeave(res.data.on_leave || []);
      } catch (error) {
        console.error("Error fetching employees on leave:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOnLeaves();
  }, [employeeId, date]);

  // handle approve / reject
  const handleConfirm = async () => {
    if (!employeesOnLeave.length) return;

    const leaveId = employeesOnLeave[0]?.id; // 👈 assuming backend sends `id` for leave
    if (!leaveId) {
      console.error("Leave ID not found in response");
      return;
    }

    const status = actionType === "approve" ? "approved" : "rejected";

    try {
      await dispatch(patchLeaveStatus({ leaveId, status }));
      onClose(); // close modal after success
    } catch (error) {
      console.error("Error updating leave status:", error);
    } finally {
      setShowConfirmModal(false);
      setActionType("");
    }
  };

  return (
    <>
      <ModalOverlay>
        <ModalContainer>
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
              </tr>
            </TableHeader>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              ) : employeesOnLeave.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No leave record found for this employee.
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
                      {emp.from_date} to {emp.to_date}
                    </TableData>
                  </TableRow>
                ))
              )}
            </tbody>
          </TableContainer>

          <ActionButtons>
            <DeclineButton
              onClick={() => {
                setActionType("reject");
                setShowConfirmModal(true);
              }}
            >
              Reject
            </DeclineButton>

            <ApproveButton
              onClick={() => {
                setActionType("approve");
                setShowConfirmModal(true);
              }}
            >
              Approve
            </ApproveButton>
          </ActionButtons>
        </ModalContainer>
      </ModalOverlay>

      {showConfirmModal && (
        <ConfirmLeaveModal
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirm}
          actionType={actionType}
        />
      )}
    </>
  );
};

export default OnLeaveModal;
