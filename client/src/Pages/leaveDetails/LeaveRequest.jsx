import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLeaveRequests, patchLeaveStatus } from '../../Redux/leaveSlice';
import { NavLink, useNavigate } from 'react-router-dom';
import { IoEyeOutline } from 'react-icons/io5';
import { FaPlus } from "react-icons/fa";
import { LuArrowLeft } from "react-icons/lu";
import ConfirmLeaveModal from '../../Components/ConfirmLeaveModal';
import OnLeaveModal from "./ModalList"
import { getDepartments } from "../../Redux/departmentSlice";

import {
  Container,
  Table,DepartmentSelect,
  TableRow,
  TableHead,
  TableCell,
  ProfileImage,
  ActionButtons,
  DeclineButton,
  ApproveButton,
  Tab,
  SearchInput,
  AddButton,
  Pagination,
  TopBar,
  HRManager,
  HeaderSection,
  TitleSection,
  Tabs,
  Title,
  Subtitle,
  ActionArea,
  DropdownWrapper,
  DropdownMenu, 
} from './LeaveRequest.Styles';
import { PiUserCirclePlusThin } from "react-icons/pi";
import SyncLoader from 'react-spinners/SyncLoader';
import { IoIosArrowDown } from "react-icons/io";

export default function LeaveRequest() {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const { leaves, loading, pagination } = useSelector(state => state.leave);
  const [actionType, setActionType] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [page, setPage] = useState(1); // <-- Pagination state

  const navigate = useNavigate();
  const [departmentFilter, setDepartmentFilter] = useState("");

  useEffect(() => {
    dispatch(getLeaveRequests({
      page,
      department_id: departmentFilter || undefined,
      search: searchText || undefined
    }));
  }, [dispatch, page, departmentFilter, searchText]);
  
  useEffect(() => {
    // console.log("Pagination Info:", pagination);
  }, [pagination]);

  const leaveData = leaves || [];
  console.log(leaveData);
  
    const { list: departmentList, loading: deptLoading } = useSelector(
      (state) => state.departments
    );

  const filteredLeaves = leaveData.filter((leave) => {
    const name = leave?.employee?.name?.toLowerCase() || '';
    const empId = leave?.employee?.employee_id?.toLowerCase() || '';
    const search = searchText.toLowerCase();
    return name.includes(search) || empId.includes(search);
  });

  const handleStatusUpdate = async () => {
    if (!selectedLeave || !actionType) return;

    const status = actionType === 'approve' ? 'approved' : 'rejected';

    try {
      await dispatch(patchLeaveStatus({ leaveId: selectedLeave.id, status }));
      dispatch(getLeaveRequests(page)); // Refresh current page
    } catch (error) {
      console.error('Error updating leave status:', error);
    } finally {
      setShowModal(false);
      setSelectedLeave(null);
      setActionType('');
    }
  };
  useEffect(() => {
    // Fetch departments for dropdown
    dispatch(getDepartments());
  }, [dispatch]);
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPage(1); // reset to first page on new search
  };

  return (
    <Container>
      <TopBar>
        <div />
         <DropdownWrapper>
               <HRManager onClick={() => setMenuOpen(!menuOpen)}>
                 <img src="/images/user.jpg" alt="HR Manager" />
                 <IoIosArrowDown size={18} style={{ marginLeft: "5px", cursor: "pointer" }} />
               </HRManager>
       
               {menuOpen && (
                 <DropdownMenu>
                   <div>Change Password</div>
                   <div>Logout</div>
                 </DropdownMenu>
               )}
             </DropdownWrapper>
      </TopBar>

      <HeaderSection>
        <TitleSection>
          {/* <LuArrowLeft style={{ width: "30px", height: 30 }} /> */}
          <img src="/images/employee.png" alt="Payroll Icon" style={{ height: "50px" }} />
          <div>
            <Title>Employee</Title>
            <Subtitle>Manage your Employee.</Subtitle>
          </div>
        </TitleSection>

      <ActionArea>
  <SearchInput
    type="text"
    placeholder="Search by employee name or ID"
    value={searchText}
    onChange={handleSearch}
    
  />
<DepartmentSelect
  value={departmentFilter}
  onChange={(e) => {
    setDepartmentFilter(e.target.value);
    setPage(1);
  }}
>
  <option value="">All Departments</option>
  {departmentList.map((dept) => (
    <option key={dept.id} value={dept.id}>
      {dept.name}
    </option>
  ))}
</DepartmentSelect>


</ActionArea>

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
          <Tab active={location.pathname === '/employee-Contract-Visa-Expiry'}>Employee Contract & Visa Expiry</Tab>
        </NavLink>
          <NavLink to="/emp-on-leave" style={{ textDecoration: 'none' }}>
                          <Tab active={location.pathname === '/emp-on-leave'}>Employees on Leave</Tab>
                        </NavLink>
      </Tabs>
        <hr style={{marginTop:"-18px"}}></hr>

      <Table>
        <thead>
          <TableRow>
            <TableHead>Employee name</TableHead>
            <TableHead>Leave type</TableHead>
            <TableHead>Email ID</TableHead>
            <TableHead>Contact number</TableHead>
            <TableHead>StartDate and EndDate</TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
          </TableRow>
        </thead>
        <tbody>
          {loading ? (
            <TableRow>  <TableCell colSpan="7">
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
    <p>Loading...</p>
    </div>
  </TableCell></TableRow>
          ) : filteredLeaves.length === 0 ? (
            <TableRow><TableCell colSpan="7">No matching leave requests found.</TableCell></TableRow>
          ) : (
            filteredLeaves.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  {leave?.employee?.profile_pic ? (
    <ProfileImage
      src={leave.employee.profile_pic}
      alt="profile"
    />
  ) : (
    <PiUserCirclePlusThin size={40} color="#999" />
  )}
  {leave?.employee?.name || 'N/A'}
</TableCell>
                <TableCell>{leave.leave_type}</TableCell>
                <TableCell>{leave.employee.email}</TableCell>
                <TableCell>{leave.employee.phno}</TableCell>
                <TableCell>{leave.from_date} - {leave.to_date}</TableCell>
                <TableCell>
                  <IoEyeOutline
                    onClick={() => navigate(`/leave-details/${leave.id}`)}
                    style={{ cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell>
                  <ActionButtons>
                    {/* <DeclineButton onClick={() => {
                      setSelectedLeave(leave);
                      setActionType('rejected');
                      setShowModal(true);
                    }}>
                      Decline
                    </DeclineButton> */}
<ApproveButton
  onClick={() => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    console.log("Opening modal with:", leave.employee?.department, today);

    setSelectedLeave({
      department_id: leave.employee?.department, // 👈 pass the department string
      date: today
    });

    setShowModal(true);
  }}
>
  On Leaves
</ApproveButton>



                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))
          )}
        </tbody>
      </Table>

            <Pagination>
        <span
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          style={{ cursor: 'pointer', marginRight: '8px' }}
        >
          &larr;
        </span>
      
        {[1, 2].map((pageNumber) => {
          const isActive = pagination?.current_page === pageNumber;
      
          return (
            <span
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              style={{
                margin: '0 4px',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: isActive ? '#003366' : '#e0e0e0',
                color: isActive ? '#ffffff' : '#000000',
                fontWeight: isActive ? 'bold' : 'normal',
              }}
            >
              {pageNumber}
            </span>
          );
        })}
      
        <span
          onClick={() =>
            setPage((prev) => Math.min(prev + 1, 2))
          }
          style={{ cursor: 'pointer', marginLeft: '8px' }}
        >
          &rarr;
        </span>
      </Pagination>

      {/* {showModal && (
        <ConfirmLeaveModal
          onClose={() => setShowModal(false)}
          onConfirm={handleStatusUpdate}
          actionType={actionType}
        />
      )} */}
{showModal && (
  <OnLeaveModal
    departmentId={selectedLeave?.department_id}
    date={selectedLeave?.date}
    onClose={() => setShowModal(false)}
  />
)}


    </Container>
  );
}