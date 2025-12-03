import React from "react";
import {
  Overlay,
  ModalWrapper,
  HeaderBar,
  BackButton,
  EditButton,
  ContentArea,
  TwoColumnWrapper,
  LeftSide,
  RightSide
} from "./RightSideModal.styles";
import { CiEdit } from "react-icons/ci";
import EmployeeDetails from "./EmployeeDetails";
import ProgressCard from "./ProgressCard";
import WeeklyTaskGraph from "./WeeklyTaskGraph";
import { useNavigate } from "react-router-dom";

const RightSideModal = ({ isOpen, onClose, onEdit, employee }) => {
  const navigate = useNavigate();

    const data = [
    { day: "Mon", tasksCompleted: 5 },
    { day: "Tue", tasksCompleted: 3 },
    { day: "Wed", tasksCompleted: 7 },
    { day: "Thu", tasksCompleted: 4 },
    { day: "Fri", tasksCompleted: 6 },
    { day: "Sat", tasksCompleted: 2 },
    { day: "Sun", tasksCompleted: 0 },
  ];
  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />

      <ModalWrapper isOpen={isOpen}>
        <HeaderBar>
          <BackButton onClick={onClose}>← Back</BackButton>
     <EditButton onClick={() => navigate(`/ViewBasic/${employee?.id}`)}>
  Edit <CiEdit />
</EditButton>

        </HeaderBar>
 <ContentArea>
        <EmployeeDetails employee={employee} />
     

       
   <TwoColumnWrapper>
  <LeftSide>
    <ProgressCard key={isOpen ? "progress-open" : "progress-close"} />
  </LeftSide>

  <RightSide>
    <WeeklyTaskGraph
      key={isOpen ? "graph-open" : "graph-close"}
      weeklyData={data}
    />
  </RightSide>
</TwoColumnWrapper>

        </ContentArea>

      </ModalWrapper>
    </>
  );
};

export default RightSideModal;
