import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLeaveRequests, patchLeaveStatus } from '../../Redux/leaveSlice';
import { NavLink, useNavigate } from 'react-router-dom';
import { IoEyeOutline } from 'react-icons/io5';
import OnLeaveModal from "./ModalList"
import { getDepartments } from "../../Redux/departmentSlice";
import EmployeeIcon from "../../assets/employeeicon.svg";
import {
  Container,
  Table,DepartmentSelect,
  TableRow,
  TableHead,
  TableCell,
  ProfileImage,
  ActionButtons,
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
  SearchWrapper,
  SearchIcon,
  EmployeeImage
} from './LeaveRequest.Styles';
import { PiUserCirclePlusThin } from "react-icons/pi";
import Navbar from '../../Components/Navbar';
import Loader  from "../../Components/Loader"
import { TextBlock } from './EmployeeList.styles';
import EmployeeTitle from '../../Components/EmployeeTitle';

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
  }));
}, [dispatch, page, departmentFilter]);

  
  useEffect(() => {
    // console.log("Pagination Info:", pagination);
  }, [pagination]);

  const leaveData = leaves || [];
  console.log(leaveData);
  
    const { list: departmentList, loading: deptLoading } = useSelector(
      (state) => state.departments
    );
const isLoading = loading || deptLoading;

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
  
    dispatch(getDepartments());
  }, [dispatch]);
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPage(1); 
  };

  return (
    <>
    <Navbar/>
      {loading && <Loader />}
    <Container>
  <EmployeeTitle
  iconSrc={EmployeeIcon}
  showAddButton={false}
  dropdownOptions={departmentList || []}
  dropdownLoading={deptLoading}
  onSearchChange={setSearchText}
  onDropdownChange={setDepartmentFilter}
       showBackArrow={false}
/>

      <Table>
        <thead>
          <TableRow>
            <TableHead>Employee name</TableHead>
            <TableHead>Leave type</TableHead>
            <TableHead>Email ID</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Start date </TableHead> 
              <TableHead>End date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </thead>
        <tbody>
  {loading ? (
    <TableRow>
      <TableCell colSpan="7"></TableCell>
    </TableRow>
  ) : filteredLeaves.length === 0 ? (
    <TableRow>
      <TableCell colSpan="7">No matching leave requests found.</TableCell>
    </TableRow>
  ) : (
    filteredLeaves.map((leave) => (
      <TableRow
        key={leave.id}
        onClick={() => navigate(`/leave-details/${leave.id}`)}
        style={{
          cursor: "pointer",
          transition: "background 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#f9f9ff")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <TableCell style={{ alignItems: "center", gap: "10px" }}>
          {leave?.employee?.profile_pic ? (
            <ProfileImage src={leave.employee.profile_pic} alt="profile" />
          ) : (
            <PiUserCirclePlusThin size={40} color="#999" />
          )}
          {leave?.employee?.name || "N/A"}
        </TableCell>
        <TableCell>{leave.leave_type}</TableCell>
        <TableCell>{leave.employee.email}</TableCell>
        <TableCell>{leave.employee.department}</TableCell>
        <TableCell>
          {leave.from_date} 
            </TableCell>
            <TableCell> {leave.to_date}</TableCell>
         
      
       
        <TableCell
          onClick={(e) => {
            e.stopPropagation(); 
          }}
        >
          <ActionButtons>
     <ApproveButton
  onClick={() => {
    const today = new Date();
    const leaveEnd = new Date(leave.to_date);

    // Disable only if leave is in the past
    if (leaveEnd < today.setHours(0, 0, 0, 0)) {
      alert("You cannot approve past leave requests.");
      return;
    }

    setSelectedLeave({
      leave_id: leave.id,
      employee_id: leave.employee?.id,
      date: today.toISOString().split("T")[0],
    });
    setShowModal(true);
  }}
  style={{
    backgroundColor: new Date(leave.to_date) < new Date().setHours(0, 0, 0, 0)
      ? "#ccc"
      : "#003366",
    cursor: new Date(leave.to_date) < new Date().setHours(0, 0, 0, 0)
      ? "not-allowed"
      : "pointer",
  }}
  disabled={new Date(leave.to_date) < new Date().setHours(0, 0, 0, 0)}
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
      
        {[1].map((pageNumber) => {
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

{showModal && (
  <OnLeaveModal
    leaveId={selectedLeave?.leave_id}    // ✅ leave id
    employeeId={selectedLeave?.employee_id}
    date={selectedLeave?.date}
    onClose={() => setShowModal(false)}
  />
)}




    </Container>
    </>
  );
}