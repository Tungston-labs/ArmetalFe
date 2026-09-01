import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDepartments } from "../../Redux/departmentSlice";
import { getGroupedReimbursements } from "../../services/reimbursement";

import {
  Container,
  HeaderWrapper,
  CardsGrid,
  Card,
  CardHeader,
  ReimbursementName,
  StatusBadge,
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

const DEFAULT_AVATAR = "https://i.pravatar.cc/100?img=1";

const ReimbursementCards = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("all");
  const [allReimbursements, setAllReimbursements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { list: departmentList = [] } = useSelector((state) => state.departments);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch departments
      await dispatch(getDepartments({ page: 1, search: "" })).unwrap();
      
      // 2. Fetch all grouped reimbursements
      const groupedData = await getGroupedReimbursements();
      const groups = Array.isArray(groupedData) ? groupedData : groupedData?.results || [];
      const flatList = groups.flatMap((group) => group.reimbursements || []);
      setAllReimbursements(flatList);
    } catch (err) {
      console.error("Failed to load reimbursement cards:", err);
      setError(err?.message || "Something went wrong while loading data.");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Search and Filter
  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleViewReimbursement = (deptId) => {
    navigate(`/reimbursements/${deptId}`);
  };

  // Process department cards - Only show departments that have reimbursement requests (>0)
  const deptCards = departmentList
    .map((dept) => {
      // Filter reimbursements for this department
      const deptReimbursements = allReimbursements.filter(
        (r) => String(r.department?.id) === String(dept.id)
      );

      const totalRequests = deptReimbursements.length;

      const totalAmount = deptReimbursements.reduce(
        (sum, r) => sum + Number(r.amount || 0),
        0
      );

      const approvedAmount = deptReimbursements
        .filter((r) => r.status === "Approve" || r.status === "Approved")
        .reduce((sum, r) => sum + Number(r.amount || 0), 0);

      // Unique employees list
      const uniqueEmployees = [];
      const empIds = new Set();
      deptReimbursements.forEach((r) => {
        if (r.employee_id && !empIds.has(r.employee_id)) {
          empIds.add(r.employee_id);
          uniqueEmployees.push({
            id: r.employee_id,
            name: r.employee_name,
            image: r.profile_pic || DEFAULT_AVATAR,
          });
        }
      });

      const headName = dept.department_head?.name || "N/A";

      return {
        id: dept.id,
        name: dept.name,
        head: headName,
        totalRequests,
        totalAmount,
        approvedAmount,
        employees: uniqueEmployees.slice(0, 3), // Show up to 3 avatars
        employeeCount: empIds.size,
      };
    })
    .filter((card) => card.totalRequests > 0);

  // Filter Cards by Selected Dropdown and Search Text
  const filteredCards = deptCards.filter((card) => {
    const matchesDeptFilter =
      selectedDeptFilter === "all" || String(card.id) === String(selectedDeptFilter);
    const matchesSearch =
      card.name.toLowerCase().includes(search.toLowerCase()) ||
      card.head.toLowerCase().includes(search.toLowerCase());
    return matchesDeptFilter && matchesSearch;
  });

  const departmentOptions = departmentList.map((d) => ({
    label: d.name,
    value: d.id,
  }));

  return (
    <Container>
      <HeaderWrapper>
        <ReusableHeader
          title="Reimbursement"
          breadcrumbs={["Dashboard", "Reimbursement"]}
          buttonText="History"
          onButtonClick={() => navigate("/reimbursement")}
        />
      </HeaderWrapper>

      {/* REUSABLE FILTER COMPONENT */}
      <div style={{ marginBottom: "20px" }}>
        <ReusableFilter
          search={search}
          onSearch={handleSearch}
          searchPlaceholder="Search Employee ID"
          showSearch
          department={selectedDeptFilter === "all" ? "" : selectedDeptFilter}
          departments={departmentOptions}
          onDepartment={(val) => setSelectedDeptFilter(val || "all")}
          showDepartment
        />
      </div>

      {/* LOADING & ERROR STATES */}
      {loading && <p>Loading department cards...</p>}

      {!loading && error && (
        <p style={{ color: "red" }}>
          {error}{" "}
          <button type="button" onClick={loadData}>
            Retry
          </button>
        </p>
      )}

      {!loading && !error && filteredCards.length === 0 && (
        <p>No reimbursement cards found.</p>
      )}

      {/* CARDS GRID */}
      {!loading && !error && filteredCards.length > 0 && (
        <CardsGrid>
          {filteredCards.map((card) => (
            <Card key={card.id}>
              <CardHeader>
                <ReimbursementName>
                  {card.name} DEPARTMENT
                </ReimbursementName>
                <StatusBadge status="Approved">
                  Active
                </StatusBadge>
              </CardHeader>

              <div
                style={{
                  fontSize: "12px",
                  color: "#3154d8",
                  fontWeight: "600",
                  marginBottom: "12px",
                  fontFamily: "Poppins, sans-serif"
                }}
              >
                Head Of The Department : {card.head}
              </div>

              <div
                style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  background: "#fff4e9",
                  color: "#f47c20",
                  fontSize: "11px",
                  fontWeight: "500",
                  borderRadius: "4px",
                  marginBottom: "8px",
                  fontFamily: "Poppins, sans-serif"
                }}
              >
                Total Request : {String(card.totalRequests).padStart(2, "0")}
              </div>

              <StatusRow>
                <ApprovedAmount>
                  Approved : ₹{card.approvedAmount.toLocaleString("en-IN")}
                </ApprovedAmount>
                <PendingAmount>
                  Total AMT : ₹{card.totalAmount.toLocaleString("en-IN")}
                </PendingAmount>
              </StatusRow>

              <CardBottom>
                <EmployeeCount>
                  {card.employees.map((emp, idx) => (
                    <EmployeeImage
                      key={emp.id}
                      src={emp.image}
                      alt={emp.name}
                      style={{
                        marginLeft: idx > 0 ? "-8px" : "0",
                        zIndex: 3 - idx
                      }}
                    />
                  ))}
                  {card.employeeCount > 0 && (
                    <ReimbursementNumber>
                      {String(card.employeeCount).padStart(2, "0")}
                    </ReimbursementNumber>
                  )}
                </EmployeeCount>

                <ViewButton type="button" onClick={() => handleViewReimbursement(card.id)}>
                  VIEW REQUEST
                </ViewButton>
              </CardBottom>
            </Card>
          ))}
        </CardsGrid>
      )}
    </Container>
  );
};

export default ReimbursementCards;