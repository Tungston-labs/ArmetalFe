
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

import {
  ChartCard,
  ChartTitle,
  ChartWrapper,
  TooltipBox
} from "./ProjectChart.Styles";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <TooltipBox>
        <p className="label">{payload[0].name}</p>
        <p className="value">{payload[0].value}</p>
      </TooltipBox>
    );
  }
  return null;
};

const ProjectChart = ({ site, variant, bench }) => {
  const data = [
    { name: "On-Site", value: site },
    { name: "Variant", value: variant },
    { name: "Bench", value: bench }
  ];

  return (
    <ChartCard>
      <ChartTitle>Project Summary</ChartTitle>
 <ChartWrapper>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data}
          margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

          <XAxis 
            dataKey="name"
            tick={{ fill: "#334155", fontSize: 14, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} />


          <defs>
            <linearGradient id="barColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b5bff" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#3b5bff" stopOpacity={0.4} />
            </linearGradient>
          </defs>

          <Bar
            dataKey="value"
            fill="url(#barColor)"
            radius={[10, 10, 0, 0]}
            barSize={50}
       animationDuration={4000}
          />
        </BarChart>
      </ResponsiveContainer>
       </ChartWrapper>
    </ChartCard>
  );
};

export default ProjectChart;
