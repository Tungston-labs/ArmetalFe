import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;
export const ModalWrapper = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  width: 600px;
  height: auto;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #3250b5;
  }
`;

export const CloseBtn = styled.button`
  background: #304eb0;
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
`;

export const ModalDate = styled.div`
  display: flex;
  align-items: center;
  font-family: "Krona One", sans-serif;

  .day {
    font-size: 36px;
    font-weight: 700;
    color: #000;
    margin-right: 8px;
    line-height: 1;
  }

  .month-week {
    display: flex;
    flex-direction: column;
    line-height: 1.1;

    .month {
      font-size: 14px;
      color: #111;
      font-weight: 600;
    }

    .weekday {
      font-size: 12px;
      color: #555;
    }
  }
`;


export const Table = styled.div`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  background: #304eb0;
  color: #fff;
  padding: 8px 12px;
  font-weight: 600;
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  padding: 8px 12px;
  background: ${({ even }) => (even ? "#f2fff7ff" : "#fff")};
`;

export const TableCell = styled.div`
  padding: 4px 8px;
  word-break: break-word;
`;
