import React, { useMemo, useState } from "react";

import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../Components/Pagination/ReusablePagination";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";
import StatsCards from "../../Components/StatsCards/StatsCards";

// import ReimbursementModal from "./modal/ReimbursementModal";

import {
    reimbursementColumns,
    reimbursementData,
} from "../../Components/ReusableTable/dummydata";

import {
    FiFileText,
    FiCheckCircle,
    FiClock,
    FiXCircle,
} from "react-icons/fi";

const ReimbursementDetails = () => {

    // =====================================================
    // SEARCH
    // =====================================================

    const [search, setSearch] = useState("");

    // =====================================================
    // PAGINATION
    // =====================================================

    const [currentPage, setCurrentPage] = useState(1);

    const rowsPerPage = 20;

    // =====================================================
    // MODAL STATES
    // =====================================================

    const [
        showReimbursementModal,
        setShowReimbursementModal,
    ] = useState(false);

    const [modalMode, setModalMode] = useState("edit");

    const [
        selectedReimbursement,
        setSelectedReimbursement,
    ] = useState(null);

    // =====================================================
    // FILTER DATA
    // =====================================================

    const filteredData = useMemo(() => {

        let data = [...reimbursementData];

        if (search.trim()) {

            const searchValue =
                search.toLowerCase();

            data = data.filter((reimbursement) =>
                Object.values(reimbursement).some(
                    (value) =>
                        String(value)
                            .toLowerCase()
                            .includes(searchValue)
                )
            );
        }

        return data;

    }, [search]);

    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages = Math.ceil(
        filteredData.length / rowsPerPage
    );

    const paginatedData = useMemo(() => {

        const start =
            (currentPage - 1) * rowsPerPage;

        return filteredData.slice(
            start,
            start + rowsPerPage
        );

    }, [currentPage, filteredData]);

    // =====================================================
    // REIMBURSEMENT STATS
    // =====================================================

    const reimbursementCards = useMemo(() => {

        const totalRequests =
            filteredData.length;

        const approvedRequests =
            filteredData.filter(
                (reimbursement) =>
                    reimbursement.status
                        ?.toLowerCase() ===
                    "approved"
            ).length;

        const pendingRequests =
            filteredData.filter(
                (reimbursement) =>
                    reimbursement.status
                        ?.toLowerCase() ===
                    "pending"
            ).length;

        const rejectedRequests =
            filteredData.filter(
                (reimbursement) =>
                    reimbursement.status
                        ?.toLowerCase() ===
                    "rejected"
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

    const handleEditReimbursement = () => {

        setModalMode("edit");

        // Replace with API data later

        setSelectedReimbursement({

            id: 1,

            employeeName: "Ansal",

            reimbursementType:
                "Travel Reimbursement",

            amount: "12500",

            date: "21-08-2026",

            description:
                "Travel expenses",

            status: "Pending",

        });

        setShowReimbursementModal(true);
    };

    // =====================================================
    // UPDATE REIMBURSEMENT
    // =====================================================

    const handleReimbursementSubmit = (data) => {

        console.log(
            "Updated Reimbursement:",
            data
        );

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
                breadcrumbs={[
                    "Reimbursement Details",
                ]}
                buttonText="Edit"
                onButtonClick={
                    handleEditReimbursement
                }
                showBack
            />

            {/* =================================================
                STATS
            ================================================= */}

            <StatsCards
                cards={reimbursementCards}
            />

            {/* =================================================
                SEARCH
            ================================================= */}

            <ReusableFilter
                search={search}
                onSearch={handleSearch}
                showSearch
            />

            {/* =================================================
                TABLE
            ================================================= */}

            <ReusableTable
                columns={reimbursementColumns}
                data={paginatedData}
            />

            {/* =================================================
                PAGINATION
            ================================================= */}

            {totalPages > 0 && (
                <ReusablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={
                        setCurrentPage
                    }
                />
            )}

            {/* =================================================
                EDIT REIMBURSEMENT MODAL
            ================================================= */}

            {/* <ReimbursementModal
                isOpen={
                    showReimbursementModal
                }
                onClose={() =>
                    setShowReimbursementModal(
                        false
                    )
                }
                mode={modalMode}
                reimbursementData={
                    selectedReimbursement
                }
                onSubmit={
                    handleReimbursementSubmit
                }
            /> */}

        </div>
    );
};

export default ReimbursementDetails;