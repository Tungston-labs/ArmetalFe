// LeaveRequest.jsx
import React from 'react';
import {
  Container,   Tab, 
  SearchInput, AddButton, Table, TableHead, TableRow, TableCell,
  ProfileImage, ActionButtons, DeclineButton, ApproveButton,TopBar,
  HRManager,HeaderSection,TitleSection,Tabs,Title,Subtitle,ActionArea
} from './LeaveRequest.Styles';
import { LuArrowLeft } from "react-icons/lu";
import{FaPlus} from 'react-icons/fa';
import { IoEyeOutline } from "react-icons/io5";
const data = new Array(5).fill({
  name: 'Athul krishna',
  leaveType: 'Sick leave',
  email: 'Athuluixix@gmail.com',
  contact: '6235689542',
  note: 'dummy dummy dummy dummeee',
  profile: 'https://i.pravatar.cc/40?img=12' // mock profile image
});

export default function LeaveRequest() {
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
                 <LuArrowLeft style={{width:"30px", height:30}} />
                                <img src="/images/employee.png" alt="Payroll Icon" style={{ height: "50px" }} />
                                <div>
                                  <Title>Employee</Title>
                                  <Subtitle>Manage your Employee.</Subtitle>
                                </div>
                 </TitleSection>
                 <ActionArea>
                   <AddButton onClick={() => setShowModal(true)}><FaPlus /> Add Department</AddButton>
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
            <TableHead>Note</TableHead>
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
              <TableCell>{row.note}</TableCell>
           <TableCell>
    <IoEyeOutline style={{ fontSize: '18px', color: '#5F53A5' }} />
  </TableCell>

              <TableCell>
                <ActionButtons>
                  
                  <DeclineButton>Decline</DeclineButton>
                  <ApproveButton>Approve</ApproveButton>
                </ActionButtons>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
