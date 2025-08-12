import React, { useEffect } from 'react';
import {
  Container,
  CardGrid,MainWrapper,
  InfoCard,ScrollableTableWrapper,
  CardTitle,
  CardSubtitle,
  CardLink,
  DepartmentBox,Department,
  DepartmentTitleRow,
  DepartmentTitle,
  DepartmentCount,
  SubLabel,
  DepartmentHead,
  MemberList,
  Member,
  Avatar,SvgIcon,
  MemberName,
  ArrowIcon,
  TimeLogContainer,
  DateHeading,
  Table,
  TableRow,
  TableHeader,
  TableCell,
  Icon,
  ArrowButton,
} from './Employeedashboard.Styles';
import InCompanyIcon from '../../assets/clock.svg';
import { FaRegClock, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { BiTimeFive } from "react-icons/bi";
import LeaveIcon from '../../assets/leave.svg';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeDash } from '../../Redux/authSlice';

const TimeLogDashboard = () => {

    const { employeeId } = useParams();

  const dispatch = useDispatch();
  const { employeeDashData, loadingEmployeeDash, employeeDashError } =
    useSelector((state) => state.auth);

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchEmployeeDash(employeeId));
    }
  }, [employeeId, dispatch]);

  if (loadingEmployeeDash) return <p>Loading...</p>;
  if (employeeDashError) return <p>Error: {employeeDashError}</p>;
 const infoCards = [
  {
    title: employeeDashData?.contract_expiry_date||"N/A",
    subtitle: 'Days',
    label: 'Contract Expiry',
    icon: InCompanyIcon,
  },
  {
    title: employeeDashData?.visa_expiry_date||"N/A",
    subtitle: 'Date',
    label: 'Visa Expiry',
    icon: InCompanyIcon,
  },
  {
    title: 'January',
    subtitle: 'Month',
    label: 'Pay slip',
    icon: InCompanyIcon,
  },
  {
    title: employeeDashData?.attendance_summary?.monthly_working_hours,
    subtitle: 'Weekly Logged Hours',
    label: 'Monthly working hour',
    icon:LeaveIcon ,
  },
];


  const members = [
    {
      name: 'Ajay kumar M.A',
      img: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    },
    {
      name: 'Ajay kumar M.A',
      img: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    {
      name: 'Ajay kumar M.A',
      img: 'https://randomuser.me/api/portraits/men/65.jpg',
    },
     {
      name: 'Ajay kumar M.A',
      img: 'https://randomuser.me/api/portraits/men/65.jpg',
    },
     {
      name: 'Ajay kumar M.A',
      img: 'https://randomuser.me/api/portraits/men/65.jpg',
    },
     {
      name: 'Ajay kumar M.A',
      img: 'https://randomuser.me/api/portraits/men/65.jpg',
    },
  ];

  const logs = [
    { timeIn: '08:30 Am', timeOut: '11:30 Am' },
    { timeIn: '11:30 Am', timeOut: '02:30 pm' },
    { timeIn: '02:30 pm', timeOut: '05:30 pm' },
       { timeIn: '02:30 pm', timeOut: '05:30 pm' },
       { timeIn: '02:30 pm', timeOut: '05:30 pm' },
        { timeIn: '02:30 pm', timeOut: '05:30 pm' },
     { timeIn: '02:30 pm', timeOut: '05:30 pm' },
      { timeIn: '02:30 pm', timeOut: '05:30 pm' },
       { timeIn: '02:30 pm', timeOut: '05:30 pm' },
        { timeIn: '02:30 pm', timeOut: '05:30 pm' },
  ];

  return (
    <MainWrapper>
    <Container>
      {/* Top Info Cards */}
     <CardGrid>
  {infoCards.map((card, index) => (
    <InfoCard key={index}>
      <CardTitle>{card.title}</CardTitle>
      <CardSubtitle>{card.subtitle}</CardSubtitle>
      <CardLink>
        <SvgIcon src={card.icon} alt="icon" />
        {card.label}
      </CardLink>
    </InfoCard>
  ))}
</CardGrid>


      {/* Department Block */}
      <DepartmentBox>
        <ArrowIcon>
          <FaArrowUpRightFromSquare />
        </ArrowIcon>

        <Department>
        <DepartmentTitleRow>
          <DepartmentTitle>{employeeDashData?.bank_details?.employee?.department}</DepartmentTitle>
          <DepartmentCount>48</DepartmentCount>
        </DepartmentTitleRow>
<hr></hr>
        <SubLabel>Department head</SubLabel>
        <DepartmentHead>Ajay kumar M.A</DepartmentHead>
        </Department>

        <MemberList>
          {members.map((member, index) => (
            <Member key={index}>
              <Avatar src={member.img} alt={member.name} />
              <MemberName>{member.name}</MemberName>
            </Member>
          ))}
        </MemberList>
      </DepartmentBox>

      {/* Time Log Table */}
        <DateHeading>
          21 January 2025
          <ArrowButton><FaArrowUpRightFromSquare /></ArrowButton>
        </DateHeading>

     <TimeLogContainer>
  <ScrollableTableWrapper>
    <Table>
      <thead>
        <TableRow>
          <TableHeader green style={{ textAlign: 'left' }}>Time In</TableHeader>
          <TableHeader style={{ textAlign: 'center' }}>To</TableHeader>
          <TableHeader red style={{ textAlign: 'right' }}>Time Out</TableHeader>
        </TableRow>
      </thead>
      <tbody>
        {logs.map((log, index) => (
          <TableRow key={index}>
            <TableCell align="left">
              <Icon><BiTimeFive /></Icon>{log.timeIn}
            </TableCell>
            <TableCell align="center" className="separator">To</TableCell>
            <TableCell align="right">
              <Icon><BiTimeFive /></Icon>{log.timeOut}
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  </ScrollableTableWrapper>
</TimeLogContainer>

    </Container>
    </MainWrapper>
  );
};

export default TimeLogDashboard;
