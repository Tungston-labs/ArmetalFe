// Multistep.jsx
import React from "react";
import { ConfigProvider, Steps } from "antd";
import { StepsWrapper } from "./Multistep.Style";

const items = [
  { title: "Basic Details" },
  { title: "Bank and payment details" },
  { title: "Documents" },
];

const Multistep = ({ currentStep }) => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#2F4CAC", // step highlight color
      },
    }}
  >
    <StepsWrapper>
      <Steps 
        current={currentStep} // <-- use dynamic value
        labelPlacement="vertical"
        items={items}
      />
    </StepsWrapper>
  </ConfigProvider>
);

export default Multistep;
