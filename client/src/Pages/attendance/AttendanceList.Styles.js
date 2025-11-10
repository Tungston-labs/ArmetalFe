import styled from "styled-components";

export const PageContainer = styled.div`
  padding: 20px;
  min-height: 100vh;
`;

export const Title = styled.h1`
  text-align: center;
  color: #172554;
  margin-bottom: 2rem;
`;

export const DepartmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const DepartmentCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden; /* Prevent content overflow on animation */

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const DepartmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DepartmentName = styled.h2`
  color: #172554;
  font-size: 1.2rem;
`;

export const EmployeeCount = styled.span`
  color: #172554;
  font-weight: 500;
`;

export const DropdownWrapper = styled.div`
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 10px 10px;
  margin-top: 0.75rem;
  animation: dropdownOpen 0.3s ease forwards;

  @keyframes dropdownOpen {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const EmployeeList = styled.ul`
  list-style: none;
  padding: 0.5rem 1rem;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
`;

export const EmployeeItem = styled.li`
  padding: 0.6rem 0;
  border-bottom: 1px solid #eee;
  font-size: 1rem;
  color: #333;
  transition: background 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }
`;
export const DropdownHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  background: #3352BA;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #d1d5db;
  border-radius: 8px 8px 0 0;
`;

export const EmployeeRow = styled.li`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 0.6rem 1rem;
  border-bottom: 1px solid #eee;
  font-size: 0.95rem;
  color: #333;
  transition: background 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const EmployeeCell = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
export const NoRecordMessage = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
  padding: 1rem;
  font-style: italic;
`;
