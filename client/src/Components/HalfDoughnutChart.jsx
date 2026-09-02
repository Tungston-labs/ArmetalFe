import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { useNavigate } from "react-router-dom";
import {
  ChartContainer,
  CenterText,
  CenterTitle,
  CenterSubtitle,
  CustomLegend,
  LegendItem,
  LegendColor,
  LegendLabel,
} from "./HalfDoughnutChart.Styles";

ChartJS.register(ArcElement, Tooltip);

const HalfDoughnutChart = ({ active, onLeave }) => {
  const total = active + onLeave;
  const navigate = useNavigate();

const screenWidth = window.innerWidth;

let borderWidth;

if (screenWidth <= 768) {
  borderWidth = 10;
} else if (screenWidth <= 1024) {
  borderWidth = 14;
} else if (screenWidth <= 1440) {
  borderWidth = 18;
} else if (screenWidth <= 1920) {
  borderWidth = 10;
} else {
  borderWidth = 26;
}

const data = {
  labels: ["Active Employees", "On Leave Today"],
  datasets: [
    {
      data: [active, onLeave],
      backgroundColor: ["#2f4ded", "#ff6b5f"],
      borderColor: "#fff",
      borderWidth: borderWidth,   
      borderRadius: 10,
      cutout: "68%",
      circumference: 180,
      rotation: -90,
    },
  ],
};

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    onClick: (evt, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        if (index === 0) navigate("/employee-attendance");
        if (index === 1) navigate("/employee-on-leave");
      }
    },
  };

  return (
    <ChartContainer>
      <Doughnut data={data} options={options} />

      <CenterText>
        <CenterTitle>{total}</CenterTitle>
        <CenterSubtitle>Total Employees</CenterSubtitle>
      </CenterText>

      <CustomLegend>
        <LegendItem>
          <LegendColor color="#2f4ded" />
          <LegendLabel>Active Employees</LegendLabel>
        </LegendItem>

        <LegendItem>
          <LegendColor color="#ff6b5f" />
          <LegendLabel>On Leave Today</LegendLabel>
        </LegendItem>
      </CustomLegend>
    </ChartContainer>
  );
};

export default HalfDoughnutChart;
