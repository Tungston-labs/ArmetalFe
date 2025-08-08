import React from "react";
import Sample from "./Sample"; // Left Side
import Employeedashboard from "./Employeedashboard"; // Right Side
import styled from "styled-components";

const Wrapper = styled.div`
  background: #F4F4F4;
  display: flex;
  flex-direction: row;
  height: 100vh;
//   width: 100vw;

`;

const FullDashboard = () => {
  return (
    <Wrapper>
      <Sample />
      <Employeedashboard />
    </Wrapper>
  );
};

export default FullDashboard;
