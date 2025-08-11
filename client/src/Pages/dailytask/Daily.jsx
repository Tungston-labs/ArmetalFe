import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Header, RoleInfo, DateSelector, Calendar, Day, DropdownMenu, DropdownWrapper,
  EmployeesPanel, EmployeeCard, TaskPanel, TaskCard, TaskHeader, Hr,
  Description, TimeBox, SearchInput, HRManager, Title, Subtitle, TitleSection, TextBlock
} from './Daily.styles';
import { getEmployees, getTasks } from '../../Redux/dailyTaskSlice';
import SyncLoader from 'react-spinners/SyncLoader';
import { PiUserCirclePlusThin } from "react-icons/pi"; 
import { FaRegCalendarAlt } from "react-icons/fa";
import TaskIcon from "../../assets/task.svg"; 
import { IoIosArrowDown } from "react-icons/io";
export default function DailyTask() {
  const dispatch = useDispatch();
  const { employees, tasks, loading } = useSelector(state => state.dailyTask);
const [menuOpen, setMenuOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch employees with high page_size or remove pagination backend
    dispatch(getEmployees({ page_size: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    if (selectedEmployee && selectedDate) {
      dispatch(getTasks({ employeeId: selectedEmployee.id, date: selectedDate }));
    }
  }, [dispatch, selectedEmployee, selectedDate]);

  useEffect(() => {
    if (employees.length > 0) {
      setSelectedEmployee(employees[0]);
    }
  }, [employees]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleEmployeeSelect = (emp) => {
    setSelectedEmployee(emp);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
const handlePrevDate = () => {
  const prev = new Date(selectedDate);
  prev.setDate(prev.getDate() - 1);
  setSelectedDate(prev.toISOString().split("T")[0]);
};

const handleNextDate = () => {
  const next = new Date(selectedDate);
  next.setDate(next.getDate() + 1);
  setSelectedDate(next.toISOString().split("T")[0]);
};

  return (
    <Container>
      <Header>
        <TitleSection>
          {/* <img src="/images/task.png" alt="icon" width="50" height="50" /> */}
                 <img src={TaskIcon}  alt="Task icon" />
          
          <TextBlock>
            <Title>Daily Task</Title>
            <Subtitle>Check daily task details for each employee</Subtitle>
          </TextBlock>
        </TitleSection>
        <DropdownWrapper>
        <HRManager onClick={() => setMenuOpen(!menuOpen)}>
          <img src="/images/user.jpg" alt="HR Manager" />
          <IoIosArrowDown size={18} style={{ marginLeft: "5px", cursor: "pointer" }} />
        </HRManager>

        {menuOpen && (
          <DropdownMenu>
            <div>Profile</div>
            <div>Settings</div>
            <div>Logout</div>
          </DropdownMenu>
        )}
      </DropdownWrapper>
      </Header>

      <DateSelector>
        <SearchInput
          placeholder="Search by Employee name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="calendar-header">
  <div className="left">
    <FaRegCalendarAlt className="calendar-icon" />
    <div className="date-info">
      <div className="day">{new Date(selectedDate).getDate()}</div>
      <div>
        <div className="month">{new Date(selectedDate).toLocaleString('default', { month: 'long' })}</div>
        <div className="weekday">{new Date(selectedDate).toLocaleString('default', { weekday: 'long' })}</div>
      </div>
    </div>
  </div>
  <div className="nav">
    <button onClick={handlePrevDate}>{"<"}</button>
    <button onClick={handleNextDate}>{">"}</button>
  </div>
</div>

        <input type="date" value={selectedDate} onChange={handleDateChange} />
      </DateSelector>

      <Calendar>
        {[...Array(6)].map((_, i) => {
          const baseDate = new Date(selectedDate);
          const newDate = new Date(baseDate);
          newDate.setDate(baseDate.getDate() + i);
          const isActive = newDate.toDateString() === new Date(selectedDate).toDateString();
          const dayName = newDate.toLocaleString('default', { weekday: 'short' });
          return (
            <Day key={i} active={isActive}>
              <strong>{dayName}</strong>
              <Hr />
              <span>{newDate.getDate()} {newDate.toLocaleString('default', { month: 'short' })}</span>
            </Day>
          );
        })}
      </Calendar>

      <div style={{ display: 'flex', gap: '.5rem' }}>
        <EmployeesPanel>
          {filteredEmployees.map(emp => (
          <EmployeeCard
  key={emp.id}
  onClick={() => handleEmployeeSelect(emp)}
  active={emp.id === selectedEmployee?.id}
>
  {emp.profile_pic ? (
    <img src={emp.profile_pic} alt={emp.name} />
  ) : (
    <PiUserCirclePlusThin size={40} color="#999" />
  )}
  <span>{emp.name}</span>
</EmployeeCard>
          ))}
        </EmployeesPanel>

        <TaskPanel>
          {selectedEmployee && (
            <TaskHeader>
              <img src={selectedEmployee.profile_pic || '/images/default.png'} alt={selectedEmployee.name} />
              <h3>{selectedEmployee.name}</h3>
            </TaskHeader>
          )}

          {loading ?( <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
    <SyncLoader/>
  </div>) : tasks.length > 0 ? (
            tasks.map((task, idx) => (
              <TaskCard key={idx}>
                <h4>Project &nbsp;<strong>{task.project}</strong></h4>
                <p>Description</p>
                <Description>{task.task}</Description>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <TimeBox>{task.time_taken} Hrs</TimeBox>
                  <small>{new Date(task.updated_at).toLocaleString()}</small>
                </div>
              </TaskCard>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', alignContent: "end" }}>
              <img
                src="/images/dailytask.png"
                alt="No tasks"
                style={{ width: '400px', height: '350px', marginBottom: '', opacity: 0.8 }}
              />
              <p>No tasks available for this date.</p>
            </div>
          )}
        </TaskPanel>
      </div>
    </Container>
  );
}
