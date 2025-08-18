import React, { useEffect, useState } from 'react';
import {
  Container,
  Header,
ErrorMessage,
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
Pagination,

} from './Holiday.styles';
import { MdDateRange } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { LuArrowLeft } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { getHolidays, addHoliday, removeHoliday } from '../../Redux/holidaySlice';
import { fetchHolidayTypes } from '../../services/holidayService';
import SyncLoader from 'react-spinners/SyncLoader';
import Navbar from '../../Components/Navbar';
import { Spin } from "antd"; 


const formatDateToISO = (dateStr) => {
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};


const HolidayManager = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const { list: holidays, loading, error,totalPages, currentPage } = useSelector(state => state.holidays);
const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({ name: "", type: "", date: "" });

  const [typeOptions, setTypeOptions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = React.useState(null);

  useEffect(() => {
    fetchHolidayTypes().then(data => setTypeOptions(data));
  }, []);

  useEffect(() => {
    dispatch(getHolidays(page));
  }, [dispatch,page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

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
    setFormError(""); // Clear error
  } else {
    setFormError("⚠️ Please fill in all fields before adding a holiday.");
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
    <>
       <Navbar/>
    <Container>
   
      {/* <Header>
        <TopBar>
          <TitleSection>

            <img src="/images/payroll.png" alt="Payroll Icon" style={{ height: "51px" }} />
            <div>
              <Title>Holiday</Title>
              <Subtitle>Unifying Teams. Simplifying Operations</Subtitle>
            </div>
          </TitleSection>
          <HRManager>
            <img src="/images/user.jpg" alt="HR Manager" />
            <span>HR Manager</span>
          </HRManager>
        </TopBar>
      </Header> */}

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

{formError && <ErrorMessage>{formError}</ErrorMessage>}

      <Hr />

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>Sl No</Th>
              <Th>Holiday name</Th>
              <Th>Holiday type</Th>
              <Th>Date</Th>
              <Th></Th>
            </tr>
          </thead>
<tbody>
  {loading ? (
     <tr>
     <Td colSpan="5" style={{ textAlign: "center", padding: "2rem" }}>
       <Spin size="large" tip="Loading holidays..." /> {/* ✅ Spinner here */}
     </Td>
   </tr>
  ) : holidays.length === 0 ? (
    <tr>
      <Td colSpan="5" style={{ textAlign: "center" }}>
        No holidays found.
      </Td>
    </tr>
  ) : (
    holidays.map((item, index) => (
      <tr key={item.id}>
        <Td>{(currentPage - 1) * 7 + index + 1}</Td>
        <Td>{item.description}</Td>
        <Td>{item.holiday_type_display}</Td>
        <Td>{item.date}</Td>
        <Td>
          <FaTrashAlt
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => handleDeleteClick(item.id)}
          />
        </Td>
      </tr>
    ))
  )}
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

<Pagination>
  <span
    onClick={() => handlePageChange(page - 1)}
    style={{ cursor: page > 1 ? 'pointer' : 'not-allowed', opacity: page > 1 ? 1 : 0.5 }}
  >
    &larr;
  </span>

  {[...Array(totalPages)].map((_, i) => {
    const pageNum = i + 1;
    return (
      <span
        key={pageNum}
        onClick={() => handlePageChange(pageNum)}
        className={pageNum === currentPage ? "active" : ""}
        style={{ cursor: 'pointer', fontWeight: pageNum === currentPage ? 'bold' : 'normal' }}
      >
        {pageNum}
      </span>
    );
  })}

  <span
    onClick={() => handlePageChange(page + 1)}
    style={{ cursor: page < totalPages ? 'pointer' : 'not-allowed', opacity: page < totalPages ? 1 : 0.5 }}
  >
    &rarr;
  </span>
</Pagination>


    </Container>
    </>
  );
};

export default HolidayManager;
