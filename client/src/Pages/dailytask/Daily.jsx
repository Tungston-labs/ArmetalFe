// DailyTask.jsx
import React, { useState } from 'react';
import {
  Container, Header, RoleInfo, DateSelector, Calendar, Day,
  EmployeesPanel, EmployeeCard, TaskPanel, TaskCard, TaskHeader,Hr,
  Description, TimeBox, SearchInput, HRManager, Title, Subtitle, TitleSection,TextBlock
} from './Daily.styles';

const employees = [
  { id: 1, name: "Zaire Workman", image: "/images/z1.png" },
  { id: 2, name: "Erin Rhiel Madsen", image: "/images/z2.png" },
  { id: 3, name: "Erin Stanton", image: "/images/z3.png" },
  { id: 4, name: "Martin Torff", image: "/images/z4.png" },
  { id: 5, name: "Brandon Bator", image: "/images/z5.png" },
  { id: 6, name: "Marcus Baptista", image: "/images/z6.png" },
    { id: 6, name: "Marcus Baptista", image: "/images/z6.png" },
      { id: 6, name: "Marcus Baptista", image: "/images/z6.png" },
        { id: 6, name: "Marcus Baptista", image: "/images/z6.png" },
          { id: 6, name: "Marcus Baptista", image: "/images/z6.png" },
            { id: 6, name: "Marcus Baptista", image: "/images/z6.png" },
              { id: 6, name: "Marcus Baptista", image: "/images/z6.png" },
];

const tasks = Array(4).fill({
  project: "Y fly",
  description: "Revamp the hero section of the TLS website to improve text legibility, visual hierarchy, and overall user impact while retaining the brand’s creative identity.",
  time: "02:40",
  loggedAt: "10:20 AM"
});

export default function DailyTask() {
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0]);

  return (
    <Container>
      <Header>
     <TitleSection>
      <img src="/images/task.png" alt="icon" width="50" height="50" />
      <TextBlock>
        <Title>Daily Task</Title>
        <Subtitle>Check daily task details for each employee</Subtitle>
      </TextBlock>
    </TitleSection>
        <HRManager>
          <img src="https://i.pravatar.cc/40?img=5" alt="HR Manager" />
          <span>HR Manager</span>
        </HRManager>
      </Header>

      <DateSelector>
        <SearchInput placeholder="Search by Employee name" />
        <div>
          <button>{"<"}</button>
          <span>12 March 2025</span>
          <button>{">"}</button>
        </div>
        <input type="date" defaultValue="2025-03-12" />
      </DateSelector>

      <Calendar>
        {["Mon", "Tue", "Wed", "Thur", "Fri", "Sat"].map((day, i) => (
          <Day key={i} active={i === 0}>
            <strong>{day}</strong>
            <Hr/>
            <span>{12 + i} Mar</span>
          </Day>
        ))}
      </Calendar>

      <div style={{ display: 'flex', gap: '.5rem' }}>
        <EmployeesPanel>
          {employees.map(emp => (
            <EmployeeCard
              key={emp.id}
              onClick={() => setSelectedEmployee(emp)}
              active={emp.id === selectedEmployee.id}
            >
              <img src={emp.image} alt={emp.name} />
              <span>{emp.name}</span>
            </EmployeeCard>
          ))}
        </EmployeesPanel>

        <TaskPanel>
          <TaskHeader>
            <img src={selectedEmployee.image} alt={selectedEmployee.name} />
            <h3>{selectedEmployee.name}</h3>
          </TaskHeader>

          {tasks.map((task, idx) => (
            <TaskCard key={idx}>
              <h4>Project &nbsp;<strong>{task.project}</strong></h4>
              <p>Description</p>
              <Description>{task.description}</Description>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <TimeBox>{task.time} Hrs</TimeBox>
                <small>{task.loggedAt}</small>
              </div>
            </TaskCard>
          ))}
        </TaskPanel>
      </div>
    </Container>
  );
}
