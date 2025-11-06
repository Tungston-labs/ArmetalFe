// Cards.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api"; // Your configured Axios instance
import {
  CardContainer,
  Card,
  CardHeader,
  IconSection,
  Divider,
  CardContent,
  CardTitle,
  CardCount,
  CardList,
  CardListItem,
  EmployeeName,
  EmployeeId,
  EmployeeDept,
  IconWrapper,
} from "./Card.Styles";
import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import totalIcon from "../assets/total.svg";
import totalIcons from "../assets/total2.svg";
import totalIconses from "../assets/total3.svg";

const Cards = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await API.get("/admin/dashboard-summary/");
        setSummary(response.data);
      } catch (err) {
        console.error("Failed to fetch summary:", err);
        setError("Failed to fetch dashboard summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!summary) return <p>No data available.</p>;

  const employeesList = summary.total_employees?.list || [];
  const leaveRequest = summary.pending_leaves?.list || [];
  const visaExpiryList = summary.upcoming_visa_expiry?.list || [];

  return (
    <CardContainer>
      {/* Total Employees */}
      <Card>
        <CardHeader>
          <IconSection>
            <img src={totalIcon} alt="Total Employees" width={35} height={35} />
          </IconSection>
          <Divider />
          <CardContent>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <CardTitle>Total Employees</CardTitle>
              <CardCount>{summary.total_employees?.count || 0}</CardCount>
            </div>
            <CardList>
              {employeesList.slice(0, 3).map((emp) => (
                <CardListItem key={emp.id}>
                  <img
                    src={emp.profile_pic || "https://via.placeholder.com/40"}
                    alt={emp.name}
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                  <EmployeeName>{emp.name}</EmployeeName>
                  <EmployeeDept>{emp.department}</EmployeeDept>
                  <EmployeeId>{emp.employee_id}</EmployeeId>
                </CardListItem>
              ))}
                 </CardList>
              <IconWrapper>
                <Link to="/employee">
                  <FiArrowUpRight style={{ color: "#304EB0" }} size={20} />
                </Link>
              </IconWrapper>
       
          </CardContent>
        </CardHeader>
      </Card>

      {/* Employee Leave Requests */}
      <Card>
        <CardHeader>
          <IconSection>
            <img src={totalIcons} alt="Leave Requests" width={35} height={35} />
          </IconSection>
          <Divider />
          <CardContent>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <CardTitle>Employee Leave Request</CardTitle>
              <CardCount>{summary.pending_leaves?.count || 0}</CardCount>
            </div>
            <CardList>
              {leaveRequest.slice(0, 3).map((emp) => (
                <CardListItem key={emp.id}>
                  <img
                    src={emp.profile_pic || "https://via.placeholder.com/40"}
                    alt={emp.employee}
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                  <EmployeeName>{emp.employee}</EmployeeName>
                  <EmployeeDept>{emp.department}</EmployeeDept>
                 <EmployeeId data-from={emp.from_date} data-to={emp.to_date}>
  <span>{emp.from_date}</span> – <span>{emp.to_date}</span>
</EmployeeId>

                </CardListItem>
              ))}
                 </CardList>
              <IconWrapper>
                <Link to="/employee-leave-request">
                  <FiArrowUpRight style={{ color: "#304EB0" }} size={20} />
                </Link>
              </IconWrapper>
         
          </CardContent>
        </CardHeader>
      </Card>

      {/* Employee Visa Expiry */}
      <Card>
        <CardHeader>
          <IconSection>
            <img src={totalIconses} alt="Visa Expiry" width={35} height={35} />
          </IconSection>
          <Divider />
          <CardContent>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <CardTitle>Employee Visa Expiry</CardTitle>
              <CardCount>{summary.upcoming_visa_expiry?.count || 0}</CardCount>
            </div>
            <CardList>
              {visaExpiryList.slice(0, 3).map((emp) => (
                <CardListItem key={emp.id}>
                  <img
                    src={emp.profile_pic || "https://via.placeholder.com/40"}
                    alt={emp.name}
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                  <EmployeeName>{emp.name}</EmployeeName>
                  <EmployeeDept>{emp.department}</EmployeeDept>
                  <EmployeeId>{emp.visa_expiry_date}</EmployeeId>
                </CardListItem>
              ))}
                 </CardList>
              <IconWrapper>
                <Link to="/employee-Contract-Visa-Expiry">
                  <FiArrowUpRight style={{ color: "#304EB0" }} size={20} />
                </Link>
              </IconWrapper>

          </CardContent>
        </CardHeader>
      </Card>
    </CardContainer>
  );
};

export default Cards;
