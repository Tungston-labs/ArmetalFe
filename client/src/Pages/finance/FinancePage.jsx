import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  TableWrapper,
  StyledTable,
  Th,
  Td,
  Tr,
  TopBar,
} from "../finance/FinancePage.Styles";
import EmployeeIcon from "../../assets/employee.svg";
import EmployeeTitle from "../../Components/EmployeeTitle";
import FinanceModal from "./NewFinance";
import { createFinance, fetchFinanceList, deleteFinance } from "../../Redux/financeThunks";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import FinanceSummary from "../../Components/finance/FinanceSummary";
import Pagination from "../../Components/Pagination/Pagination"
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
  useEffect(() => {
    dispatch(
      fetchFinanceList({
        page,
        pageSize: PAGE_SIZE,
        search: searchText,
        payment_type: selectedPayment,
      })
    );
  }, [dispatch, page, searchText, selectedPayment]);
  useEffect(() => {
    setPage(1);
  }, [searchText, selectedPayment]);
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

  const formatDate = (dateString) => {
  if (!dateString) return FALLBACK;

  const date = new Date(dateString);

  if (isNaN(date)) return FALLBACK;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
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
              </Tr>
            </thead>
            <tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={6} style={{ textAlign: "center" }}>
                    Loading...
                  </Td>
                </Tr>
              ) : list.length > 0 ? (
                list.map((record, index) => (
                  <Tr key={record.id}>
                    <Td>
                      {(page - 1) * PAGE_SIZE + index + 1}
                    </Td>

                        <Td>{formatDate(record.date)}</Td>
                    <Td>{record.category_name || FALLBACK}</Td>                    <Td>{record.note || FALLBACK}</Td>
                    <Td>{PAYMENT_TYPE_LABELS[record.payment_type] || FALLBACK}</Td>
                    <Td>
                      {record.amount !== null && record.amount !== undefined
                        ? record.amount
                        : FALLBACK}
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

        <Pagination
          currentPage={page}
          totalPages={pagination?.totalPages || 1}
          onPageChange={handlePageChange}
        />
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