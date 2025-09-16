// src/components/HalfDoughnutChart.jsx
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip);

const HalfDoughnutChart = ({ active, onLeave }) => {
  const total = active + onLeave;
  const navigate = useNavigate();

  const data = {
    labels: ["Active Employees", "On Leave Today"],
    datasets: [
      {
        data: [active, onLeave],
        backgroundColor: ["#2f4ded", "#ff6b5f"],
        borderColor: "#f7f9fc",
        borderWidth: 4,
        borderRadius: 12,
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
      legend: { display: false }, // ❌ hide default legend
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
    <div
      style={{
        width: "100%",
        maxWidth: "400px",
        height: "250px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <Doughnut data={data} options={options} />

      {/* Center text */}
      <div
        style={{
          position: "absolute",
          top: "60%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.2rem, 3vw, 2rem)",
            margin: 0,
            fontFamily: "satoshi",
          }}
        >
          {total}
        </h1>
        <p
          style={{
            fontSize: "clamp(0.8rem, 2vw, 1rem)",
            margin: 0,
            fontFamily: "raleway",
            fontWeight: 600,
          }}
        >
          Total Employees
        </p>
      </div>

      {/* Custom Legend */}
      <div
        style={{
          marginTop: "-30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "14px",
              height: "14px",
              backgroundColor: "#2f4ded",
              display: "inline-block",
              borderRadius: "2px",
             fontFamily: "Satoshi",  
            }}
          ></span>
          <span style={{
            fontFamily: "Satoshi",  
          }}
          >Active Employees</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "14px",
              height: "14px",
              backgroundColor: "#ff6b5f",
              display: "inline-block",
              borderRadius: "2px",
              fontFamily: "Satoshi",  
            }}
          ></span>
          <span style={{
            fontFamily: "Satoshi",  
          }}
          >On Leave Today</span>
        </div>
      </div>
    </div>
  );
};

export default HalfDoughnutChart;
