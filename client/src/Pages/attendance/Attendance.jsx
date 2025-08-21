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
  const { id } = useParams(); // <-- attendance id
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { attendanceDetail, detailLoading, error } = useSelector((state) => state.attendance);
  const [selectedDate, setSelectedDate] = useState('');

  // format times
  const formatTime = (datetimeStr) => {
    if (!datetimeStr) return '---';
    const date = new Date(datetimeStr.replace(' ', 'T'));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  useEffect(() => {
    if (id) {
      dispatch(getAttendanceDetail(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (attendanceDetail?.date) {
      setSelectedDate(attendanceDetail.date);
    }
  }, [attendanceDetail]);

  if (detailLoading) return <p>Loading attendance details...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!attendanceDetail) return <p>No data found</p>;

  const employee = attendanceDetail.employee || {};
  const sessions = attendanceDetail.sessions || [];

  // helpers for week days
  const getWeekDays = (dateStr) => {
    const baseDate = new Date(dateStr);
    const startOfWeek = new Date(baseDate);
    const dow = baseDate.getDay();
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    startOfWeek.setDate(baseDate.getDate() + mondayOffset);

    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  };

  const weekDays = selectedDate ? getWeekDays(selectedDate) : [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const selectedDateObj = selectedDate ? new Date(selectedDate) : new Date();

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
                <Input value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} type="date" />
              </TwoColumnRow>
            </InfoSection>
          </div>
        </InfoGrid>
      </HeaderSection>

      <Hr />

      {/* Date Wrapper */}
      <DateWrapper>
        <WorkingInfo>
          <div><strong>Monthly: {attendanceDetail.monthly_hours_formatted || '00:00'} hrs</strong></div>
          <div><strong>Weekly: {attendanceDetail.weekly_hours_formatted || '00:00'} hrs</strong></div>
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

      {/* Weekday Boxes */}
      <DayBoxes>
        {weekDays.map((dayDate, i) => {
          const iso = dayDate.toISOString().split("T")[0];
          const isActive = iso === selectedDate;
          const Component = isActive ? ActiveDayBox : DayBox;
          return (
            <Component key={i} onClick={() => setSelectedDate(iso)}>
              <strong>{dayNames[dayDate.getDay()].slice(0, 3)}</strong>
              <div>{dayDate.getDate()}</div>
              <p>{monthNames[dayDate.getMonth()]}</p>
            </Component>
          );
        })}
      </DayBoxes>

      {/* Sessions Table */}
      <Table>
        <thead>
          <tr>
            <th>Time In</th>
            <th></th>
            <th>Time Out</th>
          </tr>
        </thead>
        <tbody>
          {sessions.length > 0 ? (
            sessions.map((s, idx) => (
              <TableRow key={idx}>
                <TimeCell>{formatTime(s.time_in)}</TimeCell>
                <TimeRange>
                  <TimeIcon><FaClock /></TimeIcon>
                  <span>..................................... To .....................................</span>
                  <TimeIcon><FaClock /></TimeIcon>
                </TimeRange>
                <TimeCell>{formatTime(s.time_out)}</TimeCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <td colSpan={3} style={{ textAlign: "center" }}>No sessions</td>
            </TableRow>
          )}
        </tbody>
      </Table>

      <p style={{ marginTop: '20px' }}>
        <strong>Total Hours Worked:</strong> {attendanceDetail.total_hours_formatted || '00:00'} hrs
      </p>
    </Container>
  );
};

export default TimesheetPage;
