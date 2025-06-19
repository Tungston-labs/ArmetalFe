import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLeaveRequests, patchLeaveStatus } from '../../Redux/leaveSlice';
import { NavLink, useNavigate } from 'react-router-dom';
import { IoEyeOutline } from 'react-icons/io5';
import { FaInfoCircle, FaTrash, FaPlus } from "react-icons/fa";
import { LuArrowLeft } from "react-icons/lu";
import ConfirmLeaveModal from '../../Components/ConfirmLeaveModal';

import {
  Container,
  Table,
  TableRow,
  TableHead,
  TableCell,
  ProfileImage,
  ActionButtons,
  DeclineButton,
  ApproveButton,
  Tab,
  SearchInput,
  AddButton,
  Pagination,
  TopBar,
  HRManager,
  HeaderSection,
  TitleSection,
  Tabs,
  Title,
  Subtitle,
  ActionArea
} from './LeaveRequest.Styles';

export default function LeaveRequest() {
  const dispatch = useDispatch();
  const { leaves, loading } = useSelector(state => state.leave);
  const [actionType, setActionType] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getLeaveRequests());
  }, [dispatch]);

  const leaveData = leaves?.results || [];

  // Filter leaves by employee name or ID
  const filteredLeaves = leaveData.filter((leave) => {
    const name = leave?.employee?.name?.toLowerCase() || '';
    const empId = leave?.employee?.employee_id?.toLowerCase() || '';
    const search = searchText.toLowerCase();
    return name.includes(search) || empId.includes(search);
  });

  const handleStatusUpdate = async () => {
    if (!selectedLeave || !actionType) return;

    const status = actionType === 'approve' ? 'approved' : 'rejected';

    try {
      await dispatch(patchLeaveStatus({ leaveId: selectedLeave.id, status }));
      dispatch(getLeaveRequests()); // Refresh list
    } catch (error) {
      console.error('Error updating leave status:', error);
    } finally {
      setShowModal(false);
      setSelectedLeave(null);
      setActionType('');
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <Container>
      <TopBar>
        <div />
        <HRManager>
          <img src="https://i.pravatar.cc/40?img=5" alt="HR Manager" />
          <span>HR Manager</span>
        </HRManager>
      </TopBar>

      <HeaderSection>
        <TitleSection>
          <LuArrowLeft style={{ width: "30px", height: 30 }} />
          <img src="/images/employee.png" alt="Payroll Icon" style={{ height: "50px" }} />
          <div>
            <Title>Employee</Title>
            <Subtitle>Manage your Employee.</Subtitle>
          </div>
        </TitleSection>

        <ActionArea>
          <AddButton onClick={() => navigate('/basic-details')}>
            <FaPlus /> Add Employee
          </AddButton>
          <SearchInput
            type="text"
            placeholder="Search by employee name or ID"
            value={searchText}
            onChange={handleSearch}
          />
        </ActionArea>
      </HeaderSection>

      <Tabs>
        <NavLink to="/employee" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/employee'}>Employee list</Tab>
        </NavLink>
        <NavLink to="/leave-request" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/leave-request'}>Employee leave request</Tab>
        </NavLink>
        <NavLink to="/on-leave" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/on-leave'}>Employee Attendance</Tab>
        </NavLink>
        <NavLink to="/employee-visa" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/employee-visa'}>Employee Visa</Tab>
        </NavLink>
      </Tabs>

      <Table>
        <thead>
          <TableRow>
            <TableHead>Employee name</TableHead>
            <TableHead>Leave type</TableHead>
            <TableHead>Email ID</TableHead>
            <TableHead>Contact number</TableHead>
            <TableHead>StartDate and EndDate</TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
          </TableRow>
        </thead>
        <tbody>
          {loading ? (
            <TableRow><TableCell colSpan="7">Loading...</TableCell></TableRow>
          ) : filteredLeaves.length === 0 ? (
            <TableRow><TableCell colSpan="7">No matching leave requests found.</TableCell></TableRow>
          ) : (
            filteredLeaves.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>
                  <ProfileImage
                    src={leave?.employee?.profile_pic || '/images/default.png'}
                    alt="profile"
                  />
                  {leave?.employee?.name || 'N/A'}
                </TableCell>

                <TableCell>{leave.leave_type}</TableCell>
                <TableCell>{leave.employee.email}</TableCell>
                <TableCell>{leave.employee.phno}</TableCell>
                <TableCell>{leave.from_date} - {leave.to_date}</TableCell>
                <TableCell>
                  <IoEyeOutline
                    onClick={() => navigate(`/leave-details/${leave.id}`)}
                    style={{ cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell>
                  <ActionButtons>
                    <DeclineButton onClick={() => {
                      setSelectedLeave(leave);
                      setActionType('rejected');
                      setShowModal(true);
                    }}>
                      Decline
                    </DeclineButton>

                    <ApproveButton onClick={() => {
                      setSelectedLeave(leave);
                      setActionType('approve');
                      setShowModal(true);
                    }}>
                      Approve
                    </ApproveButton>
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))
          )}
        </tbody>
      </Table>

      {showModal && (
        <ConfirmLeaveModal
          onClose={() => setShowModal(false)}
          onConfirm={handleStatusUpdate}
          actionType={actionType}
        />
      )}
    </Container>
  );
}
