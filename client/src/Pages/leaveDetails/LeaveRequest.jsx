import React, { useState } from 'react';
import {
  Container, Tab,
  SearchInput, AddButton, Table, TableHead, TableRow, TableCell,
  ProfileImage, ActionButtons, DeclineButton, ApproveButton, TopBar,
  HRManager, HeaderSection, TitleSection, Tabs, Title, Subtitle, ActionArea
} from './LeaveRequest.Styles';

import { LuArrowLeft } from "react-icons/lu";
import { FaPlus } from 'react-icons/fa';
import { IoEyeOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

import ConfirmLeaveModal from '../../Components/ConfirmLeaveModal'; // ✅ Import modal

const data = new Array(5).fill({
  name: 'Athul krishna',
  leaveType: 'Sick leave',
  email: 'Athuluixix@gmail.com',
  contact: '6235689542',
  Date: '11/12/2025-12/12/2025',
  profile: 'https://i.pravatar.cc/40?img=12'
});

export default function LeaveRequest() {
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('approve');
const navigate = useNavigate();

  const handleConfirm = () => {
    console.log(`Leave ${actionType}d`);
    setShowModal(false);
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
          <AddButton><FaPlus /> Add Department</AddButton>
          <SearchInput type="text" placeholder="Search by Department name" />
        </ActionArea>
      </HeaderSection>

      <Tabs>
        <Tab active>Employee list</Tab>
        <Tab>Employee leave request</Tab>
        <Tab>Employee Attendance</Tab>
        <Tab>Employee Visa</Tab>
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
          {data.map((row, i) => (
            <TableRow key={i}>
              <TableCell><ProfileImage src={row.profile} alt="profile" /> {row.name}</TableCell>
              <TableCell>{row.leaveType}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.contact}</TableCell>
              <TableCell>{row.Date}</TableCell>
             <TableCell>
  <IoEyeOutline
    style={{ fontSize: '18px', color: '#5F53A5', cursor: 'pointer' }}
    onClick={() => navigate('/leave-details')}
  />
</TableCell>

              <TableCell>
                <ActionButtons>
                  <DeclineButton onClick={() => {
                    setActionType('decline');
                    setShowModal(true);
                  }}>
                    Decline
                  </DeclineButton>

                  <ApproveButton onClick={() => {
                    setActionType('approve');
                    setShowModal(true);
                  }}>
                    Approve
                  </ApproveButton>
                </ActionButtons>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      {/* ✅ Confirmation Modal */}
      {showModal && (
        <ConfirmLeaveModal
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
          actionType={actionType}
        />
      )}
    </Container>
  );
}
