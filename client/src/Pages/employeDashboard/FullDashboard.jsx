import React, { useState, useEffect } from "react";
import LeftContent from "./LeftContent";
import Employeedashboard from "./Employeedashboard";
import styled from "styled-components";
import Loader from "../../Components/Loader";
import BottomCard from "./BottomCard";
import { useNavigate, useLocation, useParams } from "react-router-dom";
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
  color: #000;

  &:hover {
    background: #f0f0f0;
  }
`;

const FullDashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeId } = useParams();

 useEffect(() => {
  setLoading(false);
}, []);


  if (loading) {
    return (
      <LoaderWrapper>
        <Loader size="large" tip="Loading Dashboard..." />
      </LoaderWrapper>
    );
  }

  // ✅ Get previous page (Visa or Employee list)
  const previousPage = location.state?.from || "/employee";

  // ✅ Correct back handler
  const handleBack = () => {
    navigate(previousPage, { replace: true });
  };

  return (
    <>
      <Navbar />
      <Wrapper>
        {/* ✅ Back Button fixed */}
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back
        </BackButton>

        <div style={{ display: "flex", width: "100%", height: "100%" }}>
          <LeftContent employeeId={employeeId} />
          <Employeedashboard employeeId={employeeId} />
        </div>

        <BottomCard />
      </Wrapper>
    </>
  );
};

export default FullDashboard;
