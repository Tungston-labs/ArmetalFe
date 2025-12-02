import React from "react";
import {
  CardsWrapper,
  Card,
  CardHeader,
  CardTitle,
  CardValue,
  IconWrapper
} from "./EmployeeCards.styles";

import { FaMoneyBillWave, FaFileInvoice, FaCalendarAlt, FaUserCheck } from "react-icons/fa";

const EmployeeCards = ({ employee }) => {
  if (!employee) return null;

  const cardData = [
    {
      title: "Salary",
      value: `₹ ${employee.salary || "0"}`,
      icon: <FaMoneyBillWave color="#e53935" />,
      bg: "#ffe0e0",
    },
    {
      title: "Contract / Visa Expiry",
      value: employee.contract || employee.visa_expiry_date || "—",
      icon: <FaCalendarAlt color="#ff9800" />,
      bg: "#fff3e0",
    },
    {
      title: "Leave Taken",
      value: employee.leave_taken || "0",
      icon: <FaUserCheck color="#43a047" />,
      bg: "#e0ffe0",
    },
    {
      title: "Pending Leave",
      value: employee.pending_leave || "0",
      icon: <FaUserCheck color="#1e88e5" />,
      bg: "#e0f0ff",
    },
  ];

  return (
    <CardsWrapper>
      {cardData.map((item, index) => (
        <Card key={index}>
          <CardHeader>
            <IconWrapper bg={item.bg}>{item.icon}</IconWrapper>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardValue>{item.value}</CardValue>
        </Card>
      ))}
    </CardsWrapper>
  );
};

export default EmployeeCards;
