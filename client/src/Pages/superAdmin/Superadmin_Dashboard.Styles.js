import styled from "styled-components";

export const DashboardWrapper = styled.div`
  font-family: "Satoshi", sans-serif;
  background: #f3f3f3;
  color: #111;
  min-height: 100vh;
  padding: clamp(1rem, 2vw, 2rem);
`;

export const Header = styled.header`
  margin-bottom: 1.5rem;
`;

export const Title = styled.h1`
  font-size: clamp(1.5rem, 2.5vw, 2.5rem);
  margin: 0;
`;

export const Subtitle = styled.p`
  color: #666;
  font-size: clamp(0.9rem, 1.2vw, 1rem);
  margin: 0.25rem 0 0;
`;

/* Blue Banner */
export const BlueBanner = styled.section`
  background: linear-gradient(186deg, #8963d3 9.99%, #110324 77.29%);
  border-radius: 10px;
  padding: clamp(1rem, 2vw, 2rem);
  color: #fff;
  margin-bottom: 2rem;
`;

export const BannerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;

  h2 {
    font-size: clamp(1.25rem, 2vw, 1.75rem);
    margin: 0;
  }

  p {
    font-size: clamp(0.8rem, 1vw, 1rem);
    margin: 0.25rem 0 0;
  }

  span {
    font-size: clamp(1.2rem, 2vw, 1.5rem);
    font-weight: bold;
  }
`;

export const CardContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 6px;
  }
`;

export const CompanyCard = styled.div`
  flex: 0 0 auto;
  background: #fff;
  color: #111;
  border-radius: 6px;
  padding: 1rem;
  min-width: 220px;
  max-width: 260px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  p {
    margin: 0.25rem 0 0;
    font-size: 0.85rem;
    color: #444;
  }
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 0.9rem;
  color: #444;
`;

export const CardSubtitle = styled.p`
  margin: 0.25rem 0;
  font-weight: bold;
  font-size: 1rem;
  color: #000;
`;

/* Table Section */
export const TableSection = styled.section`
  background: #fff;
  border-radius: 10px;
  padding: clamp(1rem, 2vw, 2rem);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;

  h2 {
    margin: 0;
    font-size: clamp(1rem, 2vw, 1.5rem);
  }

  p {
    margin: 0.25rem 0 0;
    color: #666;
    font-size: 0.9rem;
  }

  span {
    font-size: clamp(1rem, 2vw, 1.25rem);
    font-weight: bold;
    color: #000;
  }
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;

  th,
  td {
    padding: 0.75rem;
    text-align: left;
    font-size: clamp(0.8rem, 1vw, 0.95rem);
  }

  thead {
    background: #2a5bd7;
    color: #fff;
  }

  tbody tr:nth-child(even) {
    background: #f9f9f9;
  }
`;
