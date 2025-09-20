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
  DateField,
  EmployeeImage,
  BackArrow,
  ProfileImageWrapper
} from "./EmployeeLeaveDetails.Styles";
import { LuArrowLeft } from "react-icons/lu";
import ConfirmLeaveModal from '../../Components/ConfirmLeaveModal';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getLeaveDetails, patchLeaveStatus } from '../../Redux/leaveSlice';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import EmployeeIcon from "../../assets/employeeicon.svg";
import Loader from "../../Components/Loader"
import { Label } from "../employee/BasicLevel.Styles";
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
      navigate("/employee-leave-request");   // ✅ go back to leave-request page
    } catch (error) {
      console.error("Error updating leave status:", error);
    } finally {
      setShowModal(false);
      setActionType('');
    }
  };
  
if (loading) {
  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
      <Loader color="#003366" size={15} />
    </div>
  );
}


  return (
    <Container>
      

      <TitleSection style={{color:"#3250B5"}}>
      <BackArrow onClick={() => navigate("/employee-leave-request")} />

  <EmployeeImage  src={EmployeeIcon} alt="employeeIcon" />
        <div>
     
          <Title>Employee</Title>
          <Subtitle>Manage your Employee.</Subtitle>
        </div>
      </TitleSection>

      <Hr />
    
      <InfoGrid>
       <ProfileImageWrapper>
  <ProfileImage src={employee.profile_pic} alt="Employee" />
</ProfileImageWrapper>

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
            <Label>From</Label>
            <Input type="date" value={leaveDetails?.from_date || ''} readOnly />
          </DateField>
          <DateField>
            <Label>To</Label>
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
    actionType={actionType}
    leaveId={id}
    onConfirm={handleStatusUpdate}   // ✅ pass handler
  />
)}

        
      
    </Container>
  );
};

export default EmployeeLeaveForm;
