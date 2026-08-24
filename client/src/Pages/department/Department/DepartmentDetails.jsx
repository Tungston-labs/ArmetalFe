import React, { useMemo, useState } from "react";

import ReusableTable from "../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../Components/Pagination/ReusablePagination";
import ReusableFilter from "../../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../../Components/ReusableTable/ReusableHeader";
import StatsCards from "../../../Components/StatsCards/StatsCards";
import DepartmentModal from "./modal/DepartmentModal";

import {
  departmentData,
  departmentEmployeeColumns,
} from "./data";

import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiCalendar,
} from "react-icons/fi";

const DepartmentDetails = () => {
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  // --------------------------------------------------
  // MODAL STATES
  // --------------------------------------------------

  const [showDepartmentModal, setShowDepartmentModal] =
    useState(false);

  const [modalMode, setModalMode] =
    useState("edit");

  const [selectedDepartment, setSelectedDepartment] =
    useState(null);

  const rowsPerPage = 20;

  // --------------------------------------------------
  // EMPLOYEES
  // --------------------------------------------------

  const employees =
    departmentData?.employees || [];

  // --------------------------------------------------
  // FILTER DATA
  // --------------------------------------------------

  const filteredData = useMemo(() => {
    let data = [...employees];

    if (search.trim()) {
      const searchValue = search
        .trim()
        .toLowerCase();

      data = data.filter((employee) =>
        Object.values(employee).some(
          (value) =>
            String(value)
              .toLowerCase()
              .includes(searchValue)
        )
      );
    }

    return data;
  }, [employees, search]);

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
  }, [
    currentPage,
    filteredData,
  ]);

  // --------------------------------------------------
  // DEPARTMENT STATS
  // --------------------------------------------------

  const departmentCards = useMemo(() => {
    const totalEmployees =
      employees.length;

    const presentEmployees =
      employees.filter(
        (employee) =>
          employee.status
            ?.toLowerCase() ===
          "present"
      ).length;

    const absentEmployees =
      employees.filter(
        (employee) =>
          employee.status
            ?.toLowerCase() ===
          "absent"
      ).length;

    const leaveEmployees =
      employees.filter(
        (employee) =>
          employee.status
            ?.toLowerCase() ===
          "on leave"
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
  }, [employees]);

  // --------------------------------------------------
  // SEARCH
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

    setSelectedDepartment({
      id: departmentData.id,

      departmentName:
        departmentData.departmentName,

      departmentCode:
        departmentData.departmentCode,

      headOfDepartment:
        departmentData.headOfDepartment,

      teamLead:
        departmentData.teamLead,
    });

    setShowDepartmentModal(true);
  };

  // --------------------------------------------------
  // UPDATE DEPARTMENT
  // --------------------------------------------------

  const handleDepartmentSubmit = (data) => {
    console.log(
      "Updated Department:",
      data
    );

    // API update will come here

    setShowDepartmentModal(false);
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div
      style={{
        padding: 20,
      }}
    >
      {/* HEADER */}

      <ReusableHeader
        title={
          departmentData.departmentName
        }
        breadcrumbs={[
          "Department",
          "Department Details",
        ]}
        buttonText="Edit"
        onButtonClick={
          handleEditDepartment
        }
        showBack
      />

      {/* STATS */}

      <StatsCards
        cards={departmentCards}
      />

      {/* SEARCH */}

      <ReusableFilter
        search={search}
        onSearch={handleSearch}
        showSearch
      />

      {/* TABLE */}

      <ReusableTable
        columns={
          departmentEmployeeColumns
        }
        data={paginatedData}
      />

      {/* PAGINATION */}

      {totalPages > 0 && (
        <ReusablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={
            setCurrentPage
          }
        />
      )}

      {/* EDIT MODAL */}

      <DepartmentModal
        isOpen={
          showDepartmentModal
        }
        onClose={() =>
          setShowDepartmentModal(
            false
          )
        }
        mode={modalMode}
        departmentData={
          selectedDepartment
        }
        onSubmit={
          handleDepartmentSubmit
        }
      />
    </div>
  );
};

export default DepartmentDetails;