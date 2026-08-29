import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
import { fetchReimbursementsByDepartment } from "../../services/reimbursement"; // adjust path to where you put this
// import ReimbursementModal from "./modal/ReimbursementModal";

const PAGE_SIZE = 20;

const ReimbursementCards = () => {
  const navigate = useNavigate();
  const { departmentId } = useParams(); // assumes route like /reimbursements/department/:departmentId

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
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // =====================================================
  // FETCH REIMBURSEMENTS
  // =====================================================

  const loadReimbursements = useCallback(async () => {
    if (!departmentId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchReimbursementsByDepartment(
        departmentId,
        page,
        PAGE_SIZE
      );

      // Adjust these keys to match your actual API response shape
      setReimbursements(data.results ?? data);
      setTotalCount(data.count ?? (data.results ?? data).length);
    } catch (err) {
      console.error("Failed to fetch reimbursements:", err);
      setError("Failed to load reimbursements. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [departmentId, page]);

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
  // FILTER DATA (client-side filter on current page's results)
  // =====================================================

  const filteredReimbursements = reimbursements.filter(
    (reimbursement) =>
      reimbursement.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      reimbursement.employee
        ?.toLowerCase()
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
    loadReimbursements(); // refresh list after create/update
  };

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
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
      {error && <p style={{ color: "red" }}>{error}</p>}

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
          PAGINATION CONTROLS
      ================================================= */}

      {!loading && !error && totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "16px" }}>
          <button type="button" onClick={handlePrevPage} disabled={page === 1}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button type="button" onClick={handleNextPage} disabled={page === totalPages}>
            Next
          </button>
        </div>
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