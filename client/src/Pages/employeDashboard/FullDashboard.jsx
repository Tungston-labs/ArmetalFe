import React, { useState, useEffect } from "react";
import Sample from "./Sample"; // Left Side
import Employeedashboard from "./Employeedashboard"; // Right Side
import styled from "styled-components";
import Loader from "../../Components/Loader"
import BottomCard from "./BottomCard"
const Wrapper = styled.div`
  background: #f4f4f4;
  // display: flex;
  // flex-direction: row;
  min-height: 100vh;
  height: auto;
padding:20px;
  @media (max-width: 768px) {
    flex-direction: column; /* stack vertically on small screens */
  }
`;


const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  // width: 100vw;
`;

const FullDashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fake delay to simulate API or data fetch
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <LoaderWrapper>
        <Loader size="large" tip="Loading Dashboard..." />
      </LoaderWrapper>
    );
  }

  return (
    <Wrapper>
      <div style={{display:"flex", width:"100%",height:"100%"}}>
      <Sample />
      <Employeedashboard />
      </div>
<BottomCard/>
    </Wrapper>
  );
};

export default FullDashboard;
