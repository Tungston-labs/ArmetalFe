import React, { useState, useEffect, useCallback } from "react";
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

import { getGroupedReimbursements } from "../../services/reimbursement";
// If you fetch per-department instead, swap in:
// import { fetchReimbursementsByDepartment } from "../../services/reimbursement";

const DEFAULT_AVATAR = "https://i.pravatar.cc/100?img=1";

// =====================================================
// Helper: normalize API response -> card shape
// Adjust the field names below to match your actual
// backend response once you confirm the payload shape.
// =====================================================
const formatCurrency = (value) => {
  const num = Number(value ?? 0);
  return `₹${num.toLocaleString("en-IN")}`;
};

const mapReimbursementData = (item) => ({
  id: item.id,
  name: (item.category || item.type || item.name || "REIMBURSEMENT").toUpperCase(),
  employee:
    item.employee_name ||
    item.employee?.name ||
    item.employee ||
    "—",
  total: item.total_count ?? item.count ?? item.total ?? 0,
  totalAmount: formatCurrency(item.total_amount ?? item.totalAmount),
  approved: formatCurrency(item.approved_amount ?? item.approved),
  pending: formatCurrency(item.pending_amount ?? item.pending),
  status: item.status || (Number(item.pending_amount) > 0 ? "Pending" : "Approved"),
  image: item.employee_image || item.employee?.image || DEFAULT_AVATAR,
});

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
  // REIMBURSEMENT DATA (from API)
  // =====================================================

  const [reimbursements, setReimbursements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadReimbursements = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getGroupedReimbursements();

      // Handle either a raw array or a paginated { results: [...] } shape
      const list = Array.isArray(data) ? data : data?.results || [];

      setReimbursements(list.map(mapReimbursementData));
    } catch (err) {
      console.error("Failed to load reimbursements:", err);
      setError(
        err?.message || "Something went wrong while loading reimbursements."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReimbursements();
  }, [loadReimbursements]);

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
          LOADING / ERROR STATES
      ================================================= */}

      {loading && <p>Loading reimbursements...</p>}

      {!loading && error && (
        <p style={{ color: "red" }}>
          {error}{" "}
          <button type="button" onClick={loadReimbursements}>
            Retry
          </button>
        </p>
      )}

      {!loading && !error && filteredReimbursements.length === 0 && (
        <p>No reimbursements found.</p>
      )}

      {/* =================================================
          REIMBURSEMENT CARDS
      ================================================= */}

      {!loading && !error && (
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
      )}

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