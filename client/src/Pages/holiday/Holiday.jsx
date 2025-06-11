// src/Pages/holiday/HolidayManager.jsx
import React, { useState } from 'react';
import {
  Container,
  Header,

  Title,
  Subtitle,
  FormSection,
  Input,
  Select,
  DateInput,
  AddButton,
  TableWrapper,
  Table,
  Th,
  Td,
  TrashIcon,
  TitleSection,
  Hr,
  TopBar,
  HRManager,
  DateWrapper,


} from './Holiday.styles';
import { MdDateRange } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { LuArrowLeft } from "react-icons/lu";
const initialData = Array(10).fill({
  slNo: '001',
  name: 'Independence Day',
  type: 'Public',
  date: '2025-08-15',
});

const HolidayManager = () => {
  const [holidays, setHolidays] = useState(initialData);

  return (
    <Container>
      <Header>
        <TopBar>
          <TitleSection>
            <LuArrowLeft style={{ width: "36px", height: 36 }} />
            <img src="/images/payroll.png" alt="Payroll Icon" style={{ height: "51px" }} />
            <div>
              <Title>Holiday</Title>
              <Subtitle>Unifying Teams. Simplifying Operations</Subtitle>
            </div>
          </TitleSection>

          <HRManager>
            <img src="https://i.pravatar.cc/40?img=5" alt="HR Manager" />
            <span>HR Manager</span>
          </HRManager>
        </TopBar>

      </Header>

      <FormSection>
        <Input placeholder="Holiday name" />
        <Select>
          <option>Select</option>
          <option>Public</option>
          <option>Optional</option>
        </Select>
        <DateWrapper>
          <MdDateRange />
          <DateInput type="date" />
        </DateWrapper>
        <AddButton>Add</AddButton>
      </FormSection>

      <Hr /> 

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>Sl No</Th>
              <Th>Holiday name</Th>
              <Th>Holiday type</Th>
              <Th>Date</Th>
              <Th>Info</Th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((item, index) => (
              <tr key={index}>
                <Td>{item.slNo}</Td>
                <Td>{item.name}</Td>
                <Td>{item.type}</Td>
                <Td>{item.date}</Td>
                <Td>
                  {/* <TrashIcon role="button"><CiTrash /></TrashIcon> */}
        <FaTrashAlt style={{color:"red"}}/>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

    </Container>
  );
};

export default HolidayManager;
