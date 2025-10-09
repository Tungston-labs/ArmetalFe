import styled from "styled-components";

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 8px;
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); */
  background: #fff;
`;

export const TableHeader = styled.div`
  display: grid;
grid-template-columns: 53% 11% 30%;
  background-color: #304EB0;
  color: white;
  padding: 15px 15px;
  font-weight: bold;
  font-size: 14px;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 12px;
    grid-template-columns: 1fr; /* stack on mobile */
  }
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 70% 30%; 
  align-items: center;
  /* border-bottom: 1px solid #e5e5e5; */
  padding: 0px 1px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    row-gap: 10px;
  }
`;


export const TableCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 5px;
`;

export const TableBoarder = styled.div`
box-shadow: 0px 0px 2.7px 0px #00000047;
  padding: 5px 10px;
`;

export const TimeBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const Line = styled.div`
  flex: 1;
  height: 1px;
  background-color: #e0e0e0;
  margin: 0 8px;
`;
export const TimeBox = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.bg || "#ccc"};
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  font-weight: 600;
  min-width: 90px;
`;

export const TimeOut = styled.span`
  font-size: 13px;
  background-color: #FD907B;
  color: black;
  padding: 10px;
`;
export const TimeIn = styled.span`
  font-size: 13px;
  background-color: #304EB0;
  color: white;
  padding: 10px;
`;

export const LocationBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;

`;


export const LocationText = styled.p`
  margin: 0;
  color: #304EB0;
  line-height: 1.4;
  font-size: 13px;
`;
