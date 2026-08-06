import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
  min-height: 100vh;
`;

export const TableCard = styled.div`
  border-radius: 6px;
  overflow: hidden;
`;

export const TableHeader = styled.div`
  border-bottom: 1px solid #ccc;
  margin-bottom: 15px;
`;

export const Title = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #222;
  margin: 0;
  font-family: "Poppins";
font-weight: 400;
font-style: Regular;
font-size: 16px;
line-height: 18px;
letter-spacing: 0%;

`;

export const TitleUnderline = styled.div`
  width: 110px;
  height: 3px;
  background: #ff8a1f;
  margin-top: 10px;
`;