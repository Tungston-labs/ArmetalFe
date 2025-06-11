// src/Components/CompanyTable.jsx
import React from 'react';
import {
  Container,
  Header,
  Title,
  Subtitle,
  TopBar,
  AddButton,
  SearchInput,
  TableWrapper,
  Table,
  Th,
  Td,
  IconButton,
  ImpersonateButton,
  Pagination,
  HeaderSection,
  TitleSection,
  Icon,
  ActionArea,
  HRManager
} from './SuperAdmin.Styles';
import { LuArrowLeft } from "react-icons/lu";
import { FaEdit, FaTrashAlt,FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { TbPencilMinus } from "react-icons/tb";
const dummyData = Array(9).fill({
  slNo: '01',
  companyName: 'Armetal',
  address: 'Dummy address dummy Dummy address...',
  companyID: '12232231',
  contact: '7856523654',
  employees: '112',
});


const CompanyTable = () => {
    const navigate = useNavigate(); 
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
                <img src="/images/superadmin.png" alt="Payroll Icon" style={{ height: "50px" }} />
                <div>
                  <Title>Super admin</Title>
                  <Subtitle>Manage all departments within the organization.</Subtitle>
                </div>
              </TitleSection>
            <ActionArea>
             <AddButton onClick={() => navigate('/add-company')}>
  <FaPlus /> Add Company
</AddButton>

              <SearchInput type="text" placeholder="Search by Department name" />
            </ActionArea>
          </HeaderSection>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>Sl no</Th>
              <Th>Company name</Th>
              <Th>Address</Th>
              <Th>Company ID</Th>
              <Th>Contact details</Th>
              <Th>No of Employees</Th>
              <Th>Edit</Th>
              <Th>Delete</Th>
              <Th>Impersonate</Th>
            </tr>
          </thead>
          <tbody>
            {dummyData.map((item, idx) => (
              <tr key={idx}>
                <Td>{item.slNo}</Td>
                <Td>{item.companyName}</Td>
                <Td>{item.address}</Td>
                <Td>{item.companyID}</Td>
                <Td>{item.contact}</Td>
                <Td>{item.employees}</Td>
                <Td>
                  <IconButton><TbPencilMinus /></IconButton>
                </Td>
                <Td>
                  <IconButton danger><FaTrashAlt /></IconButton>
                </Td>
                <Td>
                  <ImpersonateButton>Impersonate</ImpersonateButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      <Pagination>
        <button>{'←'}</button>
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>{'→'}</button>
      </Pagination>
    </Container>
  );
};

export default CompanyTable;
