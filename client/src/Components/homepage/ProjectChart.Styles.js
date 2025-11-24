// ProjectChart.Styles.js
import styled from "styled-components";

export const ChartCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
`;

export const ChartTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
`;

/* Tooltip box styling */
export const TooltipBox = styled.div`
  background: white;
  padding: 10px 14px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: 1px solid #e2e8f0;

  .label {
    margin: 0;
    font-weight: 600;
    color: #1e293b;
  }

  .value {
    margin: 0;
    margin-top: 4px;
    color: #3b5bff;
    font-weight: 500;
  }
`;
