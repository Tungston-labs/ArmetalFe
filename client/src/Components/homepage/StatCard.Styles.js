import styled from "styled-components";

export const CardBox = styled.div`
  background: white;
  padding: 22px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 6px solid #3352BA;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 15px rgba(0,0,0,0.12);
  }
`;

export const LeftSection = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

export const RightSection = styled.div``;

export const IconBox = styled.div`
  width: 45px;
  height: 45px;
  background: #e9efff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3352BA;
`;

export const StatNumber = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #3352BA;
`;

export const StatLabel = styled.div`
  font-size: 15px;
  color: #555;
`;

export const Arrow = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: #3352BA;
`;
