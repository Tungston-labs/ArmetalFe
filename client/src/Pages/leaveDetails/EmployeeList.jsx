import React, { useEffect, useState } from "react";
import {
  Container,
  Pagination,
  TruncatedText,
  StyledTable,
  NameCell,
  Avatar,
  AvatarFallback,
  DeleteIconWrapper,
  TableHead,
  HeadRow,
  HeadCell,
  TableBody,
  BodyRow,
  BodyCell,
  EmptyRow,

} from "./EmployeeList.styles";
import {
  ModalOverlay,
  ModalContainer,
  ModalTitle,
  ModalText,
  ModalButton,
  ModalButtonWrapper,
} from "./DeletModal.styles";
import { PiUserCirclePlusThin } from "react-icons/pi";
import { FaTrash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllEmployees, deleteEmployeeById } from "../../Redux/employeeSlice";
import { getDepartments } from "../../Redux/departmentSlice";
import EmployeeIcon from "../../assets/employeeicon.svg";
// import Navbar from "../../Components/Navbar";
import Loader from "../../Components/Loader";
import EmployeeTitle from "../../Components/EmployeeTitle";
import RightSideModal from "../employeDashboard/RightSideModal";
const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
const [openModal, setOpenModal] = useState(false);
const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [departmentFilter, setDepartmentFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { employeeList, pagination, loading } = useSelector(
    (state) => state.employees
  );
  const { list: departmentList, loading: deptLoading } = useSelector(
    (state) => state.departments
  );
  useEffect(() => {
    dispatch(getDepartments({ page: 1, search: "" })); 
  }, [dispatch]);
  useEffect(() => {
    dispatch(
      getAllEmployees({
        page,
        search: "", 
        department_id: departmentFilter,
      })
    );
  }, [dispatch, page, departmentFilter]);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchText), 300);
    return () => clearTimeout(handler);
  }, [searchText]);

  const handleDeleteClick = (id) => {
    setSelectedEmployeeId(id);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    await dispatch(deleteEmployeeById(selectedEmployeeId));
    dispatch(
      getAllEmployees({
        page,
        search: "",
        department_id: departmentFilter,
      })
    );
    setShowDeleteModal(false);
    setSelectedEmployeeId(null);
  };
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedEmployeeId(null);
  };
  const handlePageChange = (newPage) => {
    dispatch(
      getAllEmployees({
        page: newPage,
        search: "",
        department_id: departmentFilter,
      })
    ).then(() => {
      setPage(newPage);
    });
  };
  const filteredEmployees = Array.isArray(employeeList)
    ? employeeList.filter(
        (emp) =>
          emp.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          emp.employee_id
            ?.toString()
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase())
      )
    : [];
  return (
    <>
      {loading && <Loader />}
      {/* <Navbar /> */}
      <Container>
      <EmployeeTitle
  key={departmentList?.length || 0} 
  iconSrc={EmployeeIcon}
  dropdownOptions={departmentList || []}
  dropdownLoading={deptLoading}
  onAddClick={() => navigate("/basic-details")}
  onSearchChange={setSearchText}
  onDropdownChange={setDepartmentFilter}
  showBackArrow={false}
  showTabs={true}
/>
        {!loading &&  (
          <>
     
           <StyledTable>
 <TableHead>
  <HeadRow>
    <HeadCell>Sl No</HeadCell>
    <HeadCell>Employee name</HeadCell>
    <HeadCell>Employee ID</HeadCell>
    <HeadCell>Email ID</HeadCell>
    <HeadCell>Job Position</HeadCell>
    <HeadCell>Department</HeadCell>
    <HeadCell>Delete</HeadCell>
  </HeadRow>
</TableHead>

<TableBody>
  {filteredEmployees.length > 0 ? (
    filteredEmployees.map((emp, index) => (
      <BodyRow
        key={emp.id}
        onClick={() => {
  setSelectedEmployee(emp);
  setOpenModal(true);
}}

      >
        <BodyCell>{index + 1 + (page - 1) * 20}</BodyCell>
<BodyCell>
        <NameCell>
          {emp.profile_pic ? (
            <Avatar src={emp.profile_pic} alt={emp.name} />
          ) : (
            <AvatarFallback>
              <PiUserCirclePlusThin size={20} color="#999" />
            </AvatarFallback>
          )}
          {emp.name}
        </NameCell>
</BodyCell>

        <BodyCell>{emp.employee_id}</BodyCell>

        <BodyCell>
          <TruncatedText title={emp.email}>{emp.email}</TruncatedText>
        </BodyCell>

        <BodyCell>
          <TruncatedText title={emp.designation}>
            {emp.designation}
          </TruncatedText>
        </BodyCell>

        <BodyCell>
          <TruncatedText title={emp.department}>
            {emp.department}
          </TruncatedText>
        </BodyCell>

        <DeleteIconWrapper
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick(emp.id);
          }}
        >
          <FaTrash color="red" />
        </DeleteIconWrapper>
      </BodyRow>
    ))
  ) : (
    <EmptyRow>
      <td colSpan="8">No employees found.</td>
    </EmptyRow>
  )}
</TableBody>

</StyledTable>

       <Pagination>
              <span onClick={() => handlePageChange(Math.max(page - 1, 1))}>
                &larr;
              </span>
              {Array.from(
                { length: pagination?.total_pages || 1 },
                (_, i) => i + 1
              ).map((pageNumber) => (
                <span
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={page === pageNumber ? "active" : ""}
                >
                  {pageNumber}
                </span>
              ))}
              <span
                onClick={() => {
                  if (page < (pagination?.total_pages || 1)) {
                    handlePageChange(page + 1);
                  }
                }}
              >
                &rarr;
              </span>
            </Pagination>
          </>
        )}

        {showDeleteModal && (
          <ModalOverlay>
            <ModalContainer>
              <ModalTitle>Confirm Deletion</ModalTitle>
              <ModalText>
           Are you sure you want to permanently delete this employee from the system?
              </ModalText>

              <ModalButtonWrapper>
                <ModalButton bg="red" onClick={confirmDelete}>
                  Delete
                </ModalButton>
                <ModalButton bg="gray" onClick={cancelDelete}>
                  Cancel
                </ModalButton>
              </ModalButtonWrapper>
            </ModalContainer>
          </ModalOverlay>
        )}
 {openModal && (
  <RightSideModal
    isOpen={openModal}
    onClose={() => setOpenModal(false)}
    employeeId={selectedEmployee?.id}
  />
)}


      </Container>
    </>
  );
};

export default EmployeeList;
