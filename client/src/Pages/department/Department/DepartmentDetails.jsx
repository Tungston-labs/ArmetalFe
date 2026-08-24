import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useParams,
} from "react-router-dom";

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
  getEmployeesByDepartment,
  getDepartmentById,
  updateDepartmentById,
} from "../../../Redux/departmentSlice";

import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiCalendar,
} from "react-icons/fi";

const DepartmentDetails = () => {
  const dispatch = useDispatch();

  const { id: departmentId } =
    useParams();

  const [search, setSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [
    showDepartmentModal,
    setShowDepartmentModal,
  ] = useState(false);

  const [modalMode, setModalMode] =
    useState("edit");

  const [
    selectedDepartment,
    setSelectedDepartment,
  ] = useState(null);

  const rowsPerPage = 20;

  // =========================================================
  // REDUX STATE
  // =========================================================

  const {
    departmentEmployees,
    loadingEmployees,
    error,
    current,
  } = useSelector(
    (state) => state.departments
  );

  // =========================================================
  // GET DEPARTMENT + EMPLOYEES
  // =========================================================

  useEffect(() => {
    if (!departmentId) return;

    dispatch(
      getDepartmentById(
        departmentId
      )
    );

    dispatch(
      getEmployeesByDepartment(
        departmentId
      )
    );
  }, [
    dispatch,
    departmentId,
  ]);

  // =========================================================
  // EMPLOYEES
  // =========================================================

  const employees = useMemo(() => {
    if (
      Array.isArray(
        departmentEmployees
      )
    ) {
      return departmentEmployees;
    }

    if (
      departmentEmployees &&
      Array.isArray(
        departmentEmployees.results
      )
    ) {
      return departmentEmployees.results;
    }

    return [];
  }, [
    departmentEmployees,
  ]);

  // =========================================================
  // NORMALIZE EMPLOYEE DATA
  // =========================================================

  const employeeTableData =
    useMemo(() => {
      return employees.map(
        (employee, index) => ({
          slNo: index + 1,

          name:
            employee.name || "-",

          employee_id:
            employee.employee_id ||
            "-",

          profile_pic:
            employee.profile_pic ||
            null,

          id: employee.id,
        })
      );
    }, [employees]);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredData =
    useMemo(() => {
      if (!search.trim()) {
        return employeeTableData;
      }

      const searchValue =
        search
          .trim()
          .toLowerCase();

      return employeeTableData.filter(
        (employee) =>
          String(employee.name)
            .toLowerCase()
            .includes(
              searchValue
            ) ||
          String(
            employee.employee_id
          )
            .toLowerCase()
            .includes(
              searchValue
            )
      );
    }, [
      employeeTableData,
      search,
    ]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages =
    Math.ceil(
      filteredData.length /
        rowsPerPage
    );

  const paginatedData =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        rowsPerPage;

      return filteredData.slice(
        start,
        start + rowsPerPage
      );
    }, [
      filteredData,
      currentPage,
    ]);

  // =========================================================
  // RESET PAGE WHEN SEARCH CHANGES
  // =========================================================

  const handleSearch = (
    value
  ) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // =========================================================
  // DEPARTMENT STATS
  // =========================================================

  const departmentCards =
    useMemo(() => {
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
          title:
            "Total Employees",
          count:
            totalEmployees,
          icon: <FiUsers />,
          backgroundColor:
            "#E8F1FF",
          iconColor:
            "#2878FF",
        },

        {
          title: "Present",
          count:
            presentEmployees,
          icon:
            <FiUserCheck />,
          backgroundColor:
            "#E9F9EF",
          iconColor:
            "#16A34A",
        },

        {
          title: "Absent",
          count:
            absentEmployees,
          icon:
            <FiUserX />,
          backgroundColor:
            "#FFF0F0",
          iconColor:
            "#EF4444",
        },

        {
          title:
            "On Leave",
          count:
            leaveEmployees,
          icon:
            <FiCalendar />,
          backgroundColor:
            "#FFF6E5",
          iconColor:
            "#F59E0B",
        },
      ];
    }, [employees]);

  // =========================================================
  // EDIT DEPARTMENT
  // =========================================================

  const handleEditDepartment =
    () => {
      const department =
        current ||
        departmentData;

      if (!department) {
        console.error(
          "Department data not found"
        );

        return;
      }

      setModalMode("edit");

      setSelectedDepartment({
        id: department.id,

        departmentName:
          department.name ||
          department.departmentName ||
          "",

        departmentCode:
          department.department_code ||
          department.departmentCode ||
          "",

        headOfDepartment:
          department.department_head ||
          department.head_of_department ||
          department.headOfDepartment ||
          "",

        teamLead:
          department.team_lead ||
          department.teamLead ||
          "",
      });

      setShowDepartmentModal(
        true
      );
    };

  // =========================================================
  // UPDATE DEPARTMENT
  // =========================================================

  const handleDepartmentSubmit =
    async (data) => {
      try {
        if (!departmentId) {
          throw new Error(
            "Department ID is missing."
          );
        }

        const payload = {
          name:
            data.departmentName.trim(),

          department_code:
            data.departmentCode.trim(),

          head_of_department:
            data.headOfDepartment || "",

          team_lead:
            data.teamLead || "",
        };

        console.log(
          "Updating department:",
          {
            id: departmentId,
            data: payload,
          }
        );

        // ===============================================
        // CALL UPDATE API
        // ===============================================

        const result =
          await dispatch(
            updateDepartmentById({
              id: departmentId,
              data: payload,
            })
          ).unwrap();

        console.log(
          "Department updated successfully:",
          result
        );

        // ===============================================
        // CLOSE MODAL
        // ===============================================

        setShowDepartmentModal(
          false
        );

        // ===============================================
        // REFRESH DEPARTMENT DETAILS
        // ===============================================

        dispatch(
          getDepartmentById(
            departmentId
          )
        );

        return result;
      } catch (error) {
        console.error(
          "Department update failed:",
          error
        );

        // VERY IMPORTANT:
        // Throw error so DepartmentModal
        // can display backend validation.
        throw error;
      }
    };

  // =========================================================
  // LOADING
  // =========================================================

  if (loadingEmployees) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        Loading department
        employees...
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#ef4444",
        }}
      >
        Failed to load department
        employees.
      </div>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      style={{
        width: "100%",
        padding: "20px",
        boxSizing:
          "border-box",
      }}
    >
      {/* HEADER */}

      <ReusableHeader
        title={
          current?.name ||
          departmentData
            ?.departmentName ||
          "Department Details"
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
          currentPage={
            currentPage
          }
          totalPages={
            totalPages
          }
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
        departments={[]}
        onSubmit={
          handleDepartmentSubmit
        }
      />
    </div>
  );
};

export default DepartmentDetails;