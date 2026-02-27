import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLeaveRequests, patchLeaveStatus } from '../../Redux/leaveSlice';
import { useNavigate } from 'react-router-dom';
import OnLeaveModal from "./ModalList"
import { getDepartments } from "../../Redux/departmentSlice";
import EmployeeIcon from "../../assets/employeeicon.svg";
import {
  Container,
  TableRow,
  TableCell,
  ActionButtons,
  ApproveButton,
} from './LeaveRequest.Styles';
import Loader from "../../Components/Loader"
import { TableHead, BodyCell, BodyRow, EmptyRow, HeadCell, HeadRow, StyledTable, TableBody, Avatar, AvatarFallback, NameCell } from './EmployeeList.styles';
import EmployeeTitle from '../../Components/EmployeeTitle';
import Pagination from "../../Components/Pagination/Pagination"
export default function LeaveRequest() {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const { leaves, loading, pagination } = useSelector(state => state.leave);
  const [actionType, setActionType] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [departmentFilter, setDepartmentFilter] = useState("");

  useEffect(() => {
    dispatch(getLeaveRequests({
      page,
      department_id: departmentFilter || undefined,
    }));
  }, [dispatch, page, departmentFilter]);


  useEffect(() => {
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
      dispatch(getLeaveRequests(page));
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


  const handlePageChange = (newPage) => {
    if (!newPage || newPage < 1) return;

    dispatch(
      getLeaveRequests({
        page: newPage,
        department_id: departmentFilter || undefined,
      })
    ).then(() => {
      setPage(newPage);
    });
  };
  return (
    <>

      {loading && <Loader />}
      <Container>
        <EmployeeTitle
          iconSrc={EmployeeIcon}
          showAddButton={false}
          dropdownOptions={departmentList || []}
          dropdownLoading={deptLoading}
          searchValue={searchText}
          onSearchChange={setSearchText}
          selectedDropdownValue={departmentFilter}
          onDropdownChange={setDepartmentFilter}
          showBackArrow={false}
        />

        <StyledTable>
          <TableHead>

            <HeadRow >
              <HeadCell>Sl No</HeadCell>
              <HeadCell>Employee name</HeadCell>
              <HeadCell>Leave type</HeadCell>
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
              filteredLeaves.map((leave, index) => (
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
                    {leave?.employee?.name || "N/A"}
                  </BodyCell>
                  <BodyCell>{leave.leave_type}</BodyCell>
                  <BodyCell>{leave.employee.department}</BodyCell>
                  <BodyCell>
                    {leave.from_date
                      ? new Date(leave.from_date).toLocaleDateString("en-GB")
                      : "N/A"}
                  </BodyCell>
                  <BodyCell>
                    {leave.to_date
                      ? new Date(leave.to_date).toLocaleDateString("en-GB")
                      : "N/A"}
                  </BodyCell>
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

        <Pagination
          currentPage={page}
          totalPages={pagination?.total_pages ?? 1}
          onPageChange={handlePageChange}
        />
        {showModal && (
          <OnLeaveModal
            leaveId={selectedLeave?.leave_id}
            employeeId={selectedLeave?.employee_id}
            date={selectedLeave?.date}
            onClose={() => setShowModal(false)}
          />
        )}
      </Container>
    </>
  );
}