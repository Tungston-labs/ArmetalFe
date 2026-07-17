import React, { useEffect, useState } from 'react';
import {
  Container,
  ErrorMessage,
  FormSection,
  Input,
  Select,
  DateInput,
  AddButton,
  Td,
  Hr,
  DateWrapper,
  Heading,
  FieldWrapper,
  Label,
  TableWrapper,
  HeadingRow,
  MonthFilter,
  FilterWrapper,
  FilterLabel,
} from './Holiday.styles';
import { FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getHolidays, addHoliday, removeHoliday } from '../../Redux/holidaySlice';
import { fetchHolidayTypes } from '../../services/holidayService';
import Loader from "../../Components/Loader";
import HolidayHeading from "../../Components/HolidayHeading";
import { BodyCell, BodyRow, EmptyRow, HeadCell, HeadRow, StyledTable, TableBody, TableHead } from '../leaveDetails/EmployeeList.styles';
import Pagination from "../../Components/Pagination/Pagination"
import NoEmployeeFound from '../../Components/No found/Noemployeefound';
import { exportHolidayExcel } from "../../utils/holiday";
import { exportHolidayPDF } from "../report/holiday"
const DEFAULT_HOLIDAY_TYPES = [
  { key: "public", label: "Public Holiday" },
  // { key: "religious", label: "Religious Holiday" },
  { key: "company", label: "Company Holiday" },
  // { key: "optional", label: "Optional/Restricted Holiday" },
  // { key: "bank", label: "Bank Holiday" },
  // { key: "regional", label: "Cultural/Regional Holiday" },
  // { key: "observance", label: "Observance/Non-Leave Day" },
  { key: "company_off_day", label: "Company Off Day" },
  { key: "second_saturday", label: "Second Saturdays" },
];

const WEEK_DAYS = [
  { value: 0, label: "Monday" },
  { value: 1, label: "Tuesday" },
  { value: 2, label: "Wednesday" },
  { value: 3, label: "Thursday" },
  { value: 4, label: "Friday" },
  { value: 5, label: "Saturday" },
  { value: 6, label: "Sunday" },
];
const formatDateToISO = (dateStr) => {
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};


const HolidayManager = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const {
    list: holidays = [],
    loading,
    error,
    totalPages = 1,
    currentPage = 1,
    count = 0,
    totalItems = 0
  } = useSelector(state => state.holidays);
const [selectedMonth, setSelectedMonth] = useState("");
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    date: "",
    off_day_weekday: ""
  }); const [typeOptions, setTypeOptions] = useState(DEFAULT_HOLIDAY_TYPES);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = React.useState(null);
  const PAGE_SIZE = 20;
  useEffect(() => {
    fetchHolidayTypes()
      .then(data => {
        if (data?.holiday_types?.length) {
          setTypeOptions(data.holiday_types);
        } else {
          setTypeOptions(DEFAULT_HOLIDAY_TYPES);
        }
      })
      .catch(() => {
        setTypeOptions(DEFAULT_HOLIDAY_TYPES);
      });
  }, []);


  useEffect(() => {
    dispatch(getHolidays(page));
  }, [dispatch, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setFormError("");
  };

  const handleAdd = () => {
    const {
      name,
      type,
      date,
      off_day_weekday
    } = formData; const trimmedName = name.trim();



    if (!trimmedName || !type) {
      setFormError("⚠️ Please fill in all required fields.");
      return;
    }

    if (trimmedName.length > 250) {
      setFormError("⚠️ Holiday name cannot exceed 250 characters.");
      return;
    }

    if (
      type === "company_off_day" &&
      off_day_weekday === ""
    ) {
      setFormError("⚠️ Please select a weekly off day.");
      return;
    }

    if (
      type !== "company_off_day" &&
      !date
    ) {
      setFormError("⚠️ Please select a date.");
      return;
    }

    let formattedDate = null;

    if (type !== "company_off_day") {
      formattedDate = formatDateToISO(date);

      const selectedDate = new Date(date);
      const today = new Date();

      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setFormError("⚠️ Holiday date cannot be in the past.");
        return;
      }

      const isDateAlreadyExists = holidays.some(
        (holiday) => holiday.date === formattedDate
      );

      if (isDateAlreadyExists) {
        setFormError("⚠️ A holiday already exists on this date.");
        return;
      }
    }

    const payload = {
      description: trimmedName,
      holiday_type: type,
    };

    if (type === "company_off_day") {
      payload.off_day_weekday = Number(
        off_day_weekday
      );

      payload.date = new Date().toISOString().split("T")[0];
    } else {
      payload.date = formattedDate;
    }

    dispatch(addHoliday(payload))
      .unwrap()
      .then(() => {
        dispatch(getHolidays(page));
      })
      .catch((err) => {
        setFormError(
          err?.message ||
          "Failed to create holiday"
        );
      });

    setFormData({
      name: "",
      type: "",
      date: "",
      off_day_weekday: ""
    });
    setFormError("");
  };

  const handleDeleteClick = (id) => {
    setSelectedIdToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(removeHoliday(selectedIdToDelete)).then(() => {
      dispatch(getHolidays(page)); // ✅ refresh list after deleting
    });
    setShowDeleteModal(false);
    setSelectedIdToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedIdToDelete(null);
  };
  const formatDate = (date) => {
    if (!date) return "----";

    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };
  const handleReportClick = (type) => {
    if (type === "excel") {
      exportHolidayExcel(holidays);
    }

    if (type === "pdf") {
      exportHolidayPDF(holidays);
    }
  };
  const filteredHolidays = selectedMonth
  ? holidays.filter((holiday) => {
      if (!holiday.date) return false;

      const d = new Date(holiday.date);

      const holidayMonth = `${d.getFullYear()}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}`;

      return holidayMonth === selectedMonth;
    })
  : holidays;
  return (
    <>
      <Container>

        <HolidayHeading onReportClick={handleReportClick} />

        <FormSection>
          <FieldWrapper>
            <Label>Holiday Name</Label>
            <Input
              name="name"
              autoComplete='off'
              placeholder="Holiday name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value.slice(0, 250) })
              }
              style={{ cursor: "pointer" }}
            />
          </FieldWrapper>

          <FieldWrapper>
            <Label>Type</Label>
            <Select name="type" value={formData.type} onChange={handleChange}>
              <option value="">Select</option>
              {typeOptions.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Select>
          </FieldWrapper>
          {formData.type === "company_off_day" && (
            <FieldWrapper>
              <Label>Weekly Off Day</Label>

              <Select
                name="off_day_weekday"
                value={formData.off_day_weekday}
                onChange={handleChange}
              >
                <option value="">Select Day</option>

                {WEEK_DAYS.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </Select>
            </FieldWrapper>
          )}

          {formData.type !== "company_off_day" && (
            <FieldWrapper>
              <Label>Date</Label>
              <DateWrapper>
                <DateInput
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </DateWrapper>
            </FieldWrapper>
          )}

          <AddButton onClick={handleAdd}>Add</AddButton>

          
        </FormSection>

        {formError && <ErrorMessage>{formError}</ErrorMessage>}

        <Hr />

<HeadingRow>
  <Heading>Holiday List</Heading>

  <FilterWrapper >
    <FilterLabel>Filter by Month</FilterLabel>

    <MonthFilter
      type="month"
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(e.target.value)}
    />
  </FilterWrapper>
</HeadingRow>
        <TableWrapper>
          <StyledTable>
            <TableHead>
              <HeadRow>
                <HeadCell>Sl No</HeadCell>
                <HeadCell>Holiday name</HeadCell>
                <HeadCell>Holiday type</HeadCell>
                <HeadCell>Date</HeadCell>
                <HeadCell></HeadCell>
              </HeadRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <tr>
                  <Td colSpan="5" style={{ textAlign: "center", padding: "2rem" }}>
                    <Loader size="large" />
                  </Td>
                </tr>
              ) : filteredHolidays.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <NoEmployeeFound />
                  </td>
                </tr>
              ) : (
                [...filteredHolidays]
  .sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date) - new Date(a.date);
  })
  .map((item, index) => (
    <BodyRow key={item.id}>
      <BodyCell>
        {(currentPage - 1) * PAGE_SIZE + index + 1}
      </BodyCell>

      <BodyCell title={item.description}>
        {item.description.charAt(0).toUpperCase() +
          item.description.slice(1)}
      </BodyCell>

      <BodyCell>
        {item.holiday_type_display}
      </BodyCell>

      <BodyCell>
        {formatDate(item.date)}
      </BodyCell>

      <BodyCell>
        <FaTrashAlt
          style={{
            color: "red",
            cursor: "pointer",
          }}
          onClick={() =>
            handleDeleteClick(item.id)
          }
        />
      </BodyCell>
    </BodyRow>
  ))
              )}
            </TableBody>
          </StyledTable>
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
        <Pagination
          currentPage={page}
          totalPages={Number(totalPages) || 1}
          onPageChange={handlePageChange}
        />

      </Container>
    </>
  );
};

export default HolidayManager;
