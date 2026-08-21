import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  HeaderWrapper,
  CardsGrid,
  Card,
  CardHeader,
  DepartmentName,
  ActiveBadge,
  DepartmentHead,
  TotalEmployee,
  StatusRow,
  Present,
  Leave,
  CardBottom,
  EmployeeCount,
  EmployeeImage,
  EmployeeNumber,
  ViewButton,
} from "./DepartmentCard.Styles";

import ReusableHeader from "../../../Components/ReusableTable/ReusableHeader";
import DepartmentModal from "./modal/DepartmentModal";
import ReusableFilter from "../../../Components/ReusableTable/ReusableFilter";

const DepartmentCards = () => {
  const navigate = useNavigate();
   const [search, setSearch] = useState("");
  // =====================================================
  // MODAL STATE
  // =====================================================

  const [showDepartmentModal, setShowDepartmentModal] =
    useState(false);

  const [modalMode, setModalMode] = useState("add");

  const [selectedDepartment, setSelectedDepartment] =
    useState(null);

  // =====================================================
  // DEPARTMENT DATA
  // =====================================================

  const departments = [
    {
      id: 1,
      name: "HR DEPARTMENT",
      head: "Ansal",
      total: 1,
      present: 1,
      leave: 0,
      status: "Active",
      image: "https://i.pravatar.cc/100?img=12",
    },

    {
      id: 2,
      name: "IT DEPARTMENT",
      head: "Rahul",
      total: 8,
      present: 7,
      leave: 1,
      status: "Active",
      image: "https://i.pravatar.cc/100?img=13",
    },

    {
      id: 3,
      name: "SALES DEPARTMENT",
      head: "Priya",
      total: 12,
      present: 10,
      leave: 2,
      status: "Active",
      image: "https://i.pravatar.cc/100?img=14",
    },

    {
      id: 4,
      name: "FINANCE DEPARTMENT",
      head: "Amit",
      total: 6,
      present: 6,
      leave: 0,
      status: "Active",
      image: "https://i.pravatar.cc/100?img=15",
    },

    {
      id: 5,
      name: "MARKETING DEPARTMENT",
      head: "Rishal",
      total: 5,
      present: 4,
      leave: 1,
      status: "Active",
      image: "https://i.pravatar.cc/100?img=16",
    },

    {
      id: 6,
      name: "UIUX DEPARTMENT",
      head: "Rishal",
      total: 4,
      present: 4,
      leave: 0,
      status: "Active",
      image: "https://i.pravatar.cc/100?img=17",
    },

    {
      id: 7,
      name: "DEVELOPMENT DEPARTMENT",
      head: "Risvin",
      total: 10,
      present: 9,
      leave: 1,
      status: "Active",
      image: "https://i.pravatar.cc/100?img=18",
    },

    {
      id: 8,
      name: "SUPPORT DEPARTMENT",
      head: "John",
      total: 7,
      present: 6,
      leave: 1,
      status: "Active",
      image: "https://i.pravatar.cc/100?img=19",
    },
  ];

  // =====================================================
  // VIEW DEPARTMENT
  // =====================================================

  const handleViewDepartment = (id) => {
    navigate(`/departments/${id}`);
  };

  // =====================================================
  // ADD DEPARTMENT
  // =====================================================

  const handleAddDepartment = () => {
    setModalMode("add");
    setSelectedDepartment(null);
    setShowDepartmentModal(true);
  };

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };
  // =====================================================
  // SUBMIT DEPARTMENT
  // =====================================================

  const handleDepartmentSubmit = (data) => {
    if (modalMode === "add") {
      console.log("Create Department:", data);

      // API call for creating department can come here
    } else {
      console.log("Update Department:", data);

      // API call for updating department can come here
    }
  };

  return (
    <Container>
      {/* =================================================
          HEADER
      ================================================= */}

      <HeaderWrapper>
        <ReusableHeader
          title="Department"
          breadcrumbs={["Department"]}
          buttonText="+ ADD NEW DEPARTMENT"
          onButtonClick={handleAddDepartment}
        />
      </HeaderWrapper>
 <ReusableFilter
                search={search}
                onSearch={handleSearch}
                showSearch
            />
      {/* =================================================
          DEPARTMENT CARDS
      ================================================= */}

      <CardsGrid>
        {departments.map((department) => (
          <Card key={department.id}>

            {/* ================= HEADER ================= */}

            <CardHeader>
              <DepartmentName>
                {department.name}
              </DepartmentName>

              <ActiveBadge>
                {department.status}
              </ActiveBadge>
            </CardHeader>

            {/* ================= HEAD ================= */}

            <DepartmentHead>
              Head Of The Department :{" "}
              <strong>{department.head}</strong>
            </DepartmentHead>

            {/* ================= TOTAL ================= */}

            <TotalEmployee>
              Total Employee:{" "}
              {String(department.total).padStart(2, "0")}
            </TotalEmployee>

            {/* ================= STATUS ================= */}

            <StatusRow>
              <Present>
                Present Today :{" "}
                {String(department.present).padStart(2, "0")}
              </Present>

              <Leave>
                On Leave Today :{" "}
                {String(department.leave).padStart(2, "0")}
              </Leave>
            </StatusRow>

            {/* ================= BOTTOM ================= */}

            <CardBottom>
              <EmployeeCount>
                <EmployeeImage
                  src={department.image}
                  alt={department.head}
                />

                <EmployeeNumber>
                  {String(department.total).padStart(2, "0")}
                </EmployeeNumber>
              </EmployeeCount>

              <ViewButton
                type="button"
                onClick={() =>
                  handleViewDepartment(department.id)
                }
              >
                VIEW DEPARTMENT
              </ViewButton>
            </CardBottom>

          </Card>
        ))}
      </CardsGrid>

      {/* =================================================
          ADD / EDIT DEPARTMENT MODAL
      ================================================= */}

      <DepartmentModal
        isOpen={showDepartmentModal}
        onClose={() =>
          setShowDepartmentModal(false)
        }
        mode={modalMode}
        departmentData={selectedDepartment}
        onSubmit={handleDepartmentSubmit}
      />

    </Container>
  );
};

export default DepartmentCards;