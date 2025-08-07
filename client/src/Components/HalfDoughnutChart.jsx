// src/components/HalfDoughnutChart.jsx
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { BiBorderRadius } from "react-icons/bi";

ChartJS.register(ArcElement, Tooltip);

const HalfDoughnutChart = ({ active, onLeave }) => {
  const total = active + onLeave;

  const data = {
    labels: ["Active Employees", "On Leave Today"],
   datasets: [
  {
    data: [active, onLeave],
    backgroundColor: ["#2f4ded", "#ff6b5f"],
    borderColor: "#f7f9fc", // Or match your background
    borderWidth: 4,          // Controls the gap size
    borderRadius: 12,        // Rounded ends between segments
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
  };

  return (
    <div style={{ width: "100%", height: "150px", position: "relative" }}>
      <Doughnut data={data} options={options} />
      <div
        style={{
          position: "absolute",
          top: "80%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <h1>{total}</h1>
        <p>Total Employees</p>
      </div>
    </div>
  );
};

export default HalfDoughnutChart;
