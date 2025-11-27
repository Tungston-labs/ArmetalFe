import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Wrapper, Title, LegendBox, LegendItem, ColorDot,DoughnutWrapper } from "./AttendanceCircle.styles";

ChartJS.register(ArcElement, Tooltip, Legend);

const AttendanceCircle = ({ present = 70, leave = 30 }) => {
  const data = {
    labels: ["Present", "Leave"],
    datasets: [
      {
        data: [present, leave],
        backgroundColor: ["#3352BA", "#f6413b"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const options = {
    rotation: -90,
    circumference: 180,
    plugins: {
      legend: { display: false }, 
    },
  };

  return (
    <Wrapper>
      <Title>Today's Attendance</Title>

<DoughnutWrapper>
  <Doughnut data={data} options={options} />
</DoughnutWrapper>

      <LegendBox>
        <LegendItem>
          <ColorDot color="#3352BA" />
          Present:70%
        </LegendItem>

        <LegendItem>
          <ColorDot color="#f6413b" />
          Leave:30%
        </LegendItem>
      </LegendBox>
    </Wrapper>
  );
};

export default AttendanceCircle;
