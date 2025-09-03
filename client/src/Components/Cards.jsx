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

const employees = [
  { name: "Desirae Westervelt", id: "1254125", dept: "Department" },
  { name: "Desirae Westervelt", id: "1254125", dept: "Department" },
  { name: "Desirae Westervelt", id: "1254125", dept: "Department" },
 
];

const DashboardCards = () => {
  return (
    <CardContainer>
      {/* Total Employees */}
      <Card>
        <CardHeader>
          <IconSection>
            <FaUsers size={28} color="#3352BA" />
          </IconSection>
          <Divider />
          <CardContent>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <CardTitle>Total Employees</CardTitle>
              <CardCount>12</CardCount>
            </div>
            <CardList>
              {employees.map((emp, idx) => (
                <CardListItem key={idx}>
                  <EmployeeAvatar />
                  <EmployeeName>{emp.name}</EmployeeName>
                  <EmployeeId>{emp.id}</EmployeeId>
                  <EmployeeDept>{emp.dept}</EmployeeDept>
                </CardListItem>
              ))}
              <IconWrapper>
                <FiArrowUpRight size={18} />
              </IconWrapper>
            </CardList>
          </CardContent>
        </CardHeader>
      </Card>

      {/* Employee Leave Request */}
      <Card>
        <CardHeader>
          <IconSection>
            <FaUserClock size={28} color="#3352BA" />
          </IconSection>
          <Divider />
          <CardContent>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <CardTitle>Employee Leave Request</CardTitle>
              <CardCount>12</CardCount>
            </div>
            <CardList>
              {employees.map((emp, idx) => (
                <CardListItem key={idx}>
                  <EmployeeAvatar />
                  <EmployeeName>{emp.name}</EmployeeName>
                  <EmployeeId>{emp.id}</EmployeeId>
                  <EmployeeDept>{emp.dept}</EmployeeDept>
                </CardListItem>
              ))}
              <IconWrapper>
                <FiArrowUpRight size={18} />
              </IconWrapper>
            </CardList>
          </CardContent>
        </CardHeader>
      </Card>

      {/* Employee Visa Expiry */}
      <Card>
        <CardHeader>
          <IconSection>
            <FaPassport size={28} color="#3352BA" />
          </IconSection>
          <Divider />
          <CardContent>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <CardTitle>Employee Visa Expiry</CardTitle>
              <CardCount>12</CardCount>
            </div>
            <CardList>
              {employees.map((emp, idx) => (
                <CardListItem key={idx}>
                  <EmployeeAvatar />
                  <EmployeeName>{emp.name}</EmployeeName>
                  <EmployeeId>{emp.id}</EmployeeId>
                  <EmployeeDept>{emp.dept}</EmployeeDept>
                </CardListItem>
              ))}
              <IconWrapper>
                <FiArrowUpRight size={18} />
              </IconWrapper>
            </CardList>
          </CardContent>
        </CardHeader>
      </Card>
    </CardContainer>
  );
};

export default DashboardCards;
