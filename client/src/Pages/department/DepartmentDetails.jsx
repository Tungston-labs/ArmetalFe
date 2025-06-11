import React from 'react';
import {
  Container,
  HeaderSection,
  IconTitle,
  Title,
  SubTitle,
  FormSection,
  InputGroup,
  Label,
  Input,
  TableWrapper,
  StyledTable,
  Avatar,
  IconButton,
} from '../department/DepartmentDetails.Styles';
import { FaArrowLeft, FaInfoCircle, FaTrash } from 'react-icons/fa';

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
      <HeaderSection>
        <IconTitle>
          <FaArrowLeft />
          <div>
            <Title>Department</Title>
            <SubTitle>Manage all departments within the organization.</SubTitle>
          </div>
        </IconTitle>
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
