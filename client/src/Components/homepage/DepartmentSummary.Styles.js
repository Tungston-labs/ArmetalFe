import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;

`;

export const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 18px;
`;

/* 2 Column Grid */
export const GridBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

/* COUNT CARD */
export const CountCard = styled.div`
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  padding: 30px 20px;
  border-radius: 20px;
  text-align: center;
  color: white;
  box-shadow: 0px 4px 12px rgba(99, 102, 241, 0.3);
`;

export const CountNumber = styled.h1`
  font-size: 54px;
  margin: 0;
  font-weight: 800;
`;

export const CountLabel = styled.p`
  margin: 10px 0 0;
  font-size: 16px;
  opacity: 0.95;
`;

/* LATEST CARD */
export const LatestCard = styled.div`
  background: #f8fafc;
  padding: 20px 24px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
`;

export const LatestHeader = styled.h3`
  font-size: 18px;
  color: #475569;
  font-weight: 600;
  margin-bottom: 16px;
`;

export const LatestItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`;

export const DeptName = styled.span`
  font-weight: 600;
  color: #0f172a;
`;

export const DeptDate = styled.span`
  color: #64748b;
  font-size: 14px;
`;

export const NoData = styled.p`
  text-align: center;
  color: #94a3b8;
  font-size: 15px;
  padding: 10px 0;
`;
