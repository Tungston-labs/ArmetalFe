import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Header, DateSelector, Calendar, Day, EmployeesPanel,
  EmployeeCard, TaskPanel, TaskCard, TaskHeader, Hr, Description,
  TimeBox, SearchInput, Title, Subtitle, TitleSection, TextBlock, DropdownWrapper, DepartmentDropdown,
  Heading,
  Head,
  EmployeeImage
} from './Daily.styles';
import { getEmployees, getTasks } from '../../Redux/dailyTaskSlice';
import { getDepartments } from '../../Redux/departmentSlice';
import { PiUserCirclePlusThin } from "react-icons/pi";
import { FaRegCalendarAlt } from "react-icons/fa";
import TaskIcon from "../../assets/task.svg";
import Navbar from '../../Components/Navbar';
import Loader from "../../Components/Loader"

export default function DailyTask() {
  const dispatch = useDispatch();
  const { employees = [], tasks = [], loading } = useSelector(state => state.dailyTask);
  const { list: departments = [] } = useSelector(state => state.departments);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
const selected = new Date(selectedDate); // convert string to Date


  // Fetch departments on mount
  useEffect(() => {
    dispatch(getDepartments({ page: 1, search: '' }));
  }, [dispatch]);

  // Fetch employees whenever selected department changes
  useEffect(() => {
    const params = {};
    if (selectedDepartment) params.department_id = selectedDepartment;
    dispatch(getEmployees(params));
  }, [dispatch, selectedDepartment]);

  // Fetch tasks when employee or date changes
  useEffect(() => {
    if (selectedEmployee && selectedDate) {
      dispatch(getTasks({ employeeId: selectedEmployee.id, date: selectedDate }));
    }
  }, [dispatch, selectedEmployee, selectedDate]);

  // Set default selected employee when employees list updates
  useEffect(() => {
    if (employees.length > 0) {
      setSelectedEmployee(employees[0]);
    } else {
      setSelectedEmployee(null);
    }
  }, [employees]);

  const handleDateChange = (e) => setSelectedDate(e.target.value);
  const handleEmployeeSelect = (emp) => setSelectedEmployee(emp);

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

  const filteredEmployees = (employees || []).filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <Container>
        <Header>
         <TitleSection>
           <EmployeeImage  src={TaskIcon} alt="employeeIcon" />
           <TextBlock>
             <Title>Employee</Title>
             <Subtitle>Manage your Employee.</Subtitle>
           </TextBlock>
         </TitleSection>
        </Header>

        <DateSelector>
          {/* Search box */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <SearchInput
              placeholder="Search employee"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <DepartmentDropdown
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </DepartmentDropdown>
          </div>


          {/* Date selector */}
          <div className="calendar-header">
            <div className="left">
                <button onClick={handlePrevDate}>{"<"}</button>
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
              {/* <button onClick={handlePrevDate}>{"<"}</button> */}
              <button onClick={handleNextDate}>{">"}</button>
            </div>
          </div>

          {/* <input type="date" value={selectedDate} onChange={handleDateChange} /> */}
        </DateSelector>

 <Calendar>
  {[...Array(6)].map((_, i) => {
    const baseDate = new Date(selectedDate); // string → Date
    const newDate = new Date(baseDate);
    newDate.setDate(baseDate.getDate() + i);

    // Compare as Dates
    const isActive = newDate.toDateString() === baseDate.toDateString();

    const dayName = newDate.toLocaleString('default', { weekday: 'short' });

    return (
      <Day
        key={i}
        active={isActive}
        onClick={() => setSelectedDate(newDate.toISOString().split("T")[0])} // keep string in state
      >
        <strong>{dayName}</strong>
        <Hr />
        <span>
          {newDate.getDate()} {newDate.toLocaleString('default', { month: 'short' })}
        </span>
      </Day>
    );
  })}
</Calendar>



        <div style={{ display: 'flex', gap: '.5rem' }}>
          <EmployeesPanel>
            <Heading>Employees</Heading>
            {(filteredEmployees || []).map(emp => (
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
 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
  <Head>Daily Task</Head>
          <TaskPanel>
            {selectedEmployee && (
              <TaskHeader>
                <img src={selectedEmployee.profile_pic || '/images/default.png'} alt={selectedEmployee.name} />
                <h3>{selectedEmployee.name}</h3>
              </TaskHeader>
            )}

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <Loader size="large" tip="Loading..." />
              </div>
            ) : tasks.length > 0 ? (
              tasks.map((task, idx) => (
                <TaskCard key={idx}>
                  <h4>Project: &nbsp;<strong>{task.project}</strong></h4>
                  <h5><strong>Task</strong></h5>
                  <p><strong>Description: </strong></p>
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
        
              </div>
            )}
          </TaskPanel>
          </div>
        </div>
      </Container>
    </>
  );
}
