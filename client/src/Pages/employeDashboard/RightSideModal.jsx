import React, { useEffect, useState } from "react";
import {
  Overlay,
  ModalWrapper,
  HeaderBar,
  BackButton,
  EditButton,
  ContentArea,
  TwoColumnWrapper,
  LeftSide,
  RightSide,
} from "./RightSideModal.styles";
import { CiEdit } from "react-icons/ci";
import EmployeeDetails from "./EmployeeDetails";
import ProgressCard from "./ProgressCard";
import WeeklyTaskGraph from "./WeeklyTaskGraph";
import { useNavigate } from "react-router-dom";
import { fetchEmployeeDashboard } from "../../services/employeeService";

const RightSideModal = ({ isOpen, onClose, employeeId }) => {
  const navigate = useNavigate();

  const [empData, setEmpData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !employeeId) return;

    setLoading(true);

    fetchEmployeeDashboard(employeeId)
      .then((res) => {
        setEmpData(res);
      })
      .catch((err) => {})
      .finally(() => setLoading(false));
  }, [isOpen, employeeId]);

  if (!isOpen) return null;

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      <ModalWrapper isOpen={isOpen}>
        <HeaderBar>
          <BackButton onClick={onClose}>← Back</BackButton>
          <EditButton onClick={() => navigate(`/ViewBasic/${employeeId}`)}>
            Edit <CiEdit />
          </EditButton>
        </HeaderBar>

        <ContentArea>
          {loading && <p>Loading...</p>}

          {empData && (
            <>
              <EmployeeDetails employee={empData} />

              <TwoColumnWrapper>
                <LeftSide>
                  <ProgressCard attendanceGraph={empData.attendance_graph} />
                </LeftSide>

                <RightSide>
                  <WeeklyTaskGraph
                    weeklyData={Object.entries(empData.task_graph).map(
                      ([day, value]) => ({ day, tasksCompleted: value }),
                    )}
                  />
                </RightSide>
              </TwoColumnWrapper>
            </>
          )}
        </ContentArea>
      </ModalWrapper>
    </>
  );
};

export default RightSideModal;
