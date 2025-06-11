 import React from "react";
 import {
   Container,
   Header,
   Tabs,
   Tab,
   Table,
   Title,
 
  TopBar,
   ProfileImg,
   ActionIcons,
   Pagination,
   SearchInput,
   AddButton,
   HRManager,
   HeaderSection,
  Subtitle,
   Icon,
 ActionArea,
   RightSection,
   TitleSection
 } from "./EmployeeList.styles";
 import { FaInfoCircle, FaTrash,FaPlus } from "react-icons/fa";
 import { FiUserPlus } from "react-icons/fi";
 import { LuArrowLeft } from "react-icons/lu";
 
 const employees = new Array(11).fill({
   slNo: "001",
   name: "Ajay kumar",
   id: "1254125",
   email: "Ajaykumar@gmail.com",
  visa: "9876543",
   dept: "Design Department",
 });
 
 const EmployeeList = () => {
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
           <tr>
             <th>Sl No</th>
             <th>Employee name</th>
             <th>Employee ID</th>
             <th>Email ID</th>
             <th>Visa expiry</th>
      
             <th>Info</th>
             <th>Delete</th>
           </tr>
         </thead>
         <tbody>
           {employees.map((emp, index) => (
             <tr key={index}>
               <td>{emp.slNo}</td>
               <td>
                 <ProfileImg src="/profile-placeholder.png" alt="profile" />
                 {emp.name}
               </td>
               <td>{emp.id}</td>
               <td>{emp.email}</td>
               <td>{emp.visa}</td>
             
               <td>
                 <FaInfoCircle />
               </td>
               <td>
                 <FaTrash color="red" />
               </td>
             </tr>
           ))}
         </tbody>
       </Table>
 
       <Pagination>
         <span>&larr;</span>
         <span className="active">1</span>
         <span>2</span>
         <span>3</span>
         <span>4</span>
         <span>5</span>
         <span>&rarr;</span>
       </Pagination>
     </Container>
   );
 };
 
 export default EmployeeList;
 