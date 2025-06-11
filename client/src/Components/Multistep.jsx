// Multistep.jsx
import React from "react";
import {  ConfigProvider,Steps } from "antd";
import { StepsWrapper } from "./Multistep.Style";

const items = [
  { title: "Basic Details" },
  { title: "In Progress", subTitle: "Left 00:00:08" },
  { title: "Waiting" },
];

const Multistep = () => (
    <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#2F4CAC", // ← green
      },
    }}
  >
  <StepsWrapper>
    <Steps 
      current={1}
      labelPlacement="vertical" // titles will appear under the numbers
      items={items}
    />
  </StepsWrapper>
  </ConfigProvider>
);

export default Multistep;
