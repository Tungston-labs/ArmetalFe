import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  Scatter,
} from "recharts";

import Card from "../Common/Card";
import CardHeader from "../Common/CardHeader";

import {
  Container,
  ChartContainer,
} from "./AttendanceTrend.styles";

const AttendanceTrend = ({ data }) => {
  const referencePoints = [
    { day: "Thu", value: 160 },
    { day: "Thu", value: 90 },
    { day: "Thu", value: 60 },
  ];

  return (
    <Card>
      <CardHeader title="Weekly Attendance Trend" />

      <Container>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 15,
                right: 10,
                left: -15,
                bottom: 0,
              }}
            >
              <CartesianGrid
                vertical={false}
                stroke="#E5E7EB"
              />

              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[50, 280]}
              />

              <Tooltip />

              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
              />

              <ReferenceLine
                x="Thu"
                stroke="#9CA3AF"
                strokeDasharray="5 5"
              />

              <Line
                type="monotone"
                dataKey="present"
                stroke="#16A34A"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />

              <Line
                type="monotone"
                dataKey="absent"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />

              <Line
                type="monotone"
                dataKey="late"
                stroke="#FF2D0A"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Container>
    </Card>
  );
};

export default AttendanceTrend;