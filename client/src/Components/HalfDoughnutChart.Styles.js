import styled from "styled-components";

export const ChartContainer = styled.div`
  width: 100%;
  max-width: 300px;
  height: 300px;
  margin: 0 auto;
  position: relative;

  @media (min-width: 768px) {
    max-width: 400px;
    height: 300px;
  }@media (min-width: 768px) {
    max-width: 400px;
    height: 300px;
  }
 @media (min-width: 1024px) {
    max-width: 250px;
    height: 350px;
    
  }
  @media (min-width: 1440px) {
    max-width: 600px;
    height: 400px;
  }

  @media (min-width: 1920px) {
    max-width: 700px;
    height: 500px;
  }

  @media (min-width: 3840px) {
    max-width: 900px;
    height: 700px;
  }
`;

export const CenterText = styled.div`
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
`;

export const CenterTitle = styled.h1`
  margin: 0;
  font-family: "Satoshi", sans-serif;
  font-weight: 700;
  color: #222;

  font-size: 1rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
  @media (min-width: 769px) and (max-width:1024px) {
    font-size: 1rem;
  }
  @media (min-width: 1440px) {
    font-size: 1.8rem;
  }

  @media (min-width: 1920px) {
    font-size: 2.2rem;
  }

  @media (min-width: 3840px) {
    font-size: 2.8rem; /* 4K */
  }
`;

export const CenterSubtitle = styled.p`
  margin: 0;
  font-family: "Raleway", sans-serif;
  font-weight: 600;
  color: #555;

  font-size: 0.8rem;

  @media (min-width: 768px) {
    font-size: 0.9rem;
  }

  @media (min-width: 1440px) {
    font-size: 1rem;
  }

  @media (min-width: 1920px) {
    font-size: 1.2rem;
  }

  @media (min-width: 3840px) {
    font-size: 1.5rem; /* 4K */
  }
`;

export const CustomLegend = styled.div`
  margin-top: -6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  @media (min-width: 1440px) {
    gap: 10px;
  }

  @media (min-width: 1920px) {
    gap: 12px;
  }

  @media (min-width: 3840px) {
    gap: 16px;
  }
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (min-width: 1440px) {
    gap: 12px;
  }

  @media (min-width: 1920px) {
    gap: 14px;
  }

  @media (min-width: 3840px) {
    gap: 18px;
  }
`;

export const LegendColor = styled.span`
  width: 14px;
  height: 14px;
  background-color: ${({ color }) => color || "#ccc"};
  display: inline-block;
  border-radius: 2px;

  @media (min-width: 768px) {
    width: 16px;
    height: 16px;
  }

  @media (min-width: 1440px) {
    width: 18px;
    height: 18px;
  }

  @media (min-width: 1920px) {
    width: 22px;
    height: 22px;
  }

  @media (min-width: 3840px) {
    width: 28px;
    height: 28px; /* 4K */
  }
`;

export const LegendLabel = styled.span`
  font-family: "Satoshi", sans-serif;
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;

  @media (min-width: 768px) {
    font-size: 0.8rem;
  }

  @media (min-width: 769px) and (max-width:1024px) {
    font-size: 0.8rem;
  }
  @media (min-width: 1440px) {
    font-size: 1.2rem;
  }

  @media (min-width: 1920px) {
    font-size: 1.4rem;
  }

  @media (min-width: 3840px) {
    font-size: 1.8rem; /* 4K */
  }
`;
