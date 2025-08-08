import React, { useEffect, useState } from "react";
import {
  Container,DepartmentSelect,
  HeaderSection,
  Tabs,
  Tab,
  Table,
  Title,
  TopBar,
  ProfileImg,
  Pagination,
  SearchInput,
  AddButton,
  HRManager,
  Subtitle,
  ActionArea,
  TitleSection
} from "../leaveDetails/EmployeeList.styles";
import { CardContainer, Card, Initial, Count, DeptTitle, DeptSub, DeptHead, HeadImg, DeptInfo, CardGrid,CardRight } from './EmployeesOnLeave.Style'; 
import { FaInfoCircle, FaTrash, FaPlus } from "react-icons/fa";
import { LuArrowLeft } from "react-icons/lu";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { PiUserCirclePlusThin } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { getAllEmployees,deleteEmployeeById } from "../../Redux/employeeSlice";
import SyncLoader from "react-spinners/SyncLoader";
import { GoArrowUpRight } from "react-icons/go";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { employeeList, loading, pagination } = useSelector((state) => state.employees);
  console.log("EmployeeList from Redux:", employeeList);

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  useEffect(() => {
    dispatch(getAllEmployees({ page, search: searchText }));
  }, [dispatch, page, searchText]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPage(1); // Reset to page 1 on new search
  };
  const handleDeleteClick = (id) => {
    setSelectedEmployeeId(id);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    await dispatch(deleteEmployeeById(selectedEmployeeId));
    dispatch(getAllEmployees({ page, search: searchText })); // Refetch
    setShowDeleteModal(false);
    setSelectedEmployeeId(null);
  };
  
  
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedEmployeeId(null);
  };
  

  return (
    <Container>
      <TopBar>
        <div />
        <HRManager>
          <img src="/images/user.jpg" alt="HR Manager" />
          <span>HR Manager</span>
        </HRManager>
      </TopBar>

     
           <HeaderSection>
             <TitleSection>
               <img src="/images/employee.png" alt="Payroll Icon" style={{ height: "50px" }} />
               <div>
                 <Title>Employee</Title>
                 <Subtitle>Manage your Employee.</Subtitle>
               </div>
               
             </TitleSection>
               <SearchInput
                 type="text"
                 placeholder="Search by employee name or ID"
                 value={searchText}
                 onChange={handleSearch}
               />
            
         
     
           </HeaderSection>
      <Tabs>
        <NavLink to="/employee" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/employee'}>Total Employee </Tab>
        </NavLink>
        <NavLink to="/leave-request" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/leave-request'}>Employee leave request</Tab>
        </NavLink>
        <NavLink to="/employee-attendance" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/employee-attendance'}>Employee Attendance</Tab>
        </NavLink>
        <NavLink to="/employee-Contract-Visa-Expiry" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/employee-Contract-Visa-Expiry'}> Employee Contract & Visa Expiry</Tab>
        </NavLink>
       <NavLink to="/emp-on-leave" style={{ textDecoration: 'none' }}>
                       <Tab active={location.pathname === '/emp-on-leave'}>Employees on Leave</Tab>
                     </NavLink>
      </Tabs>
<hr style={{marginTop:"-18px"}}></hr>
     <CardContainer>
  <CardGrid>
    {employeeList?.map((emp, index) => (
      <Card key={emp.id}>
        <Initial>{emp.department?.[0] || "D"}</Initial>
        <DeptInfo>
          <DeptTitle>{emp.department || "Department"}</DeptTitle>
          <DeptSub>Department head</DeptSub>
          <DeptHead>
            {emp.profile_pic ? (
              <HeadImg src={emp.profile_pic} alt="head" />
            ) : (
              <PiUserCirclePlusThin size={24} />
            )}
            <span>{emp.name}</span>
          </DeptHead>
        </DeptInfo>
        {/* <Count>{emp.team_count || 12}</Count> */}

        {/* ✅ Moved inside the loop so 'emp' is accessible */}
        <CardRight>
          <div className="card-value">{emp.employee_count || 0}</div>
          <div className="arrow-icon">
            <GoArrowUpRight size={15} style={{ strokeWidth: 2 }} />
          </div>
        </CardRight>
      </Card>
    ))}
  </CardGrid>
</CardContainer>


      {pagination?.total_pages > 1 && (
  <Pagination>
    <span
      onClick={() => page > 1 && setPage(page - 1)}
      style={{ cursor: 'pointer', marginRight: '8px' }}
    >
      &larr;
    </span>

    {Array.from({ length: pagination.total_pages }, (_, i) => {
      const pageNumber = i + 1;
      const isActive = page === pageNumber;
      return (
        <span
          key={pageNumber}
          onClick={() => setPage(pageNumber)}
          style={{
            margin: '0 4px',
            padding: '6px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: isActive ? '#003366' : '#e0e0e0',
            color: isActive ? '#fff' : '#000',
            fontWeight: isActive ? 'bold' : 'normal',
          }}
        >
          {pageNumber}
        </span>
      );
    })}

    <span
      onClick={() => page < pagination.total_pages && setPage(page + 1)}
      style={{ cursor: 'pointer', marginLeft: '8px' }}
    >
      &rarr;
    </span>
  </Pagination>
)}



        {showDeleteModal && (
  <div style={{
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  }}>
    <div style={{
      background: "white",
      padding: "2rem",
      borderRadius: "10px",
      textAlign: "center",
      maxWidth: "400px",
      width: "100%"
    }}>
      <h3>Confirm Deletion</h3>
      <p>Are you sure you want to delete this employee?</p>
      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={confirmDelete}
          style={{
            marginRight: "1rem",
            backgroundColor: "red",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Delete
        </button>
        <button
          onClick={cancelDelete}
          style={{
            backgroundColor: "gray",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </Container> 
  );
};

export default EmployeeList;
 
 
 
 