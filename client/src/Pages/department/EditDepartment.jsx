import React from 'react';
import {
  Container,
  HeaderSection,
  IconTitle,TopBar,
  Title,ActionArea,
Subtitle,
  FormSection,
  InputGroup,
  Label,
  Input,SearchInput,
  TableWrapper,StyledIcon,
  StyledTable,
  Avatar,AddButton,HRManager,
  IconButton,TitleSection,
} from '../department/DepartmentDetails.Styles';
import { FaPlus, FaInfoCircle, FaTrash } from 'react-icons/fa';
import { HiOutlinePencilSquare } from "react-icons/hi2";
const employees = [
  {
    id: '001',
    name: 'Ajay kumar',
    employeeId: '1254125',
    email: 'Ajaykumar@gmail.com',
    position: 'UI/UX designer',
    department: 'Design Department',
    avatar: 'https://i.pravatar.cc/40?img=3',
  },
    {
    id: '001',
    name: 'Ajay kumar',
    employeeId: '1254125',
    email: 'Ajaykumar@gmail.com',
    position: 'UI/UX designer',
    department: 'Design Department',
    avatar: 'https://i.pravatar.cc/40?img=3',
  },
   {
    id: '001',
    name: 'Ajay kumar',
    employeeId: '1254125',
    email: 'Ajaykumar@gmail.com',
    position: 'UI/UX designer',
    department: 'Design Department',
    avatar: 'https://i.pravatar.cc/40?img=3',
  },
   {
    id: '001',
    name: 'Ajay kumar',
    employeeId: '1254125',
    email: 'Ajaykumar@gmail.com',
    position: 'UI/UX designer',
    department: 'Design Department',
    avatar: 'https://i.pravatar.cc/40?img=3',
  },
   {
    id: '001',
    name: 'Ajay kumar',
    employeeId: '1254125',
    email: 'Ajaykumar@gmail.com',
    position: 'UI/UX designer',
    department: 'Design Department',
    avatar: 'https://i.pravatar.cc/40?img=3',
  },
   {
    id: '001',
    name: 'Ajay kumar',
    employeeId: '1254125',
    email: 'Ajaykumar@gmail.com',
    position: 'UI/UX designer',
    department: 'Design Department',
    avatar: 'https://i.pravatar.cc/40?img=3',
  },
  // Repeat or map real data
];

const DepartmentDetail = () => {
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
                        {/* > <LuArrowLeft style={{ width: "36px", height: 36 }} / */}
                         <img src="/images/department.png" alt="Icon" style={{ height: "74px" }} />
                         <div>
                           <Title>Department</Title>
                           <Subtitle>Manage all departments within the organization.</Subtitle>
                         </div>
                       </TitleSection>
              <ActionArea>
           <AddButton>
  <StyledIcon /> Save
</AddButton>

              
              </ActionArea>
            </HeaderSection>
      <FormSection>
        <InputGroup>
          <Label>Department name</Label>
          <Input defaultValue="QA / Testing" />
        </InputGroup>
        <InputGroup>
          <Label>Department Code Name</Label>
          <Input defaultValue="Q&A" />
        </InputGroup>
        <InputGroup>
          <Label>Department head</Label>
          <Input defaultValue="Ajay kumar" />
        </InputGroup>
      </FormSection>

      <h3>Added employee list</h3>
      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Employee name</th>
              <th>Employee ID</th>
              <th>Email ID</th>
              <th>Job Position</th>
              <th>Department</th>
              <th>Info</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={index}>
                <td>{emp.id}</td>
                <td>
                  <Avatar src={emp.avatar} alt="profile" />
                  {emp.name}
                </td>
                <td>{emp.employeeId}</td>
                <td>{emp.email}</td>
                <td>{emp.position}</td>
                <td>{emp.department}</td>
                <td>
                  <IconButton><FaInfoCircle /></IconButton>
                </td>
                <td>
                  <IconButton danger><FaTrash /></IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>
    </Container>
  );
};

export default DepartmentDetail;
