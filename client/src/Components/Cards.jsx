// Cards.jsx
import React from "react";
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
  EmployeeAvatar,
  EmployeeName,
  EmployeeId,
  EmployeeDept,
  IconWrapper,
} from "./Card.Styles";
import { FiArrowUpRight } from "react-icons/fi";
import { FaUsers, FaUserClock, FaPassport } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import totalIcon from "../assets/total.svg";
import totalIcons from "../assets/total2.svg";
import totalIconses from "../assets/total3.svg";
const Cards = () => {
  const { summary } = useSelector((state) => state.dashboard);

  // Extract API lists
  const employeesList = summary?.total_employees?.list || [];
  const leaveRequest = summary?.pending_leaves?.list || [];
  const visaExpiryList = summary?.upcoming_visa_expiry?.list || [];

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
              <CardCount>{summary?.total_employees?.count || 0}</CardCount>
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
      marginRight: "10px"
    }}
  />
  <EmployeeName>{emp.name}</EmployeeName>
  <EmployeeDept>{emp.department}</EmployeeDept>
   <EmployeeId className="below-name">{emp.employee_id}</EmployeeId>
</CardListItem>

              ))}
              <IconWrapper>
                <Link to="/employee">
                  <FiArrowUpRight style={{color:"blue"}}  size={20} />
                </Link>
              </IconWrapper>
            </CardList>
          </CardContent>
        </CardHeader>
      </Card>

      {/* Employee Leave Request */}
      <Card>
        <CardHeader>
         <IconSection>
  <img src={totalIcons} alt="Total Employees" width={35} height={35} />
</IconSection>
          <Divider />
          <CardContent>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <CardTitle>Employee Leave Request</CardTitle>
              <CardCount>{summary?.pending_leaves?.count || 0}</CardCount>
            </div>
            <CardList>
              {leaveRequest.slice(0, 3).map((emp) => (
         <CardListItem key={emp.id}>
  <img
    src={emp.profile_pic || "https://via.placeholder.com/40"} 
    alt={emp.name}
    style={{
      width: "25px",
      height: "25px",
      borderRadius: "50%",
      objectFit: "cover",
      marginRight: "10px"
    }}
  />
  <EmployeeName>{emp.employee}</EmployeeName>
  <EmployeeDept>{emp.department}</EmployeeDept>
 <EmployeeId className="leave-date">
  <span className="from-date">{emp.from_date}</span>
  <span className="to-date"> – {emp.to_date}</span>
  <span className="continue-sign"> →</span>
</EmployeeId>

</CardListItem>

              ))}
              <IconWrapper>
                <Link to="/leave-request">
                  <FiArrowUpRight style={{color:"blue"}} size={20} />
                </Link>
              </IconWrapper>
            </CardList>
          </CardContent>
        </CardHeader>
      </Card>

      {/* Employee Visa Expiry */}
      <Card>
        <CardHeader>
          <IconSection>
  <img src={totalIconses} alt="Total Employees" width={35} height={35} />
</IconSection>
          <Divider />
          <CardContent>
            <div style={{ display: "flex", justifyContent: "space-between"}}>
              <CardTitle>Employee Visa Expiry</CardTitle>
              <CardCount>{summary?.upcoming_visa_expiry?.count || 0}</CardCount>
            </div>
            <CardList>
              {visaExpiryList.slice(0, 3).map((emp) => (
                <CardListItem key={emp.id}>
                  <img
    src={emp.profile_pic|| "https://via.placeholder.com/40"} 
    alt={emp.name}
    style={{
      width: "25px",
      height: "25px",
      borderRadius: "50%",
      objectFit: "cover",
      marginRight: "10px"
    }}
  />
                  <EmployeeName>{emp.name}</EmployeeName>
                  <EmployeeDept>{emp.department}</EmployeeDept>
                  <EmployeeId className="visa-date">{emp.visa_expiry_date}</EmployeeId>
                </CardListItem>
              ))}
              <IconWrapper>
                <Link to="/employee-Contract-Visa-Expiry">
                  <FiArrowUpRight style={{color:"blue"}} size={20} />
                </Link>
              </IconWrapper>
            </CardList>
          </CardContent>
        </CardHeader>
      </Card>
    </CardContainer>
  );
};

export default Cards;
