import React from "react";
import { BsBuildings } from "react-icons/bs";
import {
  StatsContainer,
  StatItem,
  StatIcon,
  StatValue,
  StatLabel,
} from "./DashboardStats.Styles";

const stats = [
  {
    value: "12",
    label: "Total Companies",
  },
  {
    value: "15000.00",
    label: "Total Revenue",
  },
  {
    value: "05",
    label: "Pending Payments",
  },
  {
    value: "Enterprise",
    label: "Most Ordered Plan",
  },
  {
    value: "10",
    label: "Active Subscriptions",
  },
  {
    value: "52",
    label: "Total Users",
  },
];

const DashboardStats = () => {
  return (
    <StatsContainer>
      {stats.map((stat, index) => (
        <StatItem key={index}>
          <StatIcon>
            <BsBuildings />
          </StatIcon>

          <StatValue>{stat.value}</StatValue>

          <StatLabel>{stat.label}</StatLabel>
        </StatItem>
      ))}
    </StatsContainer>
  );
};

export default DashboardStats;