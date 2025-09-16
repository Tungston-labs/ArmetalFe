import React from "react";
import {
  Container,
  Section,
  Header,
  Title,
  TaskList,
  TaskCard,
  TaskLeft,
  TaskDate,
  TaskTime,
  TaskContent,
  TaskRole,
  TaskDescription,
  RightArrow,
  AttendanceHeader,
  Table,
  TableRow,
  TableCell,
  TimeIn,
  TimeOut,
  Divider,
} from "./BottomCard.Styles";
import { BiSolidRightTopArrowCircle } from "react-icons/bi";
import { FiArrowUpRight } from "react-icons/fi";

const DailyTaskList = () => {
  const tasks = [
    {
      date: "21 Jan",
      time: "01:30",
      role: "UI/UX Designer",
      description:
        "Lorem ipsum dolor sit amet consectetur. Neque aliquam cras amet neque. Non proin morbi mi mattis mattis praesent mauris lorem maecenas.",
    },
    {
      date: "21 Jan",
      time: "01:30",
      role: "UI/UX Designer",
      description:
        "Lorem ipsum dolor sit amet consectetur. Sit pulvinar placerat dolor sit. Posuere ullamcorper nunc faucibus facilisis nunc pulvinar.",
    },
    {
      date: "21 Jan",
      time: "01:30",
      role: "UI/UX Designer",
      description:
        "Egestas sapien varius risus suspendisse dignissim nisl. Odio tincidunt metus in nulla.",
    },
    {
      date: "21 Jan",
      time: "01:30",
      role: "UI/UX Designer",
      description:
        "Dui interdum at eget lobortis venenatis ante pellentesque. Consequat ut id ut bibendum ut magna et aliquet.",
    },
  ];

  const attendance = [
    { timeIn: "08:30 Am", timeOut: "11:30 Am" },
    { timeIn: "11:30 Am", timeOut: "02:30 Pm" },
    { timeIn: "11:30 Am", timeOut: "02:30 Pm" },
    { timeIn: "02:30 Pm", timeOut: "05:30 Pm" },
    { timeIn: "02:30 Pm", timeOut: "05:30 Pm" },
    { timeIn: "02:30 Pm", timeOut: "05:30 Pm" },
        { timeIn: "02:30 Pm", timeOut: "05:30 Pm" },
  ];

  return (
    <Container>
      {/* Left Section */}
      <Section>
        <Header>
          <Title>Daily Task List</Title>
          <RightArrow>
            <BiSolidRightTopArrowCircle size={28} />
          </RightArrow>
        </Header>

        <TaskList>
          {tasks.map((task, index) => (
            <TaskCard key={index}>
              <TaskLeft>
                <TaskDate>{task.date}</TaskDate>
                <TaskTime>{task.time}</TaskTime>
              </TaskLeft>
                <Divider />
              <TaskContent>
                <TaskRole>{task.role}</TaskRole>
                <TaskDescription>{task.description}</TaskDescription>
              </TaskContent>
              <RightArrow>
                <FiArrowUpRight size={16} />
              </RightArrow>
            </TaskCard>
          ))}
        </TaskList>
      </Section>

      {/* Right Section */}
      <Section>
        <AttendanceHeader>
          <Title>21 January 2025</Title>
          <RightArrow>
            <BiSolidRightTopArrowCircle size={28} />
          </RightArrow>
        </AttendanceHeader>

        <Table>
          <thead>
         <TableRow>
  <TableCell><TimeIn>Time in</TimeIn></TableCell>
  <TableCell></TableCell>
  <TableCell><TimeOut>Time out</TimeOut></TableCell>
</TableRow>

          </thead>
          <tbody>
            {attendance.map((row, index) => (
         <TableRow key={index}>
  <TableCell>
    <span style={{ display: 'flex', alignItems: 'center', gap: '6px',justifyContent:"center" }}>
      
      {row.timeIn} 
        <img 
      src="/images/daily.png" // ✅ path to your image
      alt="clock"
      style={{ width: '14px', height: '14px', objectFit: 'contain' }}
    />
    </span>
  </TableCell>

  <TableCell style={{ textAlign: "center", fontWeight: "600" }}>
    To
  </TableCell>

  <TableCell>
  <span
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      justifyContent: 'center'
    }}
  >
    <img 
      src="/images/daily.png" // ✅ path to your image
      alt="clock"
      style={{ width: '14px', height: '14px', objectFit: 'contain' }}
    />
    {row.timeOut}
  </span>
</TableCell>

</TableRow>


            ))}
          </tbody>
        </Table>
      </Section>
    </Container>
  );
};

export default DailyTaskList;
