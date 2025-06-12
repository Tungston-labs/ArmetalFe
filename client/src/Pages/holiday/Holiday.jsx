import React, { useEffect, useState } from 'react';
import {
  Container, Header, Title, Subtitle, FormSection, Input, Select, DateInput,
  AddButton, TableWrapper, Table, Th, Td, TitleSection, Hr, TopBar, HRManager, DateWrapper
} from './Holiday.styles';
import { MdDateRange } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { LuArrowLeft } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { getHolidays, addHoliday, removeHoliday } from '../../Redux/holidaySlice';
import { fetchHolidayTypes } from '../../services/holidayService';

const formatDateToISO = (dateStr) => {
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};


const HolidayManager = () => {
  const dispatch = useDispatch();
  const { list: holidays, loading, error } = useSelector(state => state.holidays);

  const [formData, setFormData] = useState({ name: "", type: "", date: "" });

  const [typeOptions, setTypeOptions] = useState([]);

  useEffect(() => {
    fetchHolidayTypes().then(data => setTypeOptions(data));
  }, []);

  useEffect(() => {
    dispatch(getHolidays());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleAdd = () => {
  if (formData.name && formData.type && formData.date) {
    const formattedDate = formatDateToISO(formData.date);

    dispatch(addHoliday({
      description: formData.name,
      holiday_type: formData.type,
      date: formattedDate
    }));

    setFormData({ name: "", type: "", date: "" });
  }
};


  const handleDelete = (id) => {
    dispatch(removeHoliday(id));
  };

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
  <Input name="name" placeholder="Holiday name" value={formData.name} onChange={handleChange} />
  
  <Select name="type" value={formData.type} onChange={handleChange}>
    <option value="">Select</option>
    {typeOptions.map(({ key, label }) => (
      <option key={key} value={key}>
        {label}
      </option>
    ))}
  </Select>

  <DateWrapper>
    <MdDateRange />
    <DateInput type="date" name="date" value={formData.date} onChange={handleChange} />
  </DateWrapper>
  
  <AddButton onClick={handleAdd}>Add</AddButton>
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
              <tr key={item.id}>
                <Td>{index + 1}</Td>
                <Td>{item.description}</Td>
                <Td>{item.holiday_type_display}</Td> 
                <Td>{item.date}</Td>
                <Td>
                  <FaTrashAlt style={{ color: "red", cursor: "pointer" }} onClick={() => handleDelete(item.id)} />
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
