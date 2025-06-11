// 

import styled from 'styled-components';

export const DashboardContainer = styled.div`
  // margin-left: 250px;
  padding: 40px 20px;
  background: #f8faf4;
 

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 20px 10px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

export const StatCard = styled.div`
  background: url('/images/cards.png');
  background-color: #e5e7eb;
  padding: 20px;
  border-radius: 16px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const CardTitle = styled.p`
  font-weight: 600;
  color: #111827;
`;

export const CardValue = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #111;
`;

export const DepartmentSection = styled.div``;

export const DepartmentCard = styled.div`
  background: #e5eaf4;
  padding: 15px;
  border-radius: 12px;
`;

export const HeadInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  small {
    font-size: 0.75rem;
    color: #6b7280;
  }

  p {
    margin: 0;
    font-weight: 500;
  }
`;

export const Avatar = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-left: 10px;
`;

export const ViewMoreButton = styled.button`
  background: linear-gradient(to right, #1e3a8a, #3b82f6);
  color: white;
  font-weight: 600;
  padding: 20px;
  border-radius: 12px;
  border: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
