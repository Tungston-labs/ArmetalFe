import React, { useState, useEffect } from "react";
import Sample from "./Sample"; 
import Employeedashboard from "./Employeedashboard"; 
import styled from "styled-components";
import Loader from "../../Components/Loader"
import BottomCard from "./BottomCard"
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "../../Components/Navbar";

const Wrapper = styled.div`
  background: #f4f4f4;
  min-height: 100vh;
  height: auto;
  padding: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  border: 1px solid #172554;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  margin-bottom: 1rem;
  font-weight: 500;
color:#3250B5;

  &:hover {
    background: #f0f0f0;
  }
`;

const FullDashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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

  return (<>
<Navbar/>
    <Wrapper>
      {/* Back Button */}
      <BackButton onClick={() => navigate(-1)}>
        <FaArrowLeft /> 
      </BackButton>

      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <Sample />
        <Employeedashboard />
      </div>
      <BottomCard />
    </Wrapper>
      </>
  );
};

export default FullDashboard;
