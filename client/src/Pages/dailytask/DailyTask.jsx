import React, { useState } from 'react';
// Import all necessary styled components from the styles file
import {
  ViewContainer,
  DepartmentPanel,
  MainContent,
  ToggleArrow,
  CardItem,
  EmployeeContainer,
  EmployeeItem,
  PanelContainer,
  TaskList,
  DatePickerWrapper,
  TaskHeader,
  EmployeePanelWrapper,
  TaskFooter, 
  StyledNoSelectionMessage, 
  TaskLeft, 
  TaskRight,
  TaskContent, // <-- NEW: Import TaskContent
  TaskBottom, // <-- NEW: Import TaskBottom
  Title,
  SearchInput,
  Heading
} from './DailyTask.Styles';
import TaskIcon from '../../assets/task.svg';
// --- DUMMY DATA (UPDATED with timeTaken) ---
const departments = [
  { id: 1, name: 'Marketing' },
  { id: 2, name: 'Sales' },
  { id: 3, name: 'Engineering' },
];

const employeesData = {
  1: [{ id: 101, name: 'Alice Smith' }, { id: 102, name: 'Bob Johnson' }],
  2: [{ id: 201, name: 'Charlie Brown' }, { id: 202, name: 'Dana White' }],
  3: [{ id: 301, name: 'Ethan Hunt' }, { id: 302, name: 'Fiona Green' }],
};

const tasksData = {
  101: [
    { id: 't1', taskName: 'Q4 Campaign Launch', projectName: 'Seasonal Marketing', description: 'Finalize creatives and media plan for the product launch.', dueDate: '2025-11-28', dueTime: '10:00', timeTaken: '8 hours' },
    { id: 't2', taskName: 'Budget Reports', projectName: 'Finance Tracking', description: 'Review Q3 expense reports and allocate budget for Q4.', dueDate: '2025-11-25', dueTime: '14:30', timeTaken: '4 hours' },
  ],
  102: [
    { id: 't3', taskName: 'Team Sync', projectName: 'Internal Operations', description: 'Schedule and lead the weekly Marketing team review meeting.', dueDate: '2025-11-22', dueTime: '09:00', timeTaken: '1 hour' },
  ],
  201: [
    { id: 't4', taskName: 'Q4 Sales Forecast', projectName: 'Revenue Planning', description: 'Submit the projected sales figures for the upcoming quarter.', dueDate: '2025-11-21', dueTime: '17:00', timeTaken: '2 days' },
    { id: 't5', taskName: 'Client 360 Follow-up', projectName: 'Key Accounts', description: 'Contact key account clients to ensure satisfaction and upsell opportunities.', dueDate: '2025-11-26', dueTime: '11:00', timeTaken: '6 hours' },
  ],
  301: [
    { id: 't6', taskName: 'Feature A Dev', projectName: 'Product Alpha', description: 'Implement the core logic for the new user profile feature.', dueDate: '2025-11-21', dueTime: '16:00', timeTaken: '16 hours' },
    { id: 't7', taskName: 'Code Review', projectName: 'Engineering Quality', description: 'Review pull requests from the junior development team members.', dueDate: '2025-11-22', dueTime: '13:00', timeTaken: '3 hours' },
  ],
};


// --- Component Helpers (RETAINED) ---

// Component for the Department Card
const Card = ({ dept, onClick, isActive }) => (
  <CardItem onClick={onClick} $isActive={isActive}>
    <strong>{dept.name}</strong>
  </CardItem>
);

// Component for the Left Panel (Employees)
const EmployeeList = ({ departmentId, onSelectEmployee, selectedEmployeeId }) => {
  const employees = employeesData[departmentId] || [];

  return (
    <EmployeeContainer>
      <h4>Employees</h4>
      {employees.map((emp) => (
        <EmployeeItem
          key={emp.id}
          onClick={() => onSelectEmployee(emp.id)}
          $isActive={emp.id === selectedEmployeeId}
        >
          🧑‍💼 {emp.name}
        </EmployeeItem>
      ))}
      {employees.length === 0 && <p>No employees in this department.</p>}
    </EmployeeContainer>
  );
};


const TaskPanel = ({ employeeId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00'); 
  
  const tasks = tasksData[employeeId] || [];

  const employeeName = employeeId 
    ? Object.values(employeesData).flat().find(emp => emp.id === employeeId)?.name 
    : 'Selected Employee';

  const formatDate = (date) => date.toISOString().split('T')[0];

  return (
    <PanelContainer>
      <TaskHeader>
        <Heading>{employeeId ? `Tasks for ${employeeName}` : 'Select Employee Tasks'}</Heading>

         <DatePickerWrapper>
          <label htmlFor="task-date">Due Date:</label>
          <input 
            id="task-date"
            type="date" 
            value={formatDate(selectedDate)} 
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
        </DatePickerWrapper>
      </TaskHeader>
      
      {!employeeId && (
        <StyledNoSelectionMessage $type="info">
          <p>Please select an employee to view their daily tasks.</p>
        </StyledNoSelectionMessage>
      )}

      {employeeId && tasks.length === 0 && (
        <StyledNoSelectionMessage $type="warning">
          <p>No tasks found for this employee on this date.</p>
        </StyledNoSelectionMessage>
      )}

      {employeeId && tasks.length > 0 && (
       <TaskList>
          {tasks.map((task, index) => (
            <li key={task.id}>
              <TaskContent>
                <TaskLeft>
                  <span className="task-title">
                    {task.taskName} 
                    <small className="project-name"> ({task.projectName})</small>
                  </span>
                  <span className="task-desc">{task.description}</span>
                </TaskLeft>
              </TaskContent>
             <TaskBottom>
  <div className="right-block">
    <div className="time-taken">
      <strong>{task.timeTaken}</strong>
    </div>

    <div className="due-info">
      <span className="task-date">{task.dueDate}</span>
      <span className="task-time">{task.dueTime}</span>
    </div>
  </div>
</TaskBottom>

            </li>
          ))}
        </TaskList>
      )}
    </PanelContainer>
  );
};


export default function DepartmentView() {
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isDeptPanelOpen, setIsDeptPanelOpen] = useState(true);

  const handleDepartmentClick = (id) => {
    setSelectedDeptId(id === selectedDeptId ? null : id);
    setSelectedEmployeeId(null);
  };

  const handleToggle = () => {
    setIsDeptPanelOpen(!isDeptPanelOpen);
  };

  const isEmployeePanelVisible = selectedDeptId !== null;

  return (
    <ViewContainer>
  <DepartmentPanel $isOpen={isDeptPanelOpen}>
  
  <Title>
    <img src={TaskIcon} alt="Task Icon" width={28} height={28} />
    Daily Task
  </Title>
  <SearchInput
    type="text"
    placeholder="Search Department..."
  />

  {departments.map((dept) => (
    <Card
      key={dept.id}
      dept={dept}
      onClick={() => handleDepartmentClick(dept.id)}
      isActive={dept.id === selectedDeptId}
    />
  ))}

</DepartmentPanel>
      <ToggleArrow onClick={handleToggle} $isOpen={isDeptPanelOpen}>
        {isDeptPanelOpen ? '«' : '»'}
      </ToggleArrow>
      <MainContent>
        <EmployeePanelWrapper $visible={isEmployeePanelVisible}>
          <EmployeeList
            departmentId={selectedDeptId}
            onSelectEmployee={setSelectedEmployeeId}
            selectedEmployeeId={selectedEmployeeId}
          />
        </EmployeePanelWrapper>

        <TaskPanel employeeId={selectedEmployeeId} />
      </MainContent>
    </ViewContainer>
  );
}