import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useNavigate } from "react-router-dom";
import { BsArrowUpRightCircleFill } from "react-icons/bs";


import { ChartWrapper, ChartTitle, ChartContainer, IconButton } from "./ReimbursementSummary.Styles";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "white",
          padding: "8px 12px",
          border: "1px solid #ddd",
          borderRadius: "5px",
        }}
      >
        <p><strong>{label}</strong></p>
        <p>Count: <strong>{payload[0].value}</strong></p>
      </div>
    );
  }
  return null;
};

const ReimbursementLineChart = ({ data }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/reimbursement"); // <--- change to your page route
  };

  const dataMap = {};

  if (data) {
    Object.entries(data).forEach(([yearMonth, count]) => {
      const [year, month] = yearMonth.split("-");
      const monthIndex = parseInt(month);
      dataMap[monthIndex] = count;
    });
  }

  const chartData = monthNames.map((name, index) => {
    const monthIndex = index + 1;
    return {
      month: name,
      count: dataMap[monthIndex] || 0,
    };
  });

  const allZero = chartData.every((item) => item.count === 0);
  if (!data || allZero) {
    return <p style={{ textAlign: "center" }}>No data found</p>;
  }

  return (
    <ChartWrapper>
      {/* TITLE + ARROW ICON */}
     <ChartTitle>
  <span>Reimbursement Summary</span>

  <IconButton onClick={handleNavigate}>
    <BsArrowUpRightCircleFill />
  </IconButton>
</ChartTitle>


      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" interval={0} /> 
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey="count"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ChartWrapper>
  );
};

export default ReimbursementLineChart;
