import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../Components/Pagination/ReusablePagination";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";
import StatsCards from "../../Components/StatsCards/StatsCards";

// import ReimbursementModal from "./modal/ReimbursementModal";

import { reimbursementColumns } from "../../Components/ReusableTable/dummydata";

import {
    fetchReimbursementsByDepartment,
    updateReimbursementStatus,
} from "../../services/reimbursement";

import {
    FiFileText,
    FiCheckCircle,
    FiClock,
    FiXCircle,
} from "react-icons/fi";

const ROWS_PER_PAGE = 20;

// =====================================================
// Helper: normalize a single API row -> table row shape.
// Adjust these field names to match your actual backend
// payload once confirmed.
// =====================================================
const mapRow = (item) => ({
    id: item.id,
    employeeName:
        item.employee_name || item.employee?.name || item.employee || "—",
    reimbursementType:
        item.reimbursement_type || item.type || item.category || "—",
    amount: item.amount ?? item.total_amount ?? 0,
    date: item.date || item.created_at || "",
    description: item.description || "",
    status: item.status || "Pending",
});

const ReimbursementDetails = () => {
    const { id: departmentId } = useParams();

    // =====================================================
    // SEARCH
    // =====================================================

    const [search, setSearch] = useState("");

    // =====================================================
    // PAGINATION (server-side)
    // =====================================================

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // =====================================================
    // DATA / LOADING / ERROR
    // =====================================================

    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // =====================================================
    // MODAL STATES
    // =====================================================

    const [showReimbursementModal, setShowReimbursementModal] =
        useState(false);

    const [modalMode, setModalMode] = useState("edit");

    const [selectedReimbursement, setSelectedReimbursement] =
        useState(null);

    // =====================================================
    // FETCH DATA
    // =====================================================

    const loadData = useCallback(async () => {
        if (!departmentId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetchReimbursementsByDepartment(
                departmentId,
                currentPage,
                ROWS_PER_PAGE
            );

            // Handle either { results, count } (DRF-style) or a raw array
            const results = response?.results || response || [];
            const count = response?.count ?? results.length;

            setTableData(results.map(mapRow));
            setTotalPages(Math.max(1, Math.ceil(count / ROWS_PER_PAGE)));
        } catch (err) {
            console.error("Failed to load reimbursement details:", err);
            setError(
                err?.message ||
                    "Something went wrong while loading reimbursement details."
            );
        } finally {
            setLoading(false);
        }
    }, [departmentId, currentPage]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // =====================================================
    // CLIENT-SIDE SEARCH (within the current page's data)
    // Note: since pagination is server-side, search only
    // filters what's already loaded. For full-dataset search,
    // this would need a `search` param on the API call instead.
    // =====================================================

    const filteredData = useMemo(() => {
        if (!search.trim()) return tableData;

        const searchValue = search.toLowerCase();

        return tableData.filter((reimbursement) =>
            Object.values(reimbursement).some((value) =>
                String(value).toLowerCase().includes(searchValue)
            )
        );
    }, [search, tableData]);

    // =====================================================
    // REIMBURSEMENT STATS
    // =====================================================

    const reimbursementCards = useMemo(() => {
        const totalRequests = filteredData.length;

        const approvedRequests = filteredData.filter(
            (reimbursement) =>
                reimbursement.status?.toLowerCase() === "approved"
        ).length;

        const pendingRequests = filteredData.filter(
            (reimbursement) =>
                reimbursement.status?.toLowerCase() === "pending"
        ).length;

        const rejectedRequests = filteredData.filter(
            (reimbursement) =>
                reimbursement.status?.toLowerCase() === "rejected"
        ).length;

        return [
            {
                title: "Total Requests",
                count: totalRequests,
                icon: <FiFileText />,
                backgroundColor: "#E8F1FF",
                iconColor: "#2878FF",
            },
            {
                title: "Approved",
                count: approvedRequests,
                icon: <FiCheckCircle />,
                backgroundColor: "#E9F9EF",
                iconColor: "#16A34A",
            },
            {
                title: "Pending",
                count: pendingRequests,
                icon: <FiClock />,
                backgroundColor: "#FFF6E5",
                iconColor: "#F59E0B",
            },
            {
                title: "Rejected",
                count: rejectedRequests,
                icon: <FiXCircle />,
                backgroundColor: "#FFF0F0",
                iconColor: "#EF4444",
            },
        ];
    }, [filteredData]);

    // =====================================================
    // SEARCH HANDLER
    // =====================================================

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    // =====================================================
    // EDIT REIMBURSEMENT
    // =====================================================

    const handleEditReimbursement = (reimbursement) => {
        setModalMode("edit");
        setSelectedReimbursement(reimbursement);
        setShowReimbursementModal(true);
    };

    // =====================================================
    // UPDATE REIMBURSEMENT (status change, e.g. approve/reject)
    // =====================================================

    const handleStatusChange = async (reimbursementId, status) => {
        try {
            await updateReimbursementStatus(reimbursementId, status);
            // Refresh the current page so the table/stats reflect the change
            loadData();
        } catch (err) {
            console.error("Failed to update status:", err);
            setError(
                err?.message || "Failed to update reimbursement status."
            );
        }
    };

    const handleReimbursementSubmit = (data) => {
        console.log("Updated Reimbursement:", data);

        // API update call can be added here

        setShowReimbursementModal(false);
    };

    return (
        <div
            style={{
                padding: 20,
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            {/* =================================================
                HEADER
            ================================================= */}

            <ReusableHeader
                title="Reimbursement"
                breadcrumbs={["Reimbursement Details"]}
                showBack
            />

            {/* =================================================
                STATS
            ================================================= */}

            <StatsCards cards={reimbursementCards} />

            {/* =================================================
                SEARCH
            ================================================= */}

            <ReusableFilter
                search={search}
                onSearch={handleSearch}
                showSearch
            />

            {/* =================================================
                LOADING / ERROR STATES
            ================================================= */}

            {loading && <p>Loading reimbursement details...</p>}

            {!loading && error && (
                <p style={{ color: "red" }}>
                    {error}{" "}
                    <button type="button" onClick={loadData}>
                        Retry
                    </button>
                </p>
            )}

            {!loading && !error && filteredData.length === 0 && (
                <p>No reimbursement records found.</p>
            )}

            {/* =================================================
                TABLE
            ================================================= */}

            {!loading && !error && filteredData.length > 0 && (
                <ReusableTable
                    columns={reimbursementColumns}
                    data={filteredData}
                    onEdit={handleEditReimbursement}
                    onStatusChange={handleStatusChange}
                />
            )}

            {/* =================================================
                PAGINATION
            ================================================= */}

            {!loading && !error && totalPages > 0 && (
                <ReusablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* =================================================
                EDIT REIMBURSEMENT MODAL
            ================================================= */}

            {/* <ReimbursementModal
                isOpen={showReimbursementModal}
                onClose={() => setShowReimbursementModal(false)}
                mode={modalMode}
                reimbursementData={selectedReimbursement}
                onSubmit={handleReimbursementSubmit}
            /> */}
        </div>
    );
};

export default ReimbursementDetails;