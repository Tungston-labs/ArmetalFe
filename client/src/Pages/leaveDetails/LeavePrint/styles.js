import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 30px;
  background: white;
  width: 100%;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;

  h1 {
    color: #304eb0;
    margin: 0;
  }

  p {
    color: #666;
    margin-top: 8px;
  }
`;

export const SectionTitle = styled.h3`
  margin-top: 30px;
  color: #304eb0;
`;

export const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
`;

export const Card = styled.div`
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 12px;
  text-align: center;

  span {
    color: gray;
    font-size: 14px;
  }

  h2 {
    margin-top: 10px;
    color: #304eb0;
  }
`;

export const BreakDown = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 15px;
`;

export const BreakCard = styled.div`
  padding: 16px;
  background: #f4f7ff;
  border-radius: 10px;
  flex: 1;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th {
    background: #304eb0;
    color: white;
    padding: 12px;
  }

  td {
    padding: 10px;
    border: 1px solid #ddd;
  }
`;