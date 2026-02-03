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
// import Navbar from '../../Components/Navbar';
import Loader  from "../../Components/Loader"
import {TableHead, BodyCell, BodyRow, EmptyRow, HeadCell, HeadRow, StyledTable, TableBody, TextBlock, Avatar, AvatarFallback, NameCell } from './EmployeeList.styles';
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
    {/* <Navbar/> */}
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

      <StyledTable>
         <TableHead>
       
      <HeadRow >
 <HeadCell>Sl No</HeadCell>
            <HeadCell>Employee name</HeadCell>
            <HeadCell>Leave type</HeadCell>
            {/* <HeadCell>Email ID</HeadCell> */}
            <HeadCell>Department</HeadCell>
            <HeadCell>Start date </HeadCell> 
              <HeadCell>End date</HeadCell>
            <HeadCell></HeadCell>
            </HeadRow>
  </TableHead>

    <TableBody>
  {loading ? (
    <TableRow>
      <TableCell colSpan="7"></TableCell>
    </TableRow>
  ) : filteredLeaves.length === 0 ? (
    <EmptyRow>
      <TableCell colSpan="7">No matching leave requests found.</TableCell>
    </EmptyRow>
  ) : (
    filteredLeaves.map((leave,index) => (
        <BodyRow
        key={leave.id}
        onClick={() => navigate(`/leave-details/${leave.id}`)}
        style={{
          cursor: "pointer",
          transition: "background 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#f9f9ff")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
         <BodyCell>{index + 1 + (page - 1) * 20}</BodyCell>
        <BodyCell>
             <NameCell>
          {leave?.employee?.profile_pic ? (
            <Avatar src={leave.employee.profile_pic} alt="profile" />
          ) : (
               <AvatarFallback>
            <PiUserCirclePlusThin size={40} color="#999" />
            </AvatarFallback>
          )}
          {leave?.employee?.name || "N/A"}
          </NameCell>
        </BodyCell>
        <BodyCell>{leave.leave_type}</BodyCell>
        {/* <BodyCell>{leave.employee.email}</BodyCell> */}
        <BodyCell>{leave.employee.department}</BodyCell>
        <BodyCell>
          {leave.from_date} 
            </BodyCell>
            <BodyCell> {leave.to_date}</BodyCell>
         
      
       
        <BodyCell
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
      ? "#fa8e8e"
      : "#074583",
    cursor: new Date(leave.to_date) < new Date().setHours(0, 0, 0, 0)
      ? "not-allowed"
      : "pointer",
  }}
  disabled={new Date(leave.to_date) < new Date().setHours(0, 0, 0, 0)}
>
  On Leaves
</ApproveButton>


          </ActionButtons>
        </BodyCell>
     </BodyRow>
    ))
  )}

</TableBody>

</StyledTable>

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