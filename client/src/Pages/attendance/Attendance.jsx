import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getAttendanceDetail } from "../../Redux/attendanceSlice";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { CiCalendarDate } from "react-icons/ci";
import {
  Container,
  HeaderSection,
  ProfileImage,
  Input,
  Table,
  TableRow,
  TimeCell,
  TimeRange,
  TimeIcon,
  InfoGrid,
  TwoColumn,
  TwoColumnRow,
  InfoSection,
  Hr,
  DateWrapper,
  WorkingInfo,
  DateDetails,
  DayBoxes,
  DayBox,
  ActiveDayBox,
  TotalHours,
  BackArrow,
  TableScroll,
} from "./Attendance.Style";
import { FaClock } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EmployeeIcon from "../../assets/employeeicon.svg";
import Loader from '../../Components/Loader';
import Header from '../../Components/Header';
import EmployeeTitle from "../../Components/EmployeeTitle";
const TimesheetPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const location = useLocation();

  const { attendanceDetail, detailLoading } = useSelector(
    (state) => state.attendance
  );

  const [selectedDate, setSelectedDate] = useState("");
  const [noAttendanceMessage, setNoAttendanceMessage] = useState("");
  const previousPath = location.state?.from || '/employee-attendance';
  // ✅ Fetch attendance by ID & date
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const result = await dispatch(
          getAttendanceDetail({ attendanceId: id, date: selectedDate })
        );

        if (result?.error || result?.payload?.note) {
          const message =
            result?.payload?.note ||
            result?.payload?.message ||
            result?.error?.message ||
            "No attendance available for this date";
          setNoAttendanceMessage(message);
        } else if (result?.payload?.sessions?.length === 0) {
          setNoAttendanceMessage("No attendance available for this date");
        } else {
          setNoAttendanceMessage("");
        }
      } catch (err) {
        setNoAttendanceMessage("No attendance available for this date");
      }
    };

    fetchData();
  }, [id, selectedDate, dispatch]);

  // ✅ Initialize selectedDate only once (when first data loads)
  useEffect(() => {
    if (!selectedDate && attendanceDetail?.date) {
      setSelectedDate(attendanceDetail.date);
    }
  }, [attendanceDetail]);

  const formatTime = (datetimeStr) => {
    if (!datetimeStr) return "---";
    const date = new Date(datetimeStr.replace(" ", "T"));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (detailLoading) return <Loader />;

  const employee = attendanceDetail?.employee ?? {};
  const sessions = attendanceDetail?.sessions ?? [];
  // const selectedDateObj = selectedDate ? new Date(selectedDate) : new Date();
  const selectedDateObj = selectedDate ? new Date(selectedDate) : new Date();

  const today = new Date();

 // ✅ Include Sunday (7 days total)
const getWeekDays = (dateStr) => {
  if (!dateStr) return [];
  const baseDate = new Date(dateStr);

  // Find Monday of the current week
  const startOfWeek = new Date(baseDate);
  const day = baseDate.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  startOfWeek.setDate(baseDate.getDate() + mondayOffset);

  // Generate 7 days (Mon–Sun)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });
};


  const weekDays = selectedDate ? getWeekDays(selectedDate) : [];
 const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

  const dayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday",
  ];

  // ✅ Navigate previous date
  const handlePreviousDay = () => {
    const prevDate = new Date(selectedDateObj);
    prevDate.setDate(prevDate.getDate() - 1);
    setSelectedDate(prevDate.toISOString().split("T")[0]);
  };


 const handleNextDay = () => {
  const nextDate = new Date(selectedDateObj);
  nextDate.setDate(nextDate.getDate() + 1);

  const today = new Date();

  // Only allow today or past
  if (nextDate <= today) {
    setSelectedDate(nextDate.toISOString().split("T")[0]);
    setNoAttendanceMessage("");
  }
};


  const isFutureDate = selectedDateObj > today;

    const handleBack= (deptId) => {
    navigate(previousPath);
  };
  return (
    <>
    

    <Container>
      <EmployeeTitle
        iconSrc={EmployeeIcon}
        showAddButton={false}
        showDropdown={false}
        showSearch={false}
        showTabs={false}
      />

  <Header
    employee={employee}
    editable={false}
    // onBack={handleBack}
  />
      <DateWrapper>
        <WorkingInfo>
          <div>
            <strong>
              Monthly: {attendanceDetail?.monthly_hours_formatted ?? "00:00"} hrs
            </strong>
          </div>
          <div>
            <strong>
              Weekly: {attendanceDetail?.weekly_hours_formatted ?? "00:00"} hrs
            </strong>
          </div>
        </WorkingInfo>

        <DateDetails>
          <GoChevronLeft
            size={28}
            style={{ cursor: "pointer" }}
            onClick={handlePreviousDay}
          />
          <div className="date-block" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <DatePicker
              selected={selectedDateObj}
              onChange={(date) => {
                if (date > today) {
                  setNoAttendanceMessage("No attendance available for this date");
                  return;
                }
                setSelectedDate(date.toISOString().split("T")[0]);
              }}
              dateFormat="yyyy-MM-dd"
              maxDate={today}
              customInput={
                <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <CiCalendarDate size={28} />
                  <h1 style={{ marginLeft: "5px" }}>
                    {selectedDateObj.getDate() || "--"}
                  </h1>
                </div>
              }
            />
            <div className="month-day">
              <strong>{monthNames[selectedDateObj.getMonth()]}</strong>
              <p>{dayNames[selectedDateObj.getDay()]}</p>
            </div>
          </div>

          <GoChevronRight
            size={28}
            style={{
              cursor: selectedDateObj >= today ? "not-allowed" : "pointer",
              opacity: selectedDateObj >= today ? 0.4 : 1,
            }}
            onClick={handleNextDay}
          />
        </DateDetails>
      </DateWrapper>

      {/* Week Day Boxes */}
{/* Week Day Boxes */}
<DayBoxes>
  {weekDays.map((dayDate, i) => {
    const iso = dayDate.toISOString().split("T")[0];
    const isActive = iso === selectedDate;
    const isFuture = dayDate > today;
    const Component = isActive ? ActiveDayBox : DayBox;

    return (
      <Component
        key={i}
        // keep prop available if your styled-component uses it
        isFuture={isFuture}
        onClick={() => {
          if (isFuture) return;            // don't allow picking future days
          setSelectedDate(iso);            // update selected date (triggers fetch useEffect)
          setNoAttendanceMessage("");      // clear any existing message so table refetch looks clean
        }}
        // inline fallback styling so visual feedback matches behavior
        style={{
          cursor: isFuture ? "not-allowed" : "pointer",
          opacity: isFuture ? 0.5 : 1,
        }}
        aria-pressed={isActive}
        role="button"
      >
        <strong>{dayNames[dayDate.getDay()].slice(0, 3)}</strong>
        <div>{dayDate.getDate()}</div>
        <p>{monthNames[dayDate.getMonth()]}</p>
      </Component>
    );
  })}
</DayBoxes>



      {/* Table */}
      <TableScroll>
      <Table>
        <thead>
          <tr>
            <th>Time In</th>
            <th></th>
            <th>Time Out</th>
          </tr>
        </thead>
        <tbody>
          {isFutureDate || noAttendanceMessage || sessions.length === 0 ? (
            <TableRow>
              <td colSpan={3} style={{ textAlign: "center", color: "#777" }}>
                {typeof noAttendanceMessage === "object"
                  ? noAttendanceMessage.message
                  : noAttendanceMessage ||
                    (isFutureDate
                      ? "No attendance available for this date"
                      : "No sessions found")}
              </td>
            </TableRow>
          ) : (
            sessions.map((s, idx) => (
              <TableRow key={idx}>
                <TimeCell>{formatTime(s?.time_in)}</TimeCell>
                <TimeRange>
                  <TimeIcon>
                    <FaClock />
                  </TimeIcon>
                  <span>............. To .............</span>
                  <TimeIcon>
                    <FaClock />
                  </TimeIcon>
                </TimeRange>
                <TimeCell>{formatTime(s?.time_out)}</TimeCell>
              </TableRow>
            ))
          )}
        </tbody>
      </Table>
</TableScroll>
      <TotalHours>
        <strong>Total Hours Worked:</strong>{" "}
        {!isFutureDate
          ? attendanceDetail?.total_hours_formatted ?? "00:00"
          : "00:00"}{" "}
        hrs
      </TotalHours>
    </Container>
    </>
  );
};

export default TimesheetPage;
