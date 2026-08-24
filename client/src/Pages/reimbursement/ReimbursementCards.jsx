import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  HeaderWrapper,
  CardsGrid,
  Card,
  CardHeader,
  ReimbursementName,
  StatusBadge,
  EmployeeName,
  TotalAmount,
  StatusRow,
  ApprovedAmount,
  PendingAmount,
  CardBottom,
  EmployeeCount,
  EmployeeImage,
  ReimbursementNumber,
  ViewButton,
} from "./ReimbursementCard.Styles";

import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";
// import ReimbursementModal from "./modal/ReimbursementModal";

const ReimbursementCards = () => {
  const navigate = useNavigate();

  // =====================================================
  // SEARCH
  // =====================================================

  const [search, setSearch] = useState("");

  // =====================================================
  // MODAL STATE
  // =====================================================

  const [showReimbursementModal, setShowReimbursementModal] =
    useState(false);

  const [modalMode, setModalMode] = useState("add");

  const [selectedReimbursement, setSelectedReimbursement] =
    useState(null);

  // =====================================================
  // REIMBURSEMENT DATA
  // =====================================================

  const reimbursements = [
    {
      id: 1,
      name: "TRAVEL REIMBURSEMENT",
      employee: "Ansal",
      total: 5,
      totalAmount: "₹12,500",
      approved: "₹10,000",
      pending: "₹2,500",
      status: "Approved",
      image: "https://i.pravatar.cc/100?img=12",
    },

    {
      id: 2,
      name: "MEDICAL REIMBURSEMENT",
      employee: "Rahul",
      total: 8,
      totalAmount: "₹18,500",
      approved: "₹15,000",
      pending: "₹3,500",
      status: "Pending",
      image: "https://i.pravatar.cc/100?img=13",
    },

    {
      id: 3,
      name: "FOOD REIMBURSEMENT",
      employee: "Priya",
      total: 12,
      totalAmount: "₹8,500",
      approved: "₹7,000",
      pending: "₹1,500",
      status: "Approved",
      image: "https://i.pravatar.cc/100?img=14",
    },

    {
      id: 4,
      name: "FUEL REIMBURSEMENT",
      employee: "Amit",
      total: 6,
      totalAmount: "₹15,000",
      approved: "₹12,000",
      pending: "₹3,000",
      status: "Pending",
      image: "https://i.pravatar.cc/100?img=15",
    },

    {
      id: 5,
      name: "ACCOMMODATION",
      employee: "Rishal",
      total: 5,
      totalAmount: "₹25,000",
      approved: "₹22,000",
      pending: "₹3,000",
      status: "Approved",
      image: "https://i.pravatar.cc/100?img=16",
    },

    {
      id: 6,
      name: "OFFICE EXPENSE",
      employee: "Risvin",
      total: 4,
      totalAmount: "₹6,500",
      approved: "₹5,500",
      pending: "₹1,000",
      status: "Pending",
      image: "https://i.pravatar.cc/100?img=17",
    },

    {
      id: 7,
      name: "BUSINESS TRAVEL",
      employee: "John",
      total: 10,
      totalAmount: "₹32,000",
      approved: "₹28,000",
      pending: "₹4,000",
      status: "Approved",
      image: "https://i.pravatar.cc/100?img=18",
    },

    {
      id: 8,
      name: "COMMUNICATION",
      employee: "David",
      total: 7,
      totalAmount: "₹9,500",
      approved: "₹8,000",
      pending: "₹1,500",
      status: "Pending",
      image: "https://i.pravatar.cc/100?img=19",
    },
  ];

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = (value) => {
    setSearch(value);
  };

  // =====================================================
  // FILTER DATA
  // =====================================================

  const filteredReimbursements = reimbursements.filter(
    (reimbursement) =>
      reimbursement.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      reimbursement.employee
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // =====================================================
  // VIEW REIMBURSEMENT
  // =====================================================

  const handleViewReimbursement = (id) => {
    navigate(`/reimbursements/${id}`);
  };

  // =====================================================
  // ADD REIMBURSEMENT
  // =====================================================

  const handleAddReimbursement = () => {
    setModalMode("add");
    setSelectedReimbursement(null);
    setShowReimbursementModal(true);
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleReimbursementSubmit = (data) => {
    if (modalMode === "add") {
      console.log("Create Reimbursement:", data);

      // API call for creating reimbursement
    } else {
      console.log("Update Reimbursement:", data);

      // API call for updating reimbursement
    }

    setShowReimbursementModal(false);
  };

  return (
    <Container>

      {/* =================================================
          HEADER
      ================================================= */}

      <HeaderWrapper>
        <ReusableHeader
          title="Reimbursement"
          breadcrumbs={["Reimbursement"]}
          buttonText="History"
          onButtonClick={handleAddReimbursement}
        />
      </HeaderWrapper>

      {/* =================================================
          SEARCH / FILTER
      ================================================= */}

      <ReusableFilter
        search={search}
        onSearch={handleSearch}
        showSearch
      />

      {/* =================================================
          REIMBURSEMENT CARDS
      ================================================= */}

      <CardsGrid>
        {filteredReimbursements.map((reimbursement) => (
          <Card key={reimbursement.id}>

            {/* ================= HEADER ================= */}

            <CardHeader>
              <ReimbursementName>
                {reimbursement.name}
              </ReimbursementName>

              <StatusBadge
                status={reimbursement.status}
              >
                {reimbursement.status}
              </StatusBadge>
            </CardHeader>

            {/* ================= EMPLOYEE ================= */}

            <EmployeeName>
              Employee :{" "}
              <strong>{reimbursement.employee}</strong>
            </EmployeeName>

            {/* ================= TOTAL ================= */}

            <TotalAmount>
              Total Amount :{" "}
              {reimbursement.totalAmount}
            </TotalAmount>

            {/* ================= STATUS ================= */}

            <StatusRow>
              <ApprovedAmount>
                Approved :{" "}
                {reimbursement.approved}
              </ApprovedAmount>

              <PendingAmount>
                Pending :{" "}
                {reimbursement.pending}
              </PendingAmount>
            </StatusRow>

            {/* ================= BOTTOM ================= */}

            <CardBottom>
              <EmployeeCount>

                <EmployeeImage
                  src={reimbursement.image}
                  alt={reimbursement.employee}
                />

                <ReimbursementNumber>
                  {String(
                    reimbursement.total
                  ).padStart(2, "0")}
                </ReimbursementNumber>

              </EmployeeCount>

              <ViewButton
                type="button"
                onClick={() =>
                  handleViewReimbursement(
                    reimbursement.id
                  )
                }
              >
                VIEW REIMBURSEMENT
              </ViewButton>
            </CardBottom>

          </Card>
        ))}
      </CardsGrid>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {/* <ReimbursementModal
        isOpen={showReimbursementModal}
        onClose={() =>
          setShowReimbursementModal(false)
        }
        mode={modalMode}
        reimbursementData={selectedReimbursement}
        onSubmit={handleReimbursementSubmit}
      /> */}

    </Container>
  );
};

export default ReimbursementCards;