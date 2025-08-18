import {
  Container,
  Breadcrumb,
  InfoGrid,
  ProfileImage,
  TwoColumn,
  Input,
  SectionTitle,
  TextArea,
  FlexRow,
  ApproveButton,
  DeclineButton,
  TopBar,
  HRManager,
  TitleSection,
  Title,
  LeftSide,
  Subtitle,
  Hr,
  RightSide,
  InfoSection,
  FullWidthInput,
  TwoColumnRow,
  TwoColumnRows,
  FlexRows,
  DateField
} from "./EmployeeLeaveDetails.Styles";
import { LuArrowLeft } from "react-icons/lu";
import ConfirmLeaveModal from '../../Components/ConfirmLeaveModal';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getLeaveDetails, patchLeaveStatus } from '../../Redux/leaveSlice';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import EmployeeIcon from "../../assets/employeeicon.svg";

const EmployeeLeaveForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { leaveDetails, loading } = useSelector(state => state.leave);
const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(getLeaveDetails(id));
    }
  }, [dispatch, id]);

  const employee = leaveDetails?.employee || {};

const handleStatusUpdate = async () => {
  if (!id || !actionType) return;

  const status = actionType === 'approve' ? 'approved' : 'rejected';

  try {
    await dispatch(patchLeaveStatus({ leaveId: id, status }));
    // Optionally refresh local state if staying on page
    // dispatch(getLeaveDetails(id));
    
    navigate(-1); // 👈 Go back to the previous page after updating
  } catch (error) {
    console.error("Error updating leave status:", error);
  } finally {
    setShowModal(false);
    setActionType('');
  }
};


  return (
    <Container>
      {/* <TopBar>
        <div />
        <HRManager>
          <img src="/images/user.jpg" alt="HR Manager" />
          <span>HR Manager</span>
        </HRManager>
      </TopBar> */}

      <TitleSection>
         <LuArrowLeft
  style={{ width: "30px", height: 30, cursor: "pointer" }}
  onClick={() => navigate(-1)} // 👈 Go back to previous page
/>
        <img src={EmployeeIcon} alt="employeeIcon" style={{ height: "60px" }} />
        <div>
     
          <Title>Employee</Title>
          <Subtitle>Manage your Employee.</Subtitle>
        </div>
      </TitleSection>

      <Hr />
      <Breadcrumb>
        Employee &gt; Leave request &gt; Employee leave details
      </Breadcrumb>

      <InfoGrid>
        <div style={{ width: "10%" }}>
          <ProfileImage
            src={employee.profile_pic}
            alt="Employee"
          />
        </div>
        <div style={{ display: "flex", width: "90%", justifyContent: "space-between" }}>
          <TwoColumn>
            <Input placeholder="Name" value={employee.name || ''} readOnly />
            <Input placeholder="Employee ID" value={employee.employee_id || ''} readOnly />
            <Input placeholder="Email ID" value={employee.email || ''} readOnly />
          </TwoColumn>

          <InfoSection>
            <FullWidthInput placeholder="Address" value={employee.address || ''} readOnly />
            <TwoColumnRow>
              <Input placeholder="DOB" value={employee.dob || ''} readOnly />
              <Input placeholder="Gender" value={employee.gender || ''} readOnly />
            </TwoColumnRow>
          </InfoSection>
        </div>
      </InfoGrid>

      <Hr />
      <SectionTitle>Job Details</SectionTitle>
      <TwoColumnRows>
        <Input placeholder="Job position / Designation" value={employee.designation || ''} readOnly />
        <Input placeholder="Employment Type" value={employee.employment_type || ''} readOnly />
      </TwoColumnRows>
      <TwoColumnRows>
        <Input placeholder="Department" value={employee.department || ''} readOnly />
        <Input placeholder="Joining Date" value={employee.joining_date || ''} readOnly />
      </TwoColumnRows>

      <SectionTitle>Leave Application</SectionTitle>
      <FlexRows>
        <LeftSide>
          <Input placeholder="Leave Type" value={leaveDetails?.leave_type || ''} readOnly />
        </LeftSide>
        <RightSide>
          <DateField>
            <label>From</label>
            <Input type="date" value={leaveDetails?.from_date || ''} readOnly />
          </DateField>
          <DateField>
            <label>To</label>
            <Input type="date" value={leaveDetails?.to_date || ''} readOnly />
          </DateField>
        </RightSide>
      </FlexRows>

      <SectionTitle>Reason for Leave</SectionTitle>
      <TextArea value={leaveDetails?.reason || ''} readOnly />

      <FlexRow>
        <DeclineButton onClick={() => {
          setActionType('rejected');
          setShowModal(true);
        }}>Decline</DeclineButton>

        <ApproveButton onClick={() => {
          setActionType('approve');
          setShowModal(true);
        }}>Approve</ApproveButton>
      </FlexRow>

      {showModal && (
        <ConfirmLeaveModal
          onClose={() => setShowModal(false)}
          onConfirm={handleStatusUpdate}
          actionType={actionType}
        />
      )}
    </Container>
  );
};

export default EmployeeLeaveForm;
