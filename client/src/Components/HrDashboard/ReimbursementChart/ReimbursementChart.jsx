import React, { useState, useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Sector } from "recharts";

import Card from "../Common/Card";
import CardHeader from "../Common/CardHeader";
import Dropdown from "../Common/Dropdown";

import {
  Wrapper,
  ChartWrapper,
  CenterCircle,
  CenterDot,
  CenterLabel,
  CenterValue,
  DetailRow,
  DetailName,
  DetailSub,
  DetailAmount,
  Legend,
  LegendItem,
  ColorDot,
  LegendLabel,
  LegendCount,
} from "./ReimbursementChart.styles";

const RAW_DATA = [
  { name: "Approved", count: 110, amount: 14650, color: "#4F6EF7" },
  { name: "Paid", count: 60, amount: 8200, color: "#10B981" },
  { name: "Rejected", count: 30, amount: 3100, color: "#F43F5E" },
  { name: "Pending", count: 25, amount: 2400, color: "#F59E0B" },
];

const currency = (n) =>
  `SAR ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

// Hovered sector — slightly larger radius, rounded caps
const ActiveSector = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 7}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      cornerRadius={10}
    />
  );
};

// Idle sectors — normal radius, rounded caps, dimmed if a sibling is active
const IdleSector = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, fillOpacity } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      fillOpacity={fillOpacity}
      cornerRadius={10}
    />
  );
};

const ReimbursementChart = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const total = useMemo(() => RAW_DATA.reduce((sum, d) => sum + d.count, 0), []);

  const data = useMemo(
    () =>
      RAW_DATA.map((d) => ({
        ...d,
        value: d.count, // fixed: was hardcoded to 25 for every item, flattening real proportions
        pct: Math.round((d.count / total) * 100),
      })),
    [total]
  );

  const active = activeIndex !== null ? data[activeIndex] : null;
  const shown = active ?? data[0];

  return (
    <Card>
      <CardHeader
        title="Reimbursement Status"
        control={<Dropdown options={["July", "June", "May"]} value="July" />}
      />

      <Wrapper>
        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                startAngle={90}
                endAngle={450}
                innerRadius={62}
                outerRadius={92}
                paddingAngle={3}
                stroke="none"
                cornerRadius={10}
                activeIndex={activeIndex}
                activeShape={ActiveSector}
                inactiveShape={IdleSector}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                animationDuration={500}
              >
                {data.map((d, i) => (
                  <Cell
                    key={d.name}
                    fill={d.color}
                    fillOpacity={activeIndex === null || activeIndex === i ? 1 : 0.35}
                    style={{ transition: "fill-opacity 200ms ease", cursor: "pointer" }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <CenterCircle>
            {active ? (
              <>
                <CenterDot color={active.color} />
                <CenterLabel>{active.name}</CenterLabel>
                <CenterValue small>{active.pct}%</CenterValue>
              </>
            ) : (
              <>
                <CenterLabel muted>Total</CenterLabel>
                <CenterValue>{total}</CenterValue>
              </>
            )}
          </CenterCircle>
        </ChartWrapper>

        <DetailRow>
          <div>
            <DetailName color={shown.color}>
              {shown.name} · {shown.count}
            </DetailName>
            <DetailSub>{shown.pct}% of total requests</DetailSub>
          </div>
          <DetailAmount>{currency(shown.amount)}</DetailAmount>
        </DetailRow>

      
      </Wrapper>
    </Card>
  );
};

export default ReimbursementChart;