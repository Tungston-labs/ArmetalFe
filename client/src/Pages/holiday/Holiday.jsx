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
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = React.useState(null);

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


const handleDeleteClick = (id) => {
  setSelectedIdToDelete(id);
  setShowDeleteModal(true);
};

const confirmDelete = () => {
  dispatch(removeHoliday(selectedIdToDelete));
  setShowDeleteModal(false);
  setSelectedIdToDelete(null);
};


const cancelDelete = () => {
  setShowDeleteModal(false);
  setSelectedIdToDelete(null);
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
                <FaTrashAlt style={{ color: "red", cursor: "pointer" }} onClick={() => handleDeleteClick(item.id)} />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
      {showDeleteModal && (
  <div style={{
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  }}>
    <div style={{
      background: "white",
      padding: "2rem",
      borderRadius: "10px",
      textAlign: "center",
      maxWidth: "400px",
      width: "100%"
    }}>
      <h3>Confirm Deletion</h3>
      <p>Are you sure you want to delete this Holiday?</p>
      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={confirmDelete}
          style={{
            marginRight: "1rem",
            backgroundColor: "red",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Delete
        </button>
        <button
          onClick={cancelDelete}
          style={{
            backgroundColor: "gray",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </Container>
  );
};

export default HolidayManager;
