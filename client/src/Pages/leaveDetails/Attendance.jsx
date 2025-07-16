// src/components/TimesheetPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams,useNavigate } from 'react-router-dom';
import { getAttendanceDetail } from '../../Redux/attendanceSlice';
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
} from './Attendance.Style';
import { FaClock } from 'react-icons/fa';

const TimesheetPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { attendanceDetail, detailLoading } = useSelector((state) => state.attendance);

  const [selectedDate, setSelectedDate] = useState('');
  

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

  return (
    <Container>
      <HeaderSection>
        <InfoGrid>
          <div style={{ width: '10%' }}>
            <ProfileImage src={employee.profile_pic} alt="Employee" />
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

      <DateNavigation>
        <DateNavCenter>
          <button>{'<'}</button>
          <span>
            {new Date(selectedDate).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <button>{'>'}</button>
        </DateNavCenter>

        <DateBox>
          <input type="date" value={selectedDate} onChange={handleDateChange} />
        </DateBox>
      </DateNavigation>

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
              <TimeCell>{session.time_in?.slice(0, 5)}</TimeCell>
              <TimeRange>
                <TimeIcon>
                  <FaClock />
                </TimeIcon>
                <span>
                  ................................................. To ..................................................
                </span>
              </TimeRange>
              <TimeCell>{session.time_out?.slice(0, 5) || '---'}</TimeCell>
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
