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

  // 🔧 Time formatting function (12-hour format with AM/PM)
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

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  if (detailLoading || !attendanceDetail) return <p>Loading attendance details...</p>;

  const employee = attendanceDetail.employee || {};
  const sessions = attendanceDetail.sessions || [];
//  const [selectedDate, setSelectedDate] = useState(new Date());

  const days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  const dates = [12, 13, 14, 15, 16, 17]; // Dynamic generation can be added
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return (
    <Container>
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

       <DateWrapper>
      {/* Left Working Info */}
      <WorkingInfo>
        <div>
          <strong>Monthly working hour :145 Hrs</strong>
         
        </div>
        <div>
          <strong>Total Monthly working hour:145 Hrs</strong>
      
        </div>
        <div>
          <strong>Weekly working hour:45 hrs</strong>
        </div>
      </WorkingInfo>

      {/* Center Date with Calendar and Arrows */}
      <DateDetails>

  <div className="date-block">
    <CiCalendarDate size={28} />
    <h1>16</h1>
    <div className="month-day">
      <strong>November</strong>
      <p>Monday</p>
    </div>
  </div>
  <GoChevronLeft size={20} />
  <GoChevronRight size={20} />
</DateDetails>

 </DateWrapper>
      {/* Horizontal Day List */}
      <DayBoxes>
        {days.map((day, index) => {
          const isActive = index === 0; // highlight Monday as active for now
          const Component = isActive ? ActiveDayBox : DayBox;
          return (
            <Component key={index}>
              <strong>{day}</strong>
              <div>{dates[index]}</div>
              <p>Mar</p>
            </Component>
          );
        })}
      </DayBoxes>
   

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
                <TimeIcon>
                  <FaClock />
                </TimeIcon>
                <span>
                  ................................................. To ..................................................
                </span>
                <TimeIcon>
                  <FaClock />
                </TimeIcon>
              </TimeRange>
              <TimeCell>{formatTime(session.time_out)}</TimeCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <p style={{ marginTop: '20px' }}>
        <strong>Total Hours Worked:</strong> {attendanceDetail.total_hours || '0.00'} hrs
      </p>
    </Container>
  );
};

export default TimesheetPage;
