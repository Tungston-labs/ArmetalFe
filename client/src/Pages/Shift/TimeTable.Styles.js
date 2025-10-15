import styled from "styled-components";

export const TableContainer = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 8px;
  overflow-x: auto;
  font-family: "Satoshi", sans-serif;
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 10px;
padding: 0px 10px;
  .time-section {
    flex: 2;

    .time-box {
      background-color: #304eb0;
      color: white;
      padding: 10px 30px;
      font-weight: 600;
      font-size: 14px;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-transform: capitalize;
    }
  }

  .location-section {
    flex: 1;

    div {
      background-color: #304eb0;
      color: white;
      padding: 10px 20px;
      font-weight: 600;
      font-size: 14px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
      text-transform: capitalize;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;

    .time-section,
    .location-section {
      width: 100%;
    }

    .time-box {
      justify-content: space-around;
    }
  }
`;

/* TABLE ROW */
export const TableRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 10px;
  /* border-bottom: 1px solid #eaeaea; */
  padding: 8px 10px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

/* TIME SECTION (matches header) */
export const TimeSection = styled.div`
  flex: 2;
  background: #ffffff;
  box-shadow: 0px 0px 2.7px 0px #00000047;
  border-radius: 6px;
  padding: 8px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .time-in {
    font-size: 13px;
    background-color: #304eb0;
    color: white;
    padding: 8px 14px;
    border-radius: 4px;
    font-weight: 600;
    white-space: nowrap;
    min-width: 80px;
    text-align: center;
  }

  .time-out {
    font-size: 13px;
    background-color: #fd907b;
    color: black;
    padding: 8px 14px;
    border-radius: 4px;
    font-weight: 600;
    white-space: nowrap;
    min-width: 80px;
    text-align: center;
  }

  .time-separator {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0 8px;
    position: relative;

    &::before {
      content: "";
      flex: 1;
      border-bottom: 2px dotted #ccc;
    }

    .to-text {
      flex: none;
      padding: 0 8px;
      font-size: 13px;
      font-weight: 600;
      color: #555;
    }

    &::after {
      content: "";
      flex: 1;
      border-bottom: 2px dotted #ccc;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 6px;

    .time-separator {
      &::before,
      &::after {
        display: none;
      }
    }
  }
`;

/* LOCATION SECTION */
export const LocationSection = styled.div`
  flex: 1;
  background: #ffffff;
  box-shadow: 0px 0px 2.7px 0px #00000047;
  border-radius: 4px;
  padding: 8px 14px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;

  svg {
    color: #304eb0;
    flex-shrink: 0;
    margin-top: 4px;
  }

  p {
    margin: 0;
    color: #304eb0;
    font-weight: 600;
  }

  .note {
    margin-top: 4px;
    color: #555;
    font-weight: 400;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 4px;
  }
`;
