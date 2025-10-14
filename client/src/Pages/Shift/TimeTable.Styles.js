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
  grid-template-columns: 55% 5.5% 30%;
  background-color: #304eb0;
  color: white;
  padding: 15px 15px;
  font-weight: bold;
  font-size: 14px;
  text-align: left;
  @media (max-width: 768px) {
    font-size: 12px;
    grid-template-columns: 55% 20.5% 40%;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 12px;
    grid-template-columns: 50% 12.5% 30%;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 12px;
    grid-template-columns: 50.5% 9.5% 40%;
  }
  @media (min-width: 1441px) and (max-width: 1700px) {
    font-size: 14px;
    grid-template-columns: 54% 6.5% 40%;
  }

  @media (min-width: 1701px) and (max-width: 2060px) {
    font-size: 14px;
    grid-template-columns: 55% 5.5% 40%;
  }
  @media (min-width: 2060px) and (max-width: 2600px) {
    font-size: 14px;
        grid-template-columns: 56% 4.5% 40%;

  }
  @media (min-width: 2601px) and (max-width: 3840px) {
    font-size: 14px;
        grid-template-columns: 56.9% 3.5% 40%;

  }

  @media (min-width: 3841px) {
    font-size: 14px;
        grid-template-columns: 57.5% 3% 40%;

  }
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 60% 40%;
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
  /* gap: 10px; */
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
  background-color: #fd907b;
  color: black;
  padding: 10px;
  width: 80px;
  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 12px;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 12px;
  }
  @media (min-width: 1441px) and (max-width: 1700px) {
    font-size: 14px;
  }

  @media (min-width: 1701px) and (max-width: 2060px) {
    font-size: 14px;
  }
  @media (min-width: 2060px) and (max-width: 2600px) {
    font-size: 14px;
  }
  @media (min-width: 2561px) and (max-width: 3840px) {
    font-size: 14px;
  }

  @media (min-width: 3841px) {
    font-size: 14px;
  }
`;
export const TimeSeparator = styled.span`
  color: #888;
  margin: 0 10px;
  font-size: 13px;

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 12px;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 12px;
  }

  @media (min-width: 1441px) and (max-width: 1700px) {
    font-size: 14px;
  }

  @media (min-width: 1701px) and (max-width: 2060px) {
    font-size: 14px;
  }

  @media (min-width: 2060px) and (max-width: 2600px) {
    font-size: 14px;
  }

  @media (min-width: 2561px) and (max-width: 3840px) {
    font-size: 14px;
  }

  @media (min-width: 3841px) {
    font-size: 14px;
  }
`;
export const TimeIn = styled.span`
  font-size: 13px;
  background-color: #304eb0;
  color: white;
  padding: 10px;
  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 12px;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 12px;
  }
  @media (min-width: 1441px) and (max-width: 1700px) {
    font-size: 14px;
  }

  @media (min-width: 1701px) and (max-width: 2060px) {
    font-size: 14px;
  }
  @media (min-width: 2060px) and (max-width: 2600px) {
    font-size: 14px;
  }
  @media (min-width: 2561px) and (max-width: 3840px) {
    font-size: 14px;
  }

  @media (min-width: 3841px) {
    font-size: 14px;
  }
`;

export const LocationBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  width: 480px; /* base width */

  @media (max-width: 768px) {
    width: 260px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 270px;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    width: 320px;
  }
  @media (min-width: 1441px) and (max-width: 1700px) {
    width: 400px;
  }

  @media (min-width: 1701px) and (max-width: 2060px) {
    width: 460px;
  }
  @media (min-width: 2060px) and (max-width: 2600px) {
    width: 510px;
  }
  @media (min-width: 2561px) and (max-width: 3840px) {
    width: 640px;
  }

  @media (min-width: 3841px) {
    width: 750px;
  }
`;

export const LocationText = styled.p`
  margin: 0;
  color: #304eb0;
  /* line-height: 1.4; */
  font-size: 13px;

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 12px;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 12px;
  }
  @media (min-width: 1441px) and (max-width: 1700px) {
    font-size: 14px;
  }

  @media (min-width: 1701px) and (max-width: 2060px) {
    font-size: 14px;
  }
  @media (min-width: 2060px) and (max-width: 2600px) {
    font-size: 14px;
  }
  @media (min-width: 2561px) and (max-width: 3840px) {
    font-size: 14px;
  }

  @media (min-width: 3841px) {
    font-size: 14px;
  }
`;
