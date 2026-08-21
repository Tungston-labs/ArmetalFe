import React, { useMemo, useState } from "react";

import ReusableTable from "../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../Components/Pagination/ReusablePagination";
import ReusableFilter from "../../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../../Components/ReusableTable/ReusableHeader";
import StatsCards from "../../../Components/StatsCards/StatsCards";
import DepartmentModal from "./modal/DepartmentModal";

import {
    employeeColumns,
    employeeData,
} from "../../../Components/ReusableTable/dummydata";

import {
    FiUsers,
    FiUserCheck,
    FiUserX,
    FiCalendar,
} from "react-icons/fi";

const DepartmentDetails = () => {
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");
    const [month, setMonth] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    // Modal states
    const [showDepartmentModal, setShowDepartmentModal] =
        useState(false);

    const [modalMode, setModalMode] = useState("edit");

    const [selectedDepartment, setSelectedDepartment] =
        useState(null);

    const rowsPerPage = 20;

    // --------------------------------------------------
    // FILTER DATA
    // --------------------------------------------------

    const filteredData = useMemo(() => {
        let data = [...employeeData];

        if (search.trim()) {
            const searchValue = search.toLowerCase();

            data = data.filter((employee) =>
                Object.values(employee).some((value) =>
                    String(value)
                        .toLowerCase()
                        .includes(searchValue)
                )
            );
        }

        if (department) {
            data = data.filter(
                (employee) =>
                    employee.department?.toLowerCase() ===
                    department.toLowerCase()
            );
        }

        if (status) {
            data = data.filter(
                (employee) =>
                    employee.status?.toLowerCase() ===
                    status.toLowerCase()
            );
        }

        return data;
    }, [search, department, status, month]);

    // --------------------------------------------------
    // PAGINATION
    // --------------------------------------------------

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

    // --------------------------------------------------
    // DEPARTMENT STATS
    // --------------------------------------------------

    const departmentCards = useMemo(() => {
        const totalEmployees = filteredData.length;

        const presentEmployees = filteredData.filter(
            (employee) =>
                employee.status?.toLowerCase() === "present"
        ).length;

        const absentEmployees = filteredData.filter(
            (employee) =>
                employee.status?.toLowerCase() === "absent"
        ).length;

        const leaveEmployees = filteredData.filter(
            (employee) =>
                employee.status?.toLowerCase() === "on leave"
        ).length;

        return [
            {
                title: "Total Employees",
                count: totalEmployees,
                icon: <FiUsers />,
                backgroundColor: "#E8F1FF",
                iconColor: "#2878FF",
            },
            {
                title: "Present",
                count: presentEmployees,
                icon: <FiUserCheck />,
                backgroundColor: "#E9F9EF",
                iconColor: "#16A34A",
            },
            {
                title: "Absent",
                count: absentEmployees,
                icon: <FiUserX />,
                backgroundColor: "#FFF0F0",
                iconColor: "#EF4444",
            },
            {
                title: "On Leave",
                count: leaveEmployees,
                icon: <FiCalendar />,
                backgroundColor: "#FFF6E5",
                iconColor: "#F59E0B",
            },
        ];
    }, [filteredData]);

    // --------------------------------------------------
    // FILTER HANDLERS
    // --------------------------------------------------

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };
    // --------------------------------------------------
    // EDIT DEPARTMENT
    // --------------------------------------------------

    const handleEditDepartment = () => {
        setModalMode("edit");

        // Replace these values with your actual department data/API data
        setSelectedDepartment({
            id: 1,
            departmentName: "Development",
            departmentCode: "DEV-001",
            headOfDepartment: "Riswin",
            teamLead: "Ajay",
        });

        setShowDepartmentModal(true);
    };

    // --------------------------------------------------
    // UPDATE DEPARTMENT
    // --------------------------------------------------

    const handleDepartmentSubmit = (data) => {
        console.log("Updated Department:", data);

        // API update call can be added here

        setShowDepartmentModal(false);
    };

    return (
        <div style={{ padding: 20 }}>

            {/* HEADER */}
            <ReusableHeader
                title="Department"
                breadcrumbs={["Department Details"]}
                buttonText="Edit"
                onButtonClick={handleEditDepartment}
                showBack
            />

            {/* STATS */}
            <StatsCards cards={departmentCards} />

            {/* SEARCH */}
            <ReusableFilter
                search={search}
                onSearch={handleSearch}
                showSearch
            />

            {/* TABLE */}
            <ReusableTable
                columns={employeeColumns}
                data={paginatedData}
            />

            {/* PAGINATION */}
            {totalPages > 0 && (
                <ReusablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* EDIT DEPARTMENT MODAL */}
            <DepartmentModal
                isOpen={showDepartmentModal}
                onClose={() =>
                    setShowDepartmentModal(false)
                }
                mode={modalMode}
                departmentData={selectedDepartment}
                onSubmit={handleDepartmentSubmit}
            />

        </div>
    );
};

export default DepartmentDetails;