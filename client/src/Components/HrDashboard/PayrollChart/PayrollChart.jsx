import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import Card from "../Common/Card";
import CardHeader from "../Common/CardHeader";
import Dropdown from "../Common/Dropdown";

import {
  Container,
  ChartContainer,
  LegendContainer,
  LegendItem,
  Dot,
  TooltipBox,
  TooltipTitle,
  TooltipValue,
} from "./PayrollChart.styles";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[payload.length - 1];

    return (
      <TooltipBox>
        <TooltipTitle color={item.fill}>
          {item.name}
        </TooltipTitle>

        <TooltipValue>
          SAR {item.value.toLocaleString()}
        </TooltipValue>
      </TooltipBox>
    );
  }

  return null;
};

const PayrollChart = ({ data }) => {
  return (
    <Card>
      <Container>
        <CardHeader
          title="Payroll Category"
          control={
            <>
              <LegendContainer>
                <LegendItem>
                  <Dot color="#3657C8" />
                  Salary
                </LegendItem>

                <LegendItem>
                  <Dot color="#E58D2B" />
                  Incentive
                </LegendItem>

                <LegendItem>
                  <Dot color="#F44336" />
                  Deduction
                </LegendItem>
              </LegendContainer>

              <Dropdown label="2026" />
            </>
          }
        />

        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              barCategoryGap="30%"
            >
              <CartesianGrid
                stroke="#ECECEC"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
              />

             <YAxis
  tickLine={false}
  axisLine={false}
  domain={[0, 'auto']}
  tickFormatter={(value) => {
    if (value === 0) return "0";
    if (value < 100000) return `${value / 1000}K`;
    return `${value / 100000}L`;
  }}
/>

              <Tooltip
                cursor={false}
                content={<CustomTooltip />}
              />

              <Bar
                stackId="payroll"
                dataKey="deduction"
                fill="#F44336"
                name="Deduction"
              />

              <Bar
                stackId="payroll"
                dataKey="incentive"
                fill="#E58D2B"
                name="Incentive"
              />

              <Bar
                stackId="payroll"
                dataKey="salary"
                fill="#3657C8"
                name="Salary"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Container>
    </Card>
  );
};

export default PayrollChart;