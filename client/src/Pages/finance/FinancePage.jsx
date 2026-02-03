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
import { createFinance, fetchFinanceList } from "../../Redux/financeThunks";

/* =====================
   Display label maps
   ===================== */
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

const FinanceDetail = () => {
  const dispatch = useDispatch();
  const { list = [], loading } = useSelector((state) => state.finance);
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");

  const paymentOptions = [
    { label: "Income", value: "IN" },
    { label: "Expense", value: "OUT" },
  ];
const FALLBACK = "----";

  useEffect(() => {
    dispatch(fetchFinanceList());
  }, [dispatch]);

  const filteredEmployees = list.filter((emp) => {
    const search = searchText.trim().toLowerCase();

    const matchesSearch =
      search === "" ||
      emp.note?.toLowerCase().includes(search) ||
      CATEGORY_LABELS[emp.category]?.toLowerCase().includes(search);

    const matchesPayment =
      selectedPayment === "" ||
      emp.payment_type === selectedPayment;

    return matchesSearch && matchesPayment;
  });
  const handleAddFinance = (formData) => {
    const payload = {
      category: formData.category,
      date: formData.date,
      note: formData.note,
      payment_type: formData.paymentType, // IN | OUT
      amount: formData.amount1,
    };

    dispatch(createFinance(payload)).then(() => {
      setIsOpen(false);
    });
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
              </Tr>
            </thead>
           <tbody>
  {loading ? (
    <Tr>
      <Td colSpan="6" style={{ textAlign: "center" }}>
        Loading...
      </Td>
    </Tr>
  ) : filteredEmployees.length > 0 ? (
    filteredEmployees.map((emp, index) => (
      <Tr key={emp.id}>
        <Td>{String(index + 1).padStart(3, "0")}</Td>
        <Td>{emp.date || FALLBACK}</Td>
        <Td>{CATEGORY_LABELS[emp.category] || FALLBACK}</Td>
        <Td>{emp.note || FALLBACK}</Td>
        <Td>{PAYMENT_TYPE_LABELS[emp.payment_type] || FALLBACK}</Td>
        <Td>
          {emp.amount !== null && emp.amount !== undefined
            ? emp.amount
            : FALLBACK}
        </Td>
      </Tr>
    ))
  ) : (
    <Tr>
      <Td colSpan="6" style={{ textAlign: "center" }}>
        No results found
      </Td>
    </Tr>
  )}
</tbody>

          </StyledTable>
        </TableWrapper>
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
