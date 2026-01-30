import React, { useState } from "react";
import {
  Container,
  HeaderSection,
  Title,
  Subtitle,
  TitleSection,
  ActionArea,
  AddButton,
  TableWrapper,
  StyledTable,
  SearchInput,
  Tabs,
  TabButton,
  FilterInput,
} from "../finance/FinancePage.Styles";
import { HiArrowLeft } from "react-icons/hi";
import EmployeeIcon from "../../assets/employee.svg";
import NewFinance from "./NewFinance";
import EmployeeTitle from "../../Components/EmployeeTitle";

const DepartmentDetail = () => {
  const [activeTab, setActiveTab] = useState("inout");
  const [isOpen, setIsOpen] = useState(false);

  // Search states
  const [searchText, setSearchText] = useState("");   // for name/note search
  const [filterCategory, setFilterCategory] = useState("");

  // Dummy static data
  const departmentEmployees = [
    {
      id: 1,
      date: "12 January",
      category: "Travel",
      sub_category: "Taxi",
      note: "Airport trip",
      payment_type: "Cash",
      amount: "$50",
    },
    {
      id: 2,
      date: "12 January",
      category: "Food",
      sub_category: "Lunch",
      note: "Team outing",
      payment_type: "Card",
      amount: "$120",
    },
    {
      id: 3,
      date: "12 January",
      category: "Office",
      sub_category: "Stationery",
      note: "Notebooks & Pens",
      payment_type: "UPI",
      amount: "$30",
    },
  ];

  // Filtering logic
  const filteredEmployees = departmentEmployees.filter((emp) => {
    const matchesSearch =
      emp.note.toLowerCase().includes(searchText.toLowerCase()) ||
      emp.sub_category.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory =
      filterCategory === "" ||
      emp.category.toLowerCase().includes(filterCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <>
         <Container>
<EmployeeTitle
  iconSrc={EmployeeIcon}
  title="Departments"
  subtitle="Manage your departments"
  buttonText="Add Department"
  // searchValue={search}
  // onSearchChange={setSearch}
  // onAddClick={() => setShowModal(true)} 
  showDropdown={false}
  showBackArrow={false}
  showTabs={false}
/>
 
        <HeaderSection>
          <TitleSection>
            <HiArrowLeft
              style={{
                width: "24px",
                height: "24px",
                cursor: "pointer",
                color: "#3250B5",
              }}
            />
            {/* <img src={Employee} alt="employee icon" /> */}
            <div>
              <Title>Finance</Title>
              <Subtitle>
                Manage all departments within the organization.
              </Subtitle>
            </div>
          </TitleSection>

          <ActionArea>
            <div>
              <AddButton onClick={() => setIsOpen(true)}>+ Add </AddButton>
              <NewFinance isOpen={isOpen} onClose={() => setIsOpen(false)} />
            </div>
          </ActionArea>
        </HeaderSection>

        {/* Search & Filter */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
            gap: "1rem",
          }}
        >
          {/* Search Input */}
          <SearchInput
            placeholder="Search "
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          {/* Filter Input */}
          <FilterInput
            placeholder="Filter By Category "
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <Tabs>
          <TabButton
            active={activeTab === "inout"}
            onClick={() => setActiveTab("inout")}
          >
            Payment in and out
          </TabButton>
          <TabButton
            active={activeTab === "pending"}
            onClick={() => setActiveTab("pending")}
          >
            Pending payment
          </TabButton>
        </Tabs>

        {/* Table */}
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Date</th>
                <th>Category</th>
                <th>Sub Category</th>
                <th>Note</th>
                <th>Payment type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp, index) => (
                  <tr key={emp.id}>
                    <td>{String(index + 1).padStart(3, "0")}</td>
                    <td>{emp.date}</td>
                    <td>{emp.category}</td>
                    <td>{emp.sub_category}</td>
                    <td>{emp.note}</td>
                    <td>{emp.payment_type}</td>
                    <td>{emp.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Container>
    </>
  );
};

export default DepartmentDetail;
