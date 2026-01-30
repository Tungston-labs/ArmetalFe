import React, { useState } from "react";
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

const DepartmentDetail = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  // payment options (no "All" here — placeholder handles it)
  const paymentOptions = ["Payment In", "Payment Out"];
  const [selectedPayment, setSelectedPayment] = useState(""); // "" => All

  // make rows stateful so new entries can be added
  const [departmentEmployees, setDepartmentEmployees] = useState([
    {
      id: 1,
      date: "2026-01-12",
      category: "Travel",
      note: "Airport trip",
      payment_type: "Cash",
      amount: "50",
      type: "in",
    },
    {
      id: 2,
      date: "2026-01-12",
      category: "Food",
      note: "Team outing",
      payment_type: "Card",
      amount: "120",
      type: "out",
    },
    {
      id: 3,
      date: "2026-01-12",
      category: "Office",
      note: "Notebooks & Pens",
      payment_type: "UPI",
      amount: "30",
      type: "in",
    },
  ]);

  const filteredEmployees = departmentEmployees.filter((emp) => {
    const search = searchText.trim().toLowerCase();
    const matchesSearch =
      search === "" ||
      (emp.note || "").toLowerCase().includes(search) ||
      (emp.category || "").toLowerCase().includes(search);
    const matchesPayment =
      selectedPayment === "" ||
      (selectedPayment === "Payment In" && emp.type === "in") ||
      (selectedPayment === "Payment Out" && emp.type === "out");

    return matchesSearch && matchesPayment;
  });

  const handleAddFinance = (newEntry) => {
    const type = newEntry.paymentType === "Payment In" ? "in" : "out";
    const amountValue = newEntry.amount1 || newEntry.amount2 || "0";

    const formattedEntry = {
      id: Date.now(),
      date: newEntry.date || new Date().toISOString().split("T")[0],
      category: newEntry.category || "Misc",
      note: newEntry.note || "",
      payment_type: newEntry.paymentTypeDisplay || newEntry.paymentType || "",
      amount: String(amountValue).replace(/^\$/, ""), // store as plain number string
      type,
    };

    setDepartmentEmployees((prev) => [...prev, formattedEntry]);
    setIsOpen(false);
  };

  return (
    <>
      <Container>
        <TopBar>
          <EmployeeTitle
            iconSrc={EmployeeIcon}
            title="Finance"
            subtitle="Manage your Finance "
            buttonText="Add Finance"
            searchValue={searchText}
            onSearchChange={setSearchText}
            onAddClick={() => setIsOpen(true)}
            showDropdown={true}
            dropdownOptions={paymentOptions}
            selectedDropdownValue={selectedPayment}
            dropdownPlaceholder="All Payments"
            onDropdownChange={setSelectedPayment}
            showBackArrow={false}
            showTabs={false}
            searchPlaceholder="Search Category Name"
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
                <Th>Payment type</Th>
                <Th>Amount</Th>
              </Tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp, index) => (
                  <Tr key={emp.id}>
                    <Td>{String(index + 1).padStart(3, "0")}</Td>
                    <Td>{emp.date}</Td>
                    <Td>{emp.category}</Td>
                    <Td>{emp.note}</Td>
                    <Td>{emp.payment_type}</Td>
                    <Td>{emp.amount}</Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                    No results found
                  </Td>
                </Tr>
              )}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Container>
      <FinanceModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSave={handleAddFinance} />
    </>
  );
};

export default DepartmentDetail;
