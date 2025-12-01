import styled from "styled-components";

export const Card = styled.div`
  width: 350px;
  background: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  font-family: "Inter", sans-serif;
`;

export const Title = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #222;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const Label = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #666;
`;

export const Value = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #222;
`;
