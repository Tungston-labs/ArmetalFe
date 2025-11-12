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
import Header from "../../Components/Header";
import ConfirmLeaveModal from '../../Components/ConfirmLeaveModal';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getLeaveDetails, patchLeaveStatus } from '../../Redux/leaveSlice';
import { useParams, useNavigate } from 'react-router-dom';
import EmployeeIcon from "../../assets/employeeicon.svg";
import Loader from "../../Components/Loader"
import { Label } from "../employee/BasicLevel.Styles";
import EmployeeTitle from "../../Components/EmployeeTitle";

const EmployeeLeaveForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { leaveDetails, loading, pendingLeaves } = useSelector(state => state.leave);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(getLeaveDetails(id));
    }
  }, [dispatch, id]);

  
  // useEffect(() => {
  //   if (leaveDetails?.employee?.id) {
  //     dispatch(getEmployeePendingLeaves(leaveDetails.employee.id));
  //   }
  // }, [leaveDetails?.employee?.id, dispatch]);

  const employee = leaveDetails?.employee || {};

  const handleStatusUpdate = async () => {
    if (!id || !actionType) return;
    const status = actionType === 'approve' ? 'approved' : 'rejected';
    try {
      await dispatch(patchLeaveStatus({ leaveId: id, status }));
      navigate("/employee-leave-request");
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

  // ✅ Determine paid or unpaid
  // const isPaidLeave = pendingLeaves === 0;

  return (
    <>
 
    <Container>
 <EmployeeTitle
        iconSrc={EmployeeIcon}
        showAddButton={false}
        showDropdown={false}
        showBackArrow={true}
        showTabs = {false}
        showSearch={false}
      />

      <Hr />
   <Header employee={employee}/>
 

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
      <Input
  type="text"
  style={{ width: '180px' }} 
  value={
    leaveDetails?.from_date
      ? `${leaveDetails.from_date} (${leaveDetails.from_date_type || ''})`
      : ''
  }
  readOnly
/>

    </DateField>
    <DateField>
      <Label>To</Label>
      <Input
  type="text"
  style={{ width: '180px' }} 
  value={
    leaveDetails?.to_date
      ? `${leaveDetails.to_date} (${leaveDetails.to_date_type || ''})`
      : ''
  }
  readOnly
/>

    </DateField>
  </RightSide>
</FlexRows>

      <SectionTitle>Leave Balance</SectionTitle>
      <TwoColumnRows>
        <Input
          placeholder="Pending Leaves"
          value={employee?.total_leave || ''} readOnly
          
        />
        <Input
          placeholder="0"
          value={employee?.paid_leave || ''}
          readOnly
        />
      </TwoColumnRows>

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
          onConfirm={handleStatusUpdate}
        />
      )}
    </Container>
    </>
  );
};

export default EmployeeLeaveForm;
