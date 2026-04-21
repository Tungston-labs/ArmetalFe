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
} from "../finance/FinancePage.Styles";
import EmployeeIcon from "../../assets/employee.svg";
import EmployeeTitle from "../../Components/EmployeeTitle";
import FinanceModal from "./NewFinance";
import {
  createFinance,
  fetchFinanceList,
} from "../../Redux/financeThunks";
import FinanceSummary from "../../Components/finance/FinanceSummary";
import Pagination from "../../Components/Pagination/Pagination";
import NoEmployeeFound from "../../Components/No found/Noemployeefound";

const PAYMENT_TYPE_LABELS = {
  IN: "Income",
  OUT: "Expense",
};

const PAGE_SIZE = 20;
const FALLBACK = "----";

const FinanceDetail = () => {
  const dispatch = useDispatch();

  const {
    list = [],
    loading,
    pagination = {},
    totalIncome = 0,
    totalExpense = 0,
    cashBalance = 0,
  } = useSelector((state) => state.finance);

  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [page, setPage] = useState(1);

  const paymentOptions = [
    { label: "Income", value: "IN" },
    { label: "Expense", value: "OUT" },
  ];

  // Fetch Data
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

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchText, selectedPayment]);

  // Fix page overflow
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
      dispatch(
        fetchFinanceList({
          page: 1,
          pageSize: PAGE_SIZE,
        })
      );
      setPage(1);
    });
  };

  const handlePageChange = (newPage) => {
    if (!pagination?.totalPages) return;
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
  };

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

        {/* ✅ Use API Totals */}
        <FinanceSummary
          income={totalIncome}
          expense={totalExpense}
          cashBalance={cashBalance}
        />

        <TableWrapper>
          <StyledTable>
            <thead>
              <Tr>
                <Th>Sl No</Th>
                <Th>Date</Th>
                <Th>Category</Th>
                <Th>Note</Th>
                <Th>Income</Th>
                <Th>Expense</Th>
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
                    <Td>{(page - 1) * PAGE_SIZE + index + 1}</Td>
                    <Td>{formatDate(record.date)}</Td>
                    <Td>{record.category_name || FALLBACK}</Td>
                    <Td>{record.note || FALLBACK}</Td>
                    <Td>
                      {record.payment_type === "IN"
                        ? record.amount ?? FALLBACK
                        : "--"}
                    </Td>

                    <Td>
                      {record.payment_type === "OUT"
                        ? record.amount ?? FALLBACK
                        : "--"}
                    </Td>
                  </Tr>
                ))
              ) : (
                 <tr>
    <Td colSpan={6}>
      <NoEmployeeFound searchTerm={searchText} label="No Finance Records Found" />
    </Td>
  </tr>
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