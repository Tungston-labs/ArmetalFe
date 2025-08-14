import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getAttendanceDetail } from '../../Redux/attendanceSlice';
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { CiCalendarDate } from "react-icons/ci";
import {
  Container,
  HeaderSection,
  ProfileImage,
  Input,
  DateNavigation,
  DateBox,
  Table,
  TableRow,
  TimeCell,
  TimeRange,
  TimeIcon,
  InfoGrid,
  TwoColumn,
  TwoColumnRow,
  FullWidthInput,
  InfoSection,
  Hr,
  DateNavCenter,
  DateWrapper,
  WorkingInfo,
  DateDetails,
  DayBoxes,
  DayBox,
  ActiveDayBox,
} from './Attendance.Style';
import { FaClock } from 'react-icons/fa';
import { PiUserCirclePlusThin } from "react-icons/pi";
import { LuArrowLeft } from "react-icons/lu";

const TimesheetPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { attendanceDetail, detailLoading } = useSelector((state) => state.attendance);
  const [selectedDate, setSelectedDate] = useState('');

  // Format time for table
  const formatTime = (datetimeStr) => {
    if (!datetimeStr) return '---';
    const date = new Date(datetimeStr.replace(' ', 'T'));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Fetch attendance detail
  useEffect(() => {
    if (id) {
      dispatch(getAttendanceDetail(id));
    }
  }, [id, dispatch]);

  // Sync selectedDate with API
  useEffect(() => {
    if (attendanceDetail?.date) {
      setSelectedDate(attendanceDetail.date);
    }
  }, [attendanceDetail]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  if (detailLoading || !attendanceDetail) return <p>Loading attendance details...</p>;

  const employee = attendanceDetail.employee || {};
  const sessions = attendanceDetail.sessions || [];

  // Helper: get week days around selectedDate
  const getWeekDays = (dateStr) => {
    const baseDate = new Date(dateStr);
    const startOfWeek = new Date(baseDate);
    const dayOfWeek = baseDate.getDay(); // Sunday=0
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(baseDate.getDate() + mondayOffset);

    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  };

  const weekDays = getWeekDays(selectedDate);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const selectedDateObj = new Date(selectedDate);

  return (
    <Container>
      {/* Header Section */}
      <HeaderSection>
        <InfoGrid>
          <LuArrowLeft
            style={{ width: "30px", height: 30, cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          <div style={{ width: '10%' }}>
            {employee.profile_pic ? (
              <ProfileImage src={employee.profile_pic} alt="Employee" />
            ) : (
              <PiUserCirclePlusThin size={100} style={{ color: '#aaa' }} />
            )}
          </div>

          <div style={{ display: 'flex', width: '90%', justifyContent: 'space-between' }}>
            <TwoColumn>
              <Input value={employee.name || ''} readOnly />
              <Input value={employee.employee_id || ''} readOnly />
              <Input value={employee.email || ''} readOnly />
            </TwoColumn>

            <InfoSection>
              <FullWidthInput value={employee.department?.name || ''} readOnly />
              <TwoColumnRow>
                <Input value={employee.designation || ''} readOnly />
                <Input value={selectedDate} onChange={handleDateChange} type="date" />
              </TwoColumnRow>
            </InfoSection>
          </div>
        </InfoGrid>
      </HeaderSection>

      <Hr />

      {/* Date Wrapper with Monthly/Weekly info */}
      <DateWrapper>
        <WorkingInfo>
          <div>
            <strong>Monthly working hour: {attendanceDetail.monthly_hours_formatted || '0.00'} hrs</strong>
          </div>
          <div>
            <strong>Weekly working hour: {attendanceDetail.weekly_hours_formatted || '0.00'} hrs</strong>
          </div>
        </WorkingInfo>

        <DateDetails>
          <div className="date-block">
            <CiCalendarDate size={28} />
            <h1>{selectedDateObj.getDate()}</h1>
            <div className="month-day">
              <strong>{monthNames[selectedDateObj.getMonth()]}</strong>
              <p>{dayNames[selectedDateObj.getDay()]}</p>
            </div>
          </div>
          <GoChevronLeft size={20} />
          <GoChevronRight size={20} />
        </DateDetails>
      </DateWrapper>

      {/* Horizontal week day list */}
      <DayBoxes>
        {weekDays.map((dayDate, index) => {
          const iso = dayDate.toISOString().split("T")[0];
          const isActive = iso === selectedDate;
          const Component = isActive ? ActiveDayBox : DayBox;
          return (
            <Component key={index} onClick={() => setSelectedDate(iso)}>
              <strong>{dayNames[dayDate.getDay()].slice(0, 3)}</strong>
              <div>{dayDate.getDate()}</div>
              <p>{monthNames[dayDate.getMonth()]}</p>
            </Component>
          );
        })}
      </DayBoxes>

      {/* Time table */}
      <Table>
        <thead>
          <tr>
            <th>Time In</th>
            <th></th>
            <th>Time Out</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session, index) => (
            <TableRow key={index}>
              <TimeCell>{formatTime(session.time_in)}</TimeCell>
              <TimeRange>
                <TimeIcon><FaClock /></TimeIcon>
                <span>
                  ................................................. To ..................................................
                </span>
                <TimeIcon><FaClock /></TimeIcon>
              </TimeRange>
              <TimeCell>{formatTime(session.time_out)}</TimeCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <p style={{ marginTop: '20px' }}>
        <strong>Total Hours Worked:</strong> {attendanceDetail.total_hours_formatted || '0.00'} hrs
      </p>
    </Container>
  );
};

export default TimesheetPage;
