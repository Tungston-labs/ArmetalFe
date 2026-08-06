import styled from "styled-components";

const breakpoints = {
  mobile: "480px",
  tablet: "768px",
  laptop: "1024px",
  desktop: "1440px",
};

export const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 25px;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const LeftSection = styled.div`
  flex: 1;
  min-width: 250px;
`;

export const RightSection = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    justify-content: flex-start;
  }
`;

export const PageTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 500;
  color: #3250BC;
  font-weight: "poppins", sans-serif;
`;

export const Breadcrumb = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  /* margin-top: 8px; */
`;

export const BreadcrumbItem = styled.span`
  font-size: 14px;
  color: #666;
`;

export const ActionButton = styled.button`
  height: 40px;
  padding: 0 20px;
  border: none;
  border-radius: 5px;
  background: #3352BA;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: .3s;

  &:hover {
    background: #1638b8;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;