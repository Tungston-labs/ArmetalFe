import React, { useEffect, useState ,useMemo } from "react";
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
import FinanceSummary from "../../Components/finance/FinanceSummary";

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
  SUBSCRIPTION: "Subscription",
};

const PAGE_SIZE = 20;

const FinanceDetail = () => {
  const dispatch = useDispatch();
  const { list = [], loading, pagination = {} } = useSelector((state) => state.finance);

  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [page, setPage] = useState(1);

  const paymentOptions = [
    { label: "Income", value: "IN" },
    { label: "Expense", value: "OUT" },
  ];

  const FALLBACK = "----";

  // 🔹 Fetch finance list
  useEffect(() => {
    dispatch(
      fetchFinanceList({
        page,
        pageSize: PAGE_SIZE,
        search: searchText,
        payment_type: selectedPayment, // ✅ correct param
      })
    );
  }, [dispatch, page, searchText, selectedPayment]);

  // 🔹 Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchText, selectedPayment]);

  // 🔹 Prevent invalid page after filtering
  useEffect(() => {
    if (pagination?.totalPages && page > pagination.totalPages) {
      setPage(pagination.totalPages);
    }
  }, [pagination?.totalPages, page]);

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
          dispatch(
            fetchFinanceList({
              page,
              pageSize: PAGE_SIZE,
              search: searchText,
              payment_type: selectedPayment,
            })
          );

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

  const totals = useMemo(() => {
  const income = list
    .filter((r) => r.payment_type === "IN")
    .reduce((s, r) => s + Number(r.amount || 0), 0);

  const expense = list
    .filter((r) => r.payment_type === "OUT")
    .reduce((s, r) => s + Number(r.amount || 0), 0);

  return { income, expense };
}, [list]);

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
        
<FinanceSummary
  income={totals.income}
  expense={totals.expense}
/>
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
              ) : list.length > 0 ? (
                list.map((record, index) => (
                  <Tr key={record.id}>
                    <Td>{String((page - 1) * PAGE_SIZE + index + 1).padStart(3, "0")}</Td>

                    <Td>{record.date || FALLBACK}</Td>
                    <Td>{CATEGORY_LABELS[record.category] || FALLBACK}</Td>
                    <Td>{record.note || FALLBACK}</Td>
                    <Td>{PAYMENT_TYPE_LABELS[record.payment_type] || FALLBACK}</Td>
                    <Td>
                      {record.amount !== null && record.amount !== undefined
                        ? record.amount
                        : FALLBACK}
                    </Td>
                    <Td>
                      <FaTrash
                        color="red"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete(record.id)}
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
          <span onClick={() => handlePageChange(Math.max(page - 1, 1))}>&larr;</span>

          {Array.from({ length: pagination?.totalPages || 1 }, (_, i) => i + 1).map(
            (pageNumber) => (
              <span
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={page === pageNumber ? "active" : ""}
              >
                {pageNumber}
              </span>
            )
          )}

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