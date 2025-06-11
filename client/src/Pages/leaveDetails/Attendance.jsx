// src/components/TimesheetPage.jsx
import React, { useState } from 'react';
import {
  Container,
  HeaderSection,
  ProfileImage,
  InputGroup,
  Input,
  DateNavigation,
  DateBox,
  Table,
  TableRow,
  TimeCell,
  TwoColumn,
  TimeRange,
  TimeIcon,
  InfoGrid,
  TwoColumnRow,
  FullWidthInput,
  InfoSection,
  Hr,
  DateNavCenter,
} from './Attendance.Style';
import { FaUserCircle, FaClock } from 'react-icons/fa';

const TimesheetPage = () => {
  const [selectedDate, setSelectedDate] = useState('2025-03-12');

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <Container>
      <HeaderSection>
        <InfoGrid>
          <div style={{ width: "10%" }}>
            <ProfileImage src="https://i.pravatar.cc/100?img=5" alt="Employee" />
          </div>
          <div style={{ display: "flex", width: "90%", justifyContent: "space-between" }}>
            <TwoColumn>
              <Input placeholder="Name" />
              <Input placeholder="Employee ID" />
              <Input placeholder="Email ID" />
            </TwoColumn>

            <InfoSection>
              <FullWidthInput placeholder="Address" />
              <TwoColumnRow>
                <Input placeholder="DOB" />
                <Input placeholder="Gender" />
              </TwoColumnRow>
            </InfoSection>
            {/* <TwoColumn>
                         <Input placeholder="Address" />
                        
                      </TwoColumn> */}
            {/* <ThreeColumn>
               
                        <Input placeholder="DOB" />
                        <Input placeholder="Gender" />
                      </ThreeColumn> */}
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
            <th>Time in</th>
            <th></th>
            <th>Time out</th>
          </tr>
        </thead>
        <tbody>
          {[
            { in: '08:30 Am', out: '11:30 Am' },
            { in: '11:30 Am', out: '02:30 Pm' },
            { in: '02:30 Pm', out: '05:30 Pm' }
          ].map((row, index) => (
            <TableRow key={index}>
              <TimeCell>{row.in}</TimeCell>
              <TimeRange>
                <TimeIcon><FaClock /></TimeIcon>
                <span>................................................. To ..................................................</span>
              </TimeRange>
              <TimeCell>{row.out}</TimeCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TimesheetPage;
