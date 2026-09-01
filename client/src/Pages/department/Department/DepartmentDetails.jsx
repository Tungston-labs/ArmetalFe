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
  getDepartments,
  getEmployeesByDepartment,
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

  const { id: departmentId } = useParams();

  const [search, setSearch] = useState("");

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
    list: departmentList,
    departmentEmployees,
    loading,
    loadingEmployees,
    error,
  } = useSelector(
    (state) => state.departments
  );


  // =========================================================
  // GET DEPARTMENTS + EMPLOYEES
  // =========================================================

  useEffect(() => {
    if (!departmentId) return;

    // Get all departments
    dispatch(
      getDepartments({
        page: 1,
        search: "",
      })
    );

    // Get employees of selected department
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
  // GET CURRENT DEPARTMENT FROM DEPARTMENT LIST
  // =========================================================

  const currentDepartment = useMemo(() => {
    if (!Array.isArray(departmentList)) {
      return null;
    }

    return departmentList.find(
      (department) =>
        String(department.id) ===
        String(departmentId)
    );
  }, [
    departmentList,
    departmentId,
  ]);


  // =========================================================
  // EMPLOYEES
  // =========================================================

  const employees = useMemo(() => {
    if (
      Array.isArray(departmentEmployees)
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

const employeeTableData = useMemo(() => {
  return employees.map((employee, index) => ({
    slNo: index + 1,

    id: employee.id,

    name:
      employee.name ||
      employee.employee_name ||
      employee.full_name ||
      "-",

    employee_code:
      employee.employee_code ||
      employee.employee_id ||
      "-",

    email:
      employee.email ||
      "-",

    designation:
      employee.designation ||
      employee.job_position ||
      "-",

    profile_pic:
      employee.profile_pic ||
      null,

    // Keep attendance status available for stats
    status:
      employee.today_attendance_status ||
      employee.status ||
      "",
  }));
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
            .includes(searchValue) ||

          String(
            employee.employee_id
          )
            .toLowerCase()
            .includes(searchValue)
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

 const departmentCards = useMemo(() => {
  const totalEmployees =
    Number(currentDepartment?.employee_count) || 0;

  const presentEmployees =
    Number(currentDepartment?.attendance_employee_count) || 0;

  const leaveEmployees =
    Number(currentDepartment?.todays_leave_employee_count) || 0;

  const absentEmployees = Math.max(
    totalEmployees - presentEmployees - leaveEmployees,
    0
  );

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
}, [currentDepartment]);

  // =========================================================
  // EDIT DEPARTMENT
  // =========================================================

  const handleEditDepartment =
    () => {
      const department =
        currentDepartment ||
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
      });

      setShowDepartmentModal(
        true
      );
    };


  // =========================================================
  // UPDATE DEPARTMENT
  // =========================================================

 const handleDepartmentSubmit = async (data) => {
  try {
    if (!departmentId) {
      throw new Error("Department ID is missing.");
    }

    const payload = {
      name: data.departmentName.trim(),
      department_code: data.departmentCode.trim(),
      department_head_id: data.headOfDepartment
        ? Number(data.headOfDepartment)
        : null,
    };

    console.log("Updating department:", {
      id: departmentId,
      data: payload,
    });

    const result = await dispatch(
      updateDepartmentById({
        id: departmentId,
        data: payload,
      })
    ).unwrap();

    console.log("Department updated successfully:", result);

    setShowDepartmentModal(false);

    dispatch(
      getDepartments({
        page: 1,
        search: "",
      })
    );

    return result;
  } catch (error) {
    console.error("Department update failed:", error);
    throw error;
  }
};

  // =========================================================
  // LOADING EMPLOYEES
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
        boxSizing: "border-box",
      }}
    >

      {/* =====================================================
          HEADER
      ====================================================== */}

      <ReusableHeader
        title={
          currentDepartment?.name ||
          currentDepartment?.departmentName ||
          departmentData?.departmentName ||
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


      {/* =====================================================
          STATS
      ====================================================== */}

      <StatsCards
        cards={departmentCards}
      />


      {/* =====================================================
          SEARCH
      ====================================================== */}

      <ReusableFilter
        search={search}
        onSearch={handleSearch}
        showSearch
         searchPlaceholder="Search by Employee Name "
      />


      {/* =====================================================
          TABLE
      ====================================================== */}

      <ReusableTable
        columns={
          departmentEmployeeColumns
        }

        data={paginatedData}
      />


      {/* =====================================================
          PAGINATION
      ====================================================== */}

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


      {/* =====================================================
          EDIT MODAL
      ====================================================== */}

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