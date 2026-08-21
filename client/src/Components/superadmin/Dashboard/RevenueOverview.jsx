import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  RevenueContainer,
  RevenueHeader,
  RevenueTitle,
  MonthButton,
  ChartContainer,
} from "./RevenueOverview.Styles";

const revenueData = [
  { month: "Jan", revenue: 1.9 },
  { month: "Feb", revenue: 3.05 },
  { month: "Mar", revenue: 2.35 },
  { month: "Apr", revenue: 0.72 },
  { month: "May", revenue: 2.1 },
  { month: "Jun", revenue: 2.15 },
  { month: "Jul", revenue: 1.85 },
  { month: "Aug", revenue: 3.0 },
  { month: "Sep", revenue: 2.35 },
  { month: "Oct", revenue: 0.7 },
  { month: "Nov", revenue: 2.1 },
  { month: "Dec", revenue: 2.15 },
];

const RevenueOverview = () => {
  return (
    <RevenueContainer>
      <RevenueHeader>
        <RevenueTitle>Revenue Overview</RevenueTitle>

        <MonthButton>
          <FaCalendarAlt />
          THIS MONTH
        </MonthButton>
      </RevenueHeader>

      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={revenueData}
            margin={{
              top: 5,
              right: 5,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid
              horizontal={true}
              vertical={false}
              stroke="#dedede"
            />

            <XAxis
              dataKey="month"
              tick={{
                fontSize: 10,
                fill: "#666",
              }}
              axisLine={{
                stroke: "#888",
              }}
              tickLine={false}
            />

            <YAxis
              domain={[0, 4]}
              ticks={[0, 1, 2, 3, 4]}
              tickFormatter={(value) =>
                value === 0 ? "0" : `SAR ${value}M`
              }
              tick={{
                fontSize: 10,
                fill: "#666",
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              formatter={(value) => [`SAR ${value}M`, "Revenue"]}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                fontSize: "11px",
              }}
            />

            <Line
              type="linear"
              dataKey="revenue"
              stroke="#f47c20"
              strokeWidth={2}
              dot={{
                r: 3,
                fill: "#ffffff",
                stroke: "#f47c20",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 5,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </RevenueContainer>
  );
};

export default RevenueOverview;