import React from 'react';
import {
  Container,
  Header,
  TitleSection,
  Title,
  Subtitle,
  SearchInput,
  TableWrapper,
  Table,
  Th,
  Td,
  Select,
  TopBar,
  HRManager
} from './Payroll.styles';
import { LuArrowLeft } from "react-icons/lu";
const data = Array(10).fill({
  slNo: '001',
  empID: '1254/125',
  name: 'Ajay Kumar',
  job: 'UI/UX designer',
  joinDate: '12 January 2025',
  email: 'Ajaykumar@gmail.com',
  salary: '₹19,000',
});

const PayrollTable = () => {
  return (
    <Container>
 

        <TopBar>
  <div /> {/* keeps left side empty */}
  <HRManager>
    <img src="https://i.pravatar.cc/40?img=5" alt="HR Manager" />
    <span>HR Manager</span>
  </HRManager>
</TopBar>

     

   <Header>
  <TitleSection>
 <LuArrowLeft style={{width:"30px", height:30}} />
    <img src="/images/payroll.png" alt="Payroll Icon" style={{ height: "51px" }} />
    <div>
      <Title>Payroll And Holiday</Title>
      <Subtitle>Unifying Teams. Simplifying Operations</Subtitle>
    </div>
  </TitleSection>
  
</Header>
        <SearchInput placeholder="Search by Employee name" />


      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th></Th>
              <Th>Sl No</Th>
              <Th>Employee ID</Th>
              <Th>Employee name</Th>
              <Th>Job Position</Th>
              <Th>Joining Date</Th>
              <Th>Email ID</Th>
              <Th>Salary Details</Th>
              <Th>Info</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <Td><input type="checkbox" /></Td>
                <Td>{row.slNo}</Td>
                <Td>{row.empID}</Td>
                <Td>{row.name}</Td>
                <Td>{row.job}</Td>
                <Td>{row.joinDate}</Td>
                <Td>{row.email}</Td>
                <Td>{row.salary}</Td>
                <Td>🛈</Td>
                <Td>
                  <Select>
                    <option>Select</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </Select>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export default PayrollTable;
