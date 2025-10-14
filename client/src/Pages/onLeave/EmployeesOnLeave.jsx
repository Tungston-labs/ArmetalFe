import React, { useEffect, useState } from "react";
import {
  Container,
  HeaderSection,
  Tabs,
  Tab,
  Title,
  TopBar,
  // SearchInput,
  HRManager,
  Subtitle,
  DropdownMenu,
  DropdownWrapper,
  TitleSection,
  Pagination,
  TextBlock,
  EmployeeImage
} from "../leaveDetails/EmployeeList.styles";
import {
  CardContainer,
  Card,
  Initial,
  DeptTitle,
  DeptSub,
  DeptHead,
  HeadImg,
  DeptInfo,
  CardGrid,
  CardRight,
  SearchInput,
  SearchIcon,
  SearchWrapper
} from './EmployeesOnLeave.Style';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { PiUserCirclePlusThin } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { getDepartments } from "../../Redux/departmentSlice";
import { GoArrowUpRight } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import EmployeeIcon from "../../assets/employeeicon.svg";
import Loader from "../../Components/Loader"
import Navbar from "../../Components/Navbar";
import { FiSearch } from "react-icons/fi";
const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { list: departmentList, loading, error, pagination } = useSelector(
    (state) => state.departments
  );
  
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(getDepartments({ page, search: searchText }));
    console.log('departments',getDepartments);
    
  }, [dispatch, page, searchText]);
  

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  return (
    <>
        <Navbar/>
       
    <Container>
      {loading && (

        <Loader />

    )}

      {/* Header */}
      <HeaderSection>
         <TitleSection>
         <EmployeeImage  src={EmployeeIcon} alt="employeeIcon" />
         <TextBlock>
           <Title>Employee</Title>
           <Subtitle>Manage your Employee.</Subtitle>
         </TextBlock>
       </TitleSection>
      <SearchWrapper>
  <SearchIcon>
    <FiSearch />
  </SearchIcon>
  <SearchInput
    type="text"
    placeholder="Department Name"
    value={searchText}
    onChange={handleSearch}
  />
</SearchWrapper>

      </HeaderSection>

      {/* Tabs */}
      <Tabs>
        <NavLink to="/employee" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/employee'}>Total Employee</Tab>
        </NavLink>
        <NavLink to="/employee-leave-request" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/employee-leave-request'}>Employee leave request</Tab>
        </NavLink>
        <NavLink to="/employee-attendance" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/employee-attendance'}>Employee Attendance</Tab>
        </NavLink>
        <NavLink to="/employee-Contract-Visa-Expiry" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/employee-Contract-Visa-Expiry'}>
            Employee Contract & Visa Expiry
          </Tab>
        </NavLink>
        <NavLink to="/employee-on-leave" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/employee-on-leave'}>Employees on Leave</Tab>
        </NavLink>
      </Tabs>

      <hr style={{ marginTop: "-18px" }} />

      {/* Department Cards */}
      <CardContainer>
        <CardGrid>
          {departmentList?.map((dept) => (
            <Card
              key={dept.id}
              onClick={() => navigate(`/employee-leave?departmentId=${dept.id}`)}
              style={{ cursor: "pointer" }}
            >
              <Initial>{dept.name?.[0] || "D"}</Initial>
              <DeptInfo>
                <DeptTitle>{dept.name || "Department"}</DeptTitle>
                <DeptSub>Department head</DeptSub>
                <DeptHead>
                  {dept.head?.profile_pic ? (
                    <HeadImg src={dept.head.profile_pic} alt="head" />
                  ) : (
                    <PiUserCirclePlusThin size={24} />
                  )}
                  <span>{dept.head?.name || "N/A"}</span>
                </DeptHead>
              </DeptInfo>
              <CardRight>
                <div className="card-value">{dept.leave_request_count || 0}</div>
                <div className="arrow-icon">
                  <GoArrowUpRight size={15} style={{ strokeWidth: 2 }} />
                </div>
              </CardRight>
            </Card>
          ))}
        </CardGrid>
      </CardContainer>

      {/* Pagination */}
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
    </Container>
     </>
  );
};

export default EmployeeList;
