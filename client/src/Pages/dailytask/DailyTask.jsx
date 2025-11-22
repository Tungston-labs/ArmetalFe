import React, { useEffect, useState } from "react";
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
  TaskContent, 
  TaskBottom, 
  Title,
  SearchInput,
  Heading
} from './DailyTask.Styles';
import TaskIcon from '../../assets/task.svg';

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { getDepartmentsMin, getEmployeesByDepartmentMini } from "../../Redux/departmentSlice";
import { getTasks } from "../../Redux/dailyTaskSlice";

// Component for the Department Card
const Card = ({ dept, onClick, isActive }) => (
  <CardItem onClick={onClick} $isActive={isActive}>
    <strong>{dept.name}</strong>
  </CardItem>
);

// Component for Employees Panel
const EmployeeList = ({ departmentId, onSelectEmployee, selectedEmployeeId }) => {
  const employeesData = useSelector(
    (state) => state.departments.departmentEmployeesMini || []
  );

  return (
    <EmployeeContainer>
  <h4>Employees</h4>
  {employeesData.map((emp) => (
    <EmployeeItem
      key={emp.employee_id}
      onClick={() => onSelectEmployee(emp.employee_id)}
      $isActive={emp.employee_id === selectedEmployeeId}
    >
      <img
        src={emp.profile_pic}         // profile picture URL
        alt={emp.name}                // alt text
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          marginRight: 8,
        }}
      />
      {emp.name}                     {/* employee name */}
    </EmployeeItem>
  ))}
  {employeesData.length === 0 && <p>No employees in this department.</p>}
</EmployeeContainer>

  );
};

// Component for Task Panel
const TaskPanel = ({ employeeId }) => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);

  const tasks = useSelector((state) => state.dailyTask.tasks || []);
  const loading = useSelector((state) => state.dailyTask.loading);

  const employeeName = useSelector(
    (state) =>
      state.departments.departmentEmployeesMini?.find(
        (emp) => emp.employee_id === employeeId
      )?.name
  );

  const formatDate = (d) => d?.toISOString().split("T")[0];

  // Load ALL tasks when employee is selected
  useEffect(() => {
    if (employeeId) {
      dispatch(getTasks({ employeeId, date: null }));
    }
  }, [employeeId, dispatch]);

  // Load FILTERED tasks when date changes
  useEffect(() => {
    if (employeeId && selectedDate) {
      dispatch(getTasks({ employeeId, date: formatDate(selectedDate) }));
    }
  }, [selectedDate, employeeId, dispatch]);

  return (
    <PanelContainer>
      <TaskHeader>
        <Heading>
          {employeeId ? `Tasks for ${employeeName}` : "Select Employee Tasks"}
        </Heading>

        <DatePickerWrapper>
          <label>Due Date:</label>
          <input
            type="date"
            value={selectedDate ? formatDate(selectedDate) : ""}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedDate(val ? new Date(val) : null);
            }}
          />
        </DatePickerWrapper>
      </TaskHeader>

      {!employeeId && (
        <StyledNoSelectionMessage $type="info">
          <p>Please select an employee.</p>
        </StyledNoSelectionMessage>
      )}

      {employeeId && loading && <p>Loading tasks...</p>}

      {employeeId && !loading && tasks.length === 0 && (
        <StyledNoSelectionMessage $type="warning">
          <p>No tasks found for this employee.</p>
        </StyledNoSelectionMessage>
      )}

      {employeeId && tasks.length > 0 && (
        <TaskList>
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskContent>
                <TaskLeft>
                  <span className="task-title">
                    {task.task} <small>({task.project})</small>
                  </span>
                  <span className="task-desc">{task.description}</span>
                </TaskLeft>
              </TaskContent>
              <TaskBottom>
                <div className="right-block">
                  <strong>{task.time_taken} hrs</strong>
                  <span>{task.updated_at?.split("T")[0]}</span>
                </div>
              </TaskBottom>
            </li>
          ))}
        </TaskList>
      )}
    </PanelContainer>
  );
};



// Main Component
export default function DepartmentView() {
  const dispatch = useDispatch();

  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isDeptPanelOpen, setIsDeptPanelOpen] = useState(true);
  const [searchDept, setSearchDept] = useState("");

  const departments = useSelector((state) => state.departments.minList || []);

  // Load minimal departments
  useEffect(() => {
    dispatch(getDepartmentsMin()).then((res) => {
      console.log("Departments API response:", res); // Check payload here
    });
  }, [dispatch]);
  

  // Load employees when department changes
  useEffect(() => {
    if (selectedDeptId) {
      dispatch(getEmployeesByDepartmentMini(selectedDeptId));
      setSelectedEmployeeId(null);
    }
  }, [selectedDeptId, dispatch]);

  const handleDepartmentClick = (id) => {
    setSelectedDeptId(id === selectedDeptId ? null : id);
  };

  const handleToggle = () => setIsDeptPanelOpen(!isDeptPanelOpen);

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
          value={searchDept}
          onChange={(e) => setSearchDept(e.target.value)}
        />

        {departments
          .filter((d) => d.name.toLowerCase().includes(searchDept.toLowerCase()))
          .map((dept) => (
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
