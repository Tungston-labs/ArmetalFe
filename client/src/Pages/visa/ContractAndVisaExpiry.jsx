import React, { useEffect, useState } from "react";
import {
  Container,
} from "./Visa.Styles";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllEmployees,
  getUpcomingExpiryEmployees,
} from "../../Redux/employeeSlice";
import Loader from "../../Components/Loader/Loader";
import Pagination from "../../Components/Pagination/Pagination"
import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";

const ContractAndVisaExpiry = () => {
  const dispatch = useDispatch();

  const { employeeList, loading, pagination } = useSelector(
    (state) => state.employees
  );
  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user")
  );

  const country = user?.company?.country || "IN";
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expiryFilter, setExpiryFilter] = useState("");

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    if (expiryFilter) {
      dispatch(
        getUpcomingExpiryEmployees({
          expiryType: expiryFilter,
          page,
          search: debouncedSearch,
        })
      );
    } else {
      dispatch(getAllEmployees({ page, search: debouncedSearch }));
    }
  }, [dispatch, page, debouncedSearch, expiryFilter]);

  useEffect(() => {
    if (pagination?.total_pages && page > pagination.total_pages) {
      setPage(pagination.total_pages);
    }
  }, [pagination?.total_pages]);

  const handleSearch = (value) => {
    setSearchText(value);
    setPage(1);
  };

  const formatDate = (date) => {
    if (!date) return "----";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const currentPage = pagination?.current_page || 1;

  const handlePageChange = (newPage) => {
    if (!newPage || newPage < 1) return;
    setPage(newPage);
  };

  const columns = [
    {
      header: "Sl No",
      accessor: "slNo",
      sortable: false,
      render: (row, index) => index + 1 + (currentPage - 1) * 20,
    },
    {
      header: "Employee name",
      accessor: "name",
      render: (row) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 600 }}>
            {row.name ? row.name.charAt(0).toUpperCase() + row.name.slice(1) : ""}
          </span>
          <span style={{ fontSize: 12, color: "#888" }}>{row.email}</span>
        </div>
      ),
    },
    {
      header: "Employee ID",
      accessor: "employee_id",
      sortable: false,
      render: (row) => row.employee_id,
    },
    {
      header: "Email",
      accessor: "email",
      sortable: false,
      render: (row) => row.email,
    },
    {
      header: country === "IN" ? "Contract Expiry Date" : "Visa Expiry Date",
      accessor: "expiry_date",
      sortable: false,
      render: (row) =>
        country === "IN"
          ? formatDate(row.contract_expiry_date)
          : formatDate(row.visa_expiry_date),
    },
  ];

  return (
    <>
      <Container>
        {loading && (
          <Loader />
        )}

        <ReusableHeader
          title="Employees"
          breadcrumbs={["Employees", "Visa & Contract"]}

        />
        <ReusableFilter
          search={searchText}
          onSearch={handleSearch}

          status={expiryFilter}
          statuses={[
            "contract",
            "visa",
          ]}
          onStatus={setExpiryFilter}

          showSearch
          showStatus
        />
        <ReusableTable
          columns={columns}
          data={employeeList || []}
          loading={loading}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={pagination?.total_pages || 1}
          onPageChange={handlePageChange}
        />
      </Container>
    </>
  );
};

export default ContractAndVisaExpiry;