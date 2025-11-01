import styled from "styled-components";

export const ChartContainer = styled.div`
  width: 100%;
  max-width: 400px;
  height: 400px;
  margin: 0 auto;
  position: relative;
`;

export const CenterText = styled.div`
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
`;

export const CenterTitle = styled.h1`
  font-size: clamp(1.2rem, 3vw, 2rem);
  margin: 0;
  font-family: "Satoshi", sans-serif;
`;

export const CenterSubtitle = styled.p`
  font-size: clamp(0.8rem, 2vw, 1rem);
  margin: 0;
  font-family: "Raleway", sans-serif;
  font-weight: 600;
`;

export const CustomLegend = styled.div`
  margin-top: -6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const LegendColor = styled.span`
  width: 14px;
  height: 14px;
  background-color: ${({ color }) => color || "#ccc"};
  display: inline-block;
  border-radius: 2px;
`;

export const LegendLabel = styled.span`
  font-family: "Satoshi", sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
`;
