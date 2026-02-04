import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  TableWrapper,
  StyledTable,
  Th,
  Td,
  Tr,
  TopBar,
  Pagination,
} from "../finance/FinancePage.Styles";
import EmployeeIcon from "../../assets/employee.svg";
import EmployeeTitle from "../../Components/EmployeeTitle";
import FinanceModal from "./NewFinance";
import { createFinance, fetchFinanceList, deleteFinance } from "../../Redux/financeThunks";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const PAYMENT_TYPE_LABELS = {
  IN: "Income",
  OUT: "Expense",
};
const CATEGORY_LABELS = {
  SALARY: "Salary",
  REIMBURSEMENT: "Reimbursement",
  TRAVEL: "Travel",
  FOOD: "Food",
  OTHER: "Other",
};
const PAGE_SIZE = 20; 
const FinanceDetail = () => {
  const dispatch = useDispatch();
  const { list = [], loading, pagination = {} } = useSelector((state) => state.finance);

  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [page, setPage] = useState(1);
const recordsPerPage = 20;
const [currentPage, setCurrentPage] = useState(1);

  const paymentOptions = [
    { label: "Income", value: "IN" },
    { label: "Expense", value: "OUT" },
  ];
  const FALLBACK = "----";
  useEffect(() => {
    dispatch(fetchFinanceList({
      page,
      pageSize: PAGE_SIZE,
      search: searchText,
      payment: selectedPayment
    }));
  }, [dispatch, page, searchText, selectedPayment]);
  useEffect(() => {
    setPage(1);
  }, [searchText, selectedPayment]);
  useEffect(() => {
    if (pagination?.totalPages && page > pagination.totalPages) {
      setPage(pagination.totalPages);
    }
  }, [pagination?.totalPages]);

  const filteredEmployees = list; 
  const handleAddFinance = (formData) => {
    const payload = {
      category: formData.category,
      date: formData.date,
      note: formData.note,
      payment_type: formData.paymentType,
      amount: formData.amount1,
    };
    dispatch(createFinance(payload)).then(() => {
      setIsOpen(false);
      dispatch(fetchFinanceList({ page: 1, pageSize: PAGE_SIZE }));
      setPage(1);
    });
  };
const totalRecords = list.length;

const indexOfLastRecord = currentPage * recordsPerPage;
const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

const currentRecords = list.slice(
  indexOfFirstRecord,
  indexOfLastRecord
);

const totalPages = Math.ceil(totalRecords / recordsPerPage);


  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This record will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteFinance(id)).then(() => {
          dispatch(fetchFinanceList({ page, pageSize: PAGE_SIZE, search: searchText, payment: selectedPayment }));
          Swal.fire({
            title: "Deleted!",
            text: "Finance record has been deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        });
      }
    });
  };

  const handlePageChange = (newPage) => {
    if (!pagination?.totalPages) return;
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
  };

  return (
    <>
      <Container>
        <TopBar>
          <EmployeeTitle
            iconSrc={EmployeeIcon}
            title="Finance"
            subtitle="Manage your Finance"
            buttonText="Add Finance"
            searchValue={searchText}
            onSearchChange={setSearchText}
            onAddClick={() => setIsOpen(true)}
            showDropdown
            dropdownOptions={paymentOptions}
            selectedDropdownValue={selectedPayment}
            dropdownPlaceholder="All Payments"
            onDropdownChange={setSelectedPayment}
            showBackArrow={false}
            showTabs={false}
            searchPlaceholder="Search Category / Note"
          />
        </TopBar>

        <TableWrapper>
          <StyledTable>
            <thead>
              <Tr>
                <Th>Sl No</Th>
                <Th>Date</Th>
                <Th>Category</Th>
                <Th>Note</Th>
                <Th>Payment Type</Th>
                <Th>Amount</Th>
                <Th></Th>
              </Tr>
            </thead>
            <tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={7} style={{ textAlign: "center" }}>
                    Loading...
                  </Td>
                </Tr>
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp, index) => (
                  <Tr key={emp.id}>
                    <Td>
                      {String((page - 1) * PAGE_SIZE + index + 1).padStart(3, "0")}
                    </Td>

                    <Td>{emp.date || FALLBACK}</Td>
                    <Td>{CATEGORY_LABELS[emp.category] || FALLBACK}</Td>
                    <Td>{emp.note || FALLBACK}</Td>
                    <Td>{PAYMENT_TYPE_LABELS[emp.payment_type] || FALLBACK}</Td>
                    <Td>
                      {emp.amount !== null && emp.amount !== undefined
                        ? emp.amount
                        : FALLBACK}
                    </Td>
                    <Td>
                      <FaTrash
                        color="red"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete(emp.id)}
                      />
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={7} style={{ textAlign: "center" }}>
                    No results found
                  </Td>
                </Tr>
              )}
            </tbody>
          </StyledTable>
        </TableWrapper>
<Pagination>
  <span onClick={() => handlePageChange(Math.max(page - 1, 1))}>
    &larr;
  </span>

  {Array.from(
    { length: pagination?.totalPages || 1 },
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
      if (page < (pagination?.totalPages || 1)) {
        handlePageChange(page + 1);
      }
    }}
  >
    &rarr;
  </span>
</Pagination>

      </Container>

      <FinanceModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleAddFinance}
      />
    </>
  );
};

export default FinanceDetail;
