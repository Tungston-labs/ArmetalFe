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

import { ChartWrapper, ChartTitle, ChartContainer } from "./ReimbursementSummary.Styles";

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
  // Convert response to: { 1:count, 2:count, ... }
  const dataMap = {};

  if (data) {
    Object.entries(data).forEach(([yearMonth, count]) => {
      const [year, month] = yearMonth.split("-");
      const monthIndex = parseInt(month); // 1-12
      dataMap[monthIndex] = count;
    });
  }

  // Build chart data for 12 months
  const chartData = monthNames.map((name, index) => {
    const monthIndex = index + 1; // 1-12
    return {
      month: name,
      count: dataMap[monthIndex] || 0,
    };
  });

  // Check if everything is zero
  const allZero = chartData.every((item) => item.count === 0);
  if (!data || allZero) {
    return <p style={{ textAlign: "center" }}>No data found</p>;
  }

  return (
    <ChartWrapper>
      <ChartTitle>Reimbursement Summary</ChartTitle>

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
